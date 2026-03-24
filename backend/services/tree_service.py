"""
TreeChat - 树服务
核心业务逻辑
"""

from datetime import datetime
from typing import Dict, List, Optional, Tuple

from ..database.db import (
    add_node,
    create_branch as db_create_branch,
    create_tree as db_create_tree,
    delete_node as db_delete_node,
    delete_tree as db_delete_tree,
    get_all_trees as db_get_all_trees,
    get_tree as db_get_tree,
    update_node as db_update_node,
    update_tree as db_update_tree,
)
from ..models.models import (
    AICompletionRequest,
    AICompletionResponse,
    BranchCreate,
    BranchResponse,
    ContextInfo,
    ContextMode,
    ConversationTree,
    ConversationTreeCreate,
    ConversationTreeResponse,
    MessageNode,
    MessageNodeCreate,
    MessageNodeUpdate,
    get_node_path,
)
from .ai_service import generate_completion, generate_summary, generate_title


# ============ 树操作 ============

def create_tree(req: ConversationTreeCreate) -> ConversationTree:
    """创建新对话树"""
    # 如果提供了初始消息，先生成标题
    title = req.title
    if not title and req.initial_message:
        import asyncio
        title = asyncio.run(generate_title(req.initial_message))
    elif title == "新对话":
        title = "新对话"
    
    tree = db_create_tree(
        title=title,
        initial_message=req.initial_message,
        tags=req.tags,
    )
    
    return tree


def get_tree(tree_id: str) -> Optional[ConversationTree]:
    """获取对话树"""
    return db_get_tree(tree_id)


def get_all_trees(limit: int = 50, offset: int = 0) -> List[ConversationTree]:
    """获取所有对话树"""
    return db_get_all_trees(limit=limit, offset=offset)


def update_tree_info(tree_id: str, title: str, tags: List[str]) -> Optional[ConversationTree]:
    """更新对话树信息"""
    tree = db_get_tree(tree_id)
    if not tree:
        return None
    
    tree.title = title
    tree.tags = tags
    tree.updated_at = datetime.utcnow()
    
    if db_update_tree(tree):
        return tree
    return None


def delete_tree(tree_id: str) -> bool:
    """删除对话树"""
    return db_delete_tree(tree_id)


def list_trees_summary(limit: int = 50, offset: int = 0) -> List[ConversationTreeResponse]:
    """获取对话树列表摘要"""
    trees = db_get_all_trees(limit=limit, offset=offset)
    
    summaries = []
    for tree in trees:
        summaries.append(ConversationTreeResponse(
            id=tree.id,
            title=tree.title,
            root_id=tree.root_id,
            active_node_id=tree.active_node_id,
            node_count=len(tree.nodes),
            created_at=tree.created_at,
            updated_at=tree.updated_at,
            tags=tree.tags,
        ))
    
    return summaries


# ============ 节点操作 ============

def add_message_node(tree_id: str, parent_id: Optional[str], role: str, content: str, tags: List[str] = None) -> Optional[MessageNode]:
    """添加消息节点"""
    from ..models.models import Role as RoleEnum
    role_enum = RoleEnum(role) if isinstance(role, str) else role
    
    return add_node(
        tree_id=tree_id,
        parent_id=parent_id,
        role=role_enum,
        content=content,
        tags=tags,
    )


def update_node_content(tree_id: str, node_id: str, update: MessageNodeUpdate) -> Optional[MessageNode]:
    """更新节点"""
    kwargs = {}
    if update.content is not None:
        kwargs["content"] = update.content
    if update.summary is not None:
        kwargs["summary"] = update.summary
    if update.tags is not None:
        kwargs["tags"] = update.tags
    
    if kwargs:
        return db_update_node(tree_id, node_id, **kwargs)
    return None


def delete_node(tree_id: str, node_id: str) -> bool:
    """删除节点"""
    return db_delete_node(tree_id, node_id)


def get_node(tree_id: str, node_id: str) -> Optional[MessageNode]:
    """获取指定节点"""
    tree = db_get_tree(tree_id)
    if not tree:
        return None
    return tree.nodes.get(node_id)


def get_path(tree_id: str, node_id: str) -> List[MessageNode]:
    """获取从根到节点的路径"""
    tree = db_get_tree(tree_id)
    if not tree:
        return []
    return get_node_path(tree, node_id)


def get_context_info(tree_id: str, node_id: str) -> Optional[ContextInfo]:
    """获取上下文信息"""
    tree = db_get_tree(tree_id)
    if not tree or node_id not in tree.nodes:
        return None
    
    path = get_node_path(tree, node_id)
    
    # 估算 token
    from ..models.models import build_context_messages, estimate_tokens
    messages = build_context_messages(tree, node_id, ContextMode.FULL)
    estimated_tokens = estimate_tokens(messages)
    
    return ContextInfo(
        node_id=node_id,
        path=path,
        mode=ContextMode.FULL,
        message_count=len(path),
        estimated_tokens=estimated_tokens,
    )


# ============ 分支操作 ============

def create_branch(tree_id: str, from_node_id: str, req: BranchCreate) -> Optional[BranchResponse]:
    """从指定节点创建分支"""
    # 创建分支节点
    new_node = db_create_branch(
        tree_id=tree_id,
        from_node_id=from_node_id,
        title=req.title,
        context_mode=req.context_mode,
        initial_message=req.initial_message,
    )
    
    if not new_node:
        return None
    
    # 获取路径
    tree = db_get_tree(tree_id)
    path = get_node_path(tree, new_node.id) if tree else []
    
    return BranchResponse(
        new_node_id=new_node.id,
        tree_id=tree_id,
        parent_id=from_node_id,
        title=req.title,
        context_mode=req.context_mode,
        tags=req.tags or [],
        path=[n.id for n in path],
    )


def switch_active_node(tree_id: str, node_id: str) -> bool:
    """切换活跃节点"""
    tree = db_get_tree(tree_id)
    if not tree or node_id not in tree.nodes:
        return False
    
    tree.active_node_id = node_id
    tree.updated_at = datetime.utcnow()
    
    return db_update_tree(tree)


# ============ AI 操作 ============

async def ai_completion(req: AICompletionRequest) -> Optional[AICompletionResponse]:
    """处理 AI 对话请求"""
    tree = db_get_tree(req.tree_id)
    if not tree:
        return None
    
    # 确定父节点
    parent_id = req.node_id or tree.active_node_id
    
    # 添加用户消息节点
    user_node = add_node(
        tree_id=req.tree_id,
        parent_id=parent_id,
        role="user",
        content=req.message,
    )
    
    if not user_node:
        return None
    
    # 生成 AI 回复
    assistant_message, usage = await generate_completion(
        tree=tree,
        node_id=parent_id,
        user_message=req.message,
        context_mode=req.context_mode,
        system_prompt=req.system_prompt,
    )
    
    # 添加 AI 回复节点
    assistant_node = add_node(
        tree_id=req.tree_id,
        parent_id=user_node.id,
        role="assistant",
        content=assistant_message,
    )
    
    if not assistant_node:
        return None
    
    # 如果需要，生成摘要（异步，不阻塞）
    if len(tree.nodes) % 5 == 0:  # 每 5 条消息生成一次摘要
        try:
            path = get_node_path(tree, assistant_node.id)
            summary = await generate_summary([
                {"role": n.role, "content": n.content}
                for n in path[-5:]
            ])
            if summary:
                db_update_node(req.tree_id, assistant_node.id, summary=summary)
        except Exception:
            pass  # 摘要生成失败不影响主流程
    
    return AICompletionResponse(
        user_node_id=user_node.id,
        assistant_node_id=assistant_node.id,
        tree_id=req.tree_id,
        usage=usage,
    )


# ============ 搜索操作 ============

def search_nodes(tree_id: Optional[str], query: str, tags: Optional[List[str]] = None, limit: int = 20) -> List[Tuple[MessageNode, float]]:
    """搜索节点（简单实现，后续可升级为向量搜索）"""
    results = []
    query_lower = query.lower()
    
    trees = [db_get_tree(tree_id)] if tree_id else db_get_all_trees(limit=100)
    
    for tree in trees:
        if not tree:
            continue
        
        for node in tree.nodes.values():
            # 文本匹配
            score = 0.0
            if query_lower in node.content.lower():
                score = 0.8
            elif query_lower in node.summary.lower() if node.summary else False:
                score = 0.6
            
            # 标签匹配
            if tags:
                if any(tag in node.tags for tag in tags):
                    score = max(score, 0.7)
            
            if score > 0:
                results.append((node, score))
    
    # 按分数排序
    results.sort(key=lambda x: x[1], reverse=True)
    return results[:limit]
