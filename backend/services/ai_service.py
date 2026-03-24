"""
TreeChat - AI 服务
处理与 OpenAI API 的交互
"""

import os
from typing import Dict, List, Optional

from openai import AsyncOpenAI

from ..models.models import ContextMode, ConversationTree, MessageNode, build_context_messages

# 初始化 OpenAI 客户端
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


async def generate_completion(
    tree: ConversationTree,
    node_id: Optional[str],
    user_message: str,
    context_mode: ContextMode = ContextMode.FULL,
    system_prompt: Optional[str] = None,
) -> tuple[str, Dict[str, int]]:
    """
    生成 AI 回复
    
    Args:
        tree: 对话树
        node_id: 当前节点 ID（用于构建上下文）
        user_message: 用户消息
        context_mode: 上下文继承模式
        system_prompt: 可选的额外系统提示
        
    Returns:
        (assistant_message, usage_info)
    """
    # 构建消息列表
    messages = []
    
    # 系统提示
    default_system = "你是一个有帮助的 AI 助手。回答问题时清晰、准确、有条理。"
    if system_prompt:
        default_system = system_prompt
    
    messages.append({
        "role": "system",
        "content": default_system
    })
    
    # 历史上下文
    if node_id:
        context_messages = build_context_messages(tree, node_id, context_mode)
        messages.extend(context_messages)
    
    # 用户消息
    messages.append({
        "role": "user",
        "content": user_message
    })
    
    # 调用 API
    response = await client.chat.completions.create(
        model="gpt-4o-mini",  # 使用 Mini 版本节省成本
        messages=messages,
        temperature=0.7,
        max_tokens=2000,
    )
    
    assistant_message = response.choices[0].message.content
    usage = {
        "prompt_tokens": response.usage.prompt_tokens,
        "completion_tokens": response.usage.completion_tokens,
        "total_tokens": response.usage.total_tokens,
    }
    
    return assistant_message, usage


async def generate_summary(
    messages: List[Dict[str, str]],
) -> str:
    """
    为一组消息生成摘要
    
    Args:
        messages: 消息列表 [{"role": ..., "content": ...}]
        
    Returns:
        摘要文本
    """
    content = "\n\n".join([
        f"[{m['role']}]: {m['content'][:500]}..." if len(m['content']) > 500 else f"[{m['role']}]: {m['content']}"
        for m in messages if m.get("content")
    ])
    
    prompt = f"""请为以下对话分支生成简短摘要（不超过 150 字）。

要求：
1. 核心主题是什么
2. 关键结论或答案（如果有）
3. 延伸问题或探索方向（如果有）

只输出摘要，不要其他解释。

---
{content}
---
"""
    
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
        temperature=0.3,
    )
    
    return response.choices[0].message.content


async def generate_title(
    initial_message: str,
) -> str:
    """
    根据初始消息生成对话标题
    
    Args:
        initial_message: 用户的第一条消息
        
    Returns:
        建议的标题
    """
    prompt = f"""根据以下对话开头，为这个对话生成一个简短标题（不超过 20 个字符）。

要求：
- 简洁明了
- 概括核心主题
- 使用中文

只输出标题，不要其他解释。

---
{initial_message[:500]}
---"""
    
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=50,
        temperature=0.5,
    )
    
    return response.choices[0].message.content.strip()
