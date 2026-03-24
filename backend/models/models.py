"""
TreeChat - 核心数据模型
树状对话系统的核心数据结构
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


def generate_id(prefix: str = "node") -> str:
    """生成唯一 ID"""
    import uuid
    return f"{prefix}_{uuid.uuid4().hex[:12]}"


class Role(str, Enum):
    """消息角色"""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ContextMode(str, Enum):
    """上下文继承模式"""
    FULL = "full"        # 完整继承
    SUMMARY = "summary"  # 摘要模式
    COLD = "cold"        # 冷启动


# ============ 节点模型 ============

class MessageNode(BaseModel):
    """
    对话树中的单个节点
    
    对应 Git 中的一个 commit，但是是树状结构而非线性
    """
    id: str = Field(default_factory=lambda: generate_id("node"))
    
    # 树结构
    tree_id: str = Field(description="所属对话树 ID")
    parent_id: Optional[str] = Field(default=None, description="父节点 ID")
    children: List[str] = Field(default_factory=list, description="子节点 ID 列表")
    
    # 内容
    role: Role = Field(description="消息角色")
    content: str = Field(description="消息内容")
    
    # 时间戳
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # AI 相关
    summary: Optional[str] = Field(default=None, description="AI 生成的摘要")
    embedding: Optional[List[float]] = Field(default=None, description="向量表示")
    
    # 标签
    tags: List[str] = Field(default_factory=list, description="标签列表")
    
    # 统计
    edit_count: int = Field(default=0, description="编辑次数")
    
    class Config:
        use_enum_values = True


class MessageNodeCreate(BaseModel):
    """创建节点的请求"""
    tree_id: str
    parent_id: Optional[str] = None
    role: Role
    content: str
    tags: List[str] = []
    
    class Config:
        use_enum_values = True


class MessageNodeUpdate(BaseModel):
    """更新节点的请求"""
    content: Optional[str] = None
    summary: Optional[str] = None
    tags: Optional[List[str]] = None


# ============ 对话树模型 ============

class ConversationTree(BaseModel):
    """
    整棵对话树
    
    对应 Git 中的一个 repository
    """
    id: str = Field(default_factory=lambda: generate_id("tree"))
    title: str = Field(default="新对话", description="对话树标题")
    root_id: Optional[str] = Field(default=None, description="根节点 ID")
    
    # 节点存储 (id -> node)
    nodes: Dict[str, MessageNode] = Field(default_factory=dict)
    
    # 当前状态
    active_node_id: Optional[str] = Field(default=None, description="当前活跃节点")
    
    # 元数据
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # 标签
    tags: List[str] = Field(default_factory=list, description="标签列表")
    
    # 配置
    default_context_mode: ContextMode = Field(default=ContextMode.FULL)
    
    class Config:
        use_enum_values = True


class ConversationTreeCreate(BaseModel):
    """创建对话树的请求"""
    title: str = "新对话"
    initial_message: Optional[str] = Field(default=None, description="可选的初始消息")
    tags: List[str] = []


class ConversationTreeResponse(BaseModel):
    """对话树响应"""
    id: str
    title: str
    root_id: Optional[str]
    active_node_id: Optional[str]
    node_count: int
    created_at: datetime
    updated_at: datetime
    tags: List[str] = []
    
    class Config:
        from_attributes = True


# ============ 分支操作模型 ============

class BranchCreate(BaseModel):
    """创建分支的请求"""
    title: str = Field(description="分支标题")
    context_mode: ContextMode = Field(default=ContextMode.FULL, description="上下文继承模式")
    tags: List[str] = Field(default_factory=list)
    initial_message: Optional[str] = Field(default=None, description="可选的初始消息")


class BranchResponse(BaseModel):
    """分支响应"""
    new_node_id: str
    tree_id: str
    parent_id: Optional[str]
    title: str
    context_mode: ContextMode
    tags: List[str]
    path: List[str]  # 从根到新节点的路径
    
    class Config:
        use_enum_values = True


# ============ AI 消息模型 ============

class AICompletionRequest(BaseModel):
    """AI 补全请求"""
    tree_id: str
    node_id: Optional[str] = None  # 如果不提供，创建新节点
    message: str = Field(description="用户消息")
    context_mode: ContextMode = Field(default=ContextMode.FULL)
    system_prompt: Optional[str] = None  # 可选的额外系统提示


class AICompletionResponse(BaseModel):
    """AI 补全响应"""
    user_node_id: str
    assistant_node_id: str
    tree_id: str
    usage: Dict[str, int]  # token 使用统计


# ============ 上下文模型 ============

class ContextInfo(BaseModel):
    """上下文信息"""
    node_id: str
    path: List[MessageNode]  # 从根到当前节点的路径
    mode: ContextMode
    message_count: int
    estimated_tokens: int


# ============ 搜索模型 ============

class SearchQuery(BaseModel):
    """搜索请求"""
    query: str
    tree_id: Optional[str] = None  # 可选，限定在某个对话树内
    tags: Optional[List[str]] = None
    limit: int = 20


class SearchResult(BaseModel):
    """搜索结果"""
    node: MessageNode
    score: float
    highlight: Optional[str] = None


# ============ 工具函数 ============

def get_node_path(tree: ConversationTree, node_id: str) -> List[MessageNode]:
    """
    获取从根节点到指定节点的路径
    
    Args:
        tree: 对话树
        node_id: 目标节点 ID
        
    Returns:
        从根到节点的 MessageNode 列表
    """
    path = []
    current = tree.nodes.get(node_id)
    
    while current:
        path.insert(0, current)
        current = tree.nodes.get(current.parent_id) if current.parent_id else None
    
    return path


def build_context_messages(
    tree: ConversationTree,
    node_id: str,
    mode: ContextMode = ContextMode.FULL,
    max_tokens: int = 4000
) -> List[Dict[str, str]]:
    """
    构建发送给 AI 的上下文消息列表
    
    Args:
        tree: 对话树
        node_id: 当前节点 ID
        mode: 上下文模式
        max_tokens: 最大 token 数
        
    Returns:
        OpenAI 格式的消息列表 [{"role": ..., "content": ...}]
    """
    messages = []
    current = tree.nodes.get(node_id)
    
    # 回溯到根
    while current:
        if mode == ContextMode.FULL:
            messages.insert(0, {
                "role": current.role,
                "content": current.content
            })
        elif mode == ContextMode.SUMMARY:
            if current.summary:
                messages.insert(0, {
                    "role": "system",
                    "content": f"[分支摘要] {current.summary}"
                })
            else:
                messages.insert(0, {
                    "role": current.role,
                    "content": f"[内容摘要] {current.content[:200]}..."
                })
        # COLD 模式不添加任何历史
        
        current = tree.nodes.get(current.parent_id) if current.parent_id else None
    
    return messages


def estimate_tokens(messages: List[Dict[str, str]]) -> int:
    """
    粗略估算 token 数量
    
    简单估算：中文约 2 字符/token，英文约 4 字符/token
    """
    total = 0
    for msg in messages:
        content = msg.get("content", "")
        # 简单估算
        total += len(content) // 2
    return total
