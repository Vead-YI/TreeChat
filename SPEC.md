# 🌲 TreeChat - 产品规格说明书

> 对话不再是时间流，而是认知空间

---

## 1. 概念与愿景

### 1.1 核心理念

**问题：**
人类思维本质上是**非线性的**——我们从一个想法跳到另一个想法，发现关联，追溯源头，开辟新分支。但现有的 AI 聊天界面都是**线性时间流**：

```
传统模式：A → B → C → D → E → F → ...
```

这与真实的认知过程完全背离：

```
TreeChat 模式：
      A (问题)
     / \
    B   C (不同的探索方向)
   /|\   \
  D E F   G (更深层的追问)
 /   \
H     I (完全不同的子话题)
```

**一句话总结：**
> TreeChat 将对话从「一条铁轨」改造成「一片会生长的森林」。

### 1.2 设计隐喻

| 传统聊天 | TreeChat |
|---------|----------|
| 铁路 (Railroad) | 森林 (Forest) |
| 时间线 (Timeline) | 认知空间 (Cognitive Space) |
| 单行道 (One-way) | 分形探索 (Fractal Exploration) |
| 消息 (Message) | 节点 (Node) |
| 新话题 = 新窗口 | 新话题 = 新分支 |

### 1.3 科研价值

TreeChat 不仅是产品，更是一个**研究平台**：

- **对话结构的认知建模**：树 vs 线性的信息保留效率对比
- **AI Memory Architecture**：分支记忆、全局记忆、压缩记忆
- **知识演化可视化**：思维路径追踪与回溯
- **类 Git 的 AI 交互**：commit / branch / merge 范式

---

## 2. 用户体验设计

### 2.1 整体布局

```
┌─────────────────────────────────────────────────────────────────┐
│  🌲 TreeChat          [搜索...] [标签]        [用户] [设置]       │
├──────────────┬────────────────────────────────┬─────────────────┤
│              │                                │                 │
│   🌳 树状导航  │      💬 当前对话               │   📋 节点信息    │
│              │                                │                 │
│   • 根节点    │   [AI 回复内容]                 │   标签: MLIP    │
│   ├─ 分支A   │                                │   创建时间: ...  │
│   │  ├─ 子节点│   [用户输入...]                │   摘要: ...     │
│   │  └─ 子节点│                                │                 │
│   ├─ 分支B   │   [AI 回复内容]                 │   ───────────  │
│   └─ 分支C   │                                │   🧠 上下文继承  │
│              │   [分支按钮] [历史] [收藏]      │   ✓ 完整继承    │
│              │                                │   ○ 摘要模式    │
│   [+ 新建分支]│                                │   ○ 空白开始    │
│              │                                │                 │
├──────────────┴────────────────────────────────┴─────────────────┤
│  [状态栏: 当前分支深度 3 | 节点数 12 | 上下文 token ~2000]        │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 核心交互

#### 2.2.1 创建分支

| 操作 | 方法 | 快捷键 |
|------|------|--------|
| 从当前消息创建分支 | 点击消息旁的「分支」按钮 | `Ctrl/Cmd + B` |
| 从根节点创建 | 点击根节点旁的「+」 | - |
| 快速分支 | 输入 `/branch [标题]` | - |

#### 2.2.2 导航

| 操作 | 方法 | 快捷键 |
|------|------|--------|
| 切换到父节点 | 点击面包屑 / 树节点 | `Alt + ↑` |
| 切换到子节点 | 点击树节点 | `Alt + ↓` |
| 跳转到任意节点 | 点击面包屑路径 | `Ctrl + G` |
| 展开/折叠子树 | 点击节点箭头 | `← / →` |

#### 2.2.3 上下文继承选项

创建分支时弹出选项：

```
┌─────────────────────────────────────┐
│  📌 创建新分支                       │
├─────────────────────────────────────┤
│  分支标题: [________________]       │
│                                     │
│  上下文继承:                        │
│  ○ ✓ 完整继承 (继承全部对话历史)      │
│  ○ 🧠 摘要模式 (只继承AI生成的摘要)  │
│  ○ ❄️ 冷启动 (不继承上下文)          │
│                                     │
│  标签: [MLIP] [+]                   │
│                                     │
│        [取消]  [创建分支]            │
└─────────────────────────────────────┘
```

### 2.3 节点信息面板

显示内容：
- **标题**：可编辑的节点名称
- **标签**：可添加/删除的标签
- **创建时间**：精确到分钟
- **AI 摘要**：AI 自动生成的节点摘要
- **子问题抽象**：该分支下的核心问题
- **引用计数**：有多少其他分支引用了此节点

---

## 3. 功能清单

### 3.1 MVP 功能 (v0.1)

| 功能 | 优先级 | 状态 |
|------|--------|------|
| 树状消息存储 | P0 | 🔨 开发中 |
| 节点创建与切换 | P0 | 🔨 开发中 |
| 分支创建 | P0 | 🔨 开发中 |
| 面包屑导航 | P0 | 🔨 开发中 |
| 上下文继承 | P0 | 🔨 开发中 |
| OpenAI API 集成 | P0 | 🔨 开发中 |
| SQLite 本地存储 | P1 | 📋 规划 |
| 基础搜索 | P1 | 📋 规划 |

### 3.2 v1.0 功能

| 功能 | 优先级 | 状态 |
|------|--------|------|
| 标签系统 | P1 | 📋 规划 |
| 节点摘要生成 | P1 | 📋 规划 |
| 树状可视化 | P1 | 📋 规划 |
| 导出/导入 | P2 | 📋 规划 |
| 键盘快捷键 | P1 | 📋 规划 |

### 3.3 v2.0 功能 (科研方向)

| 功能 | 优先级 | 状态 |
|------|--------|------|
| Context Compression | P2 | 📋 规划 |
| 知识图谱集成 | P2 | 📋 规划 |
| 分支对比视图 | P2 | 📋 规划 |
| 多 AI 协作分支 | P3 | 💡 设想 |
| 认知效率分析 | P3 | 💡 设想 |

---

## 4. 技术架构

### 4.1 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        前端 (React)                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  TreeView   │  │ ChatView    │  │  NodeInfoPanel          │  │
│  │  树状导航    │  │ 聊天界面     │  │  节点信息               │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
│         │                │                     │                │
│         └────────────────┼─────────────────────┘                │
│                          │                                       │
│                    ┌─────▼─────┐                                │
│                    │  Zustand  │  (状态管理)                     │
│                    └─────┬─────┘                                │
└──────────────────────────┼──────────────────────────────────────┘
                           │ HTTP/WebSocket
┌──────────────────────────┼──────────────────────────────────────┐
│                    后端 (FastAPI)                                │
│                          │                                       │
│  ┌───────────────────────▼────────────────────────┐              │
│  │               API Routes                        │              │
│  │  /nodes  /messages  /branches  /search  /ai     │              │
│  └───────────────────────┬────────────────────────┘              │
│                          │                                       │
│  ┌───────────────────────▼────────────────────────┐              │
│  │              Core Services                      │              │
│  │  TreeService  MessageService  ContextService  │              │
│  │  AIService    SearchService   SummaryService    │              │
│  └───────────────────────┬────────────────────────┘              │
│                          │                                       │
│  ┌───────────────────────▼────────────────────────┐              │
│  │              Data Layer                         │              │
│  │  SQLite + SQLAlchemy  /  Redis (可选)          │              │
│  └────────────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 技术选型

| 层次 | 技术选型 | 理由 |
|------|----------|------|
| **前端框架** | React 18 + TypeScript | 生态成熟，组件化开发 |
| **状态管理** | Zustand | 轻量，TypeScript 支持好 |
| **UI 组件** | Tailwind CSS + Radix UI | 快速开发，自定义能力强 |
| **树可视化** | React Flow | 专为流程/树状图设计 |
| **后端框架** | FastAPI | 异步高性能，类型安全 |
| **数据库** | SQLite (开发) / PostgreSQL (生产) | 简单 → 可扩展 |
| **ORM** | SQLAlchemy 2.0 | 成熟稳定，类型提示 |
| **AI 集成** | OpenAI API (GPT-4) | 最佳对话能力 |
| **实时通信** | WebSocket (可选) | 多人协作时实时同步 |

### 4.3 核心数据结构

#### 4.3.1 消息节点 (MessageNode)

```python
class MessageNode(BaseModel):
    """对话树中的单个节点"""
    id: str = Field(default_factory=generate_id)
    
    # 树结构
    parent_id: Optional[str] = None
    children: List[str] = Field(default_factory=list)
    
    # 内容
    role: Literal["user", "assistant", "system"]
    content: str
    
    # 元数据
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # AI 相关
    summary: Optional[str] = None  # AI 生成的摘要
    embedding: Optional[List[float]] = None  # 向量表示
    
    # 标签
    tags: List[str] = Field(default_factory=list)
    
    # 统计
    edit_count: int = 0
    
    class Config:
        use_enum_values = True
```

#### 4.3.2 对话树 (ConversationTree)

```python
class ConversationTree(BaseModel):
    """整棵对话树"""
    id: str = Field(default_factory=generate_id)
    root_id: str  # 根节点 ID
    
    # 节点存储 (id -> node)
    nodes: Dict[str, MessageNode] = Field(default_factory=dict)
    
    # 当前状态
    active_node_id: str  # 当前活跃节点
    
    # 元数据
    title: str = "新对话"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # 用户配置
    context_mode: Literal["full", "summary", "cold"] = "full"
```

#### 4.3.3 分支信息 (Branch)

```python
class Branch(BaseModel):
    """分支元信息"""
    id: str = Field(default_factory=generate_id)
    tree_id: str
    from_node_id: str  # 分支起点
    title: str
    context_mode: str = "full"  # 继承模式
    
    # 标签
    tags: List[str] = Field(default_factory=list)
    
    # 状态
    is_archived: bool = False
    is_favorited: bool = False
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 4.4 核心算法

#### 4.4.1 上下文构建

```python
def build_context(
    tree: ConversationTree,
    node_id: str,
    mode: ContextMode = ContextMode.FULL,
    max_tokens: int = 4000
) -> List[Dict[str, str]]:
    """
    从当前节点回溯到根，构建上下文
    支持三种模式：
    - FULL: 完整继承
    - SUMMARY: 只包含摘要
    - COLD: 空上下文
    """
    context = []
    current = tree.nodes.get(node_id)
    
    while current:
        if mode == ContextMode.FULL:
            context.append({
                "role": current.role,
                "content": current.content
            })
        elif mode == ContextMode.SUMMARY and current.summary:
            context.append({
                "role": current.role,
                "content": f"[摘要] {current.summary}"
            })
        
        current = tree.nodes.get(current.parent_id) if current.parent_id else None
    
    return context[::-1]  # 反转，从根到当前
```

#### 4.4.2 摘要生成

```python
async def generate_summary(
    messages: List[MessageNode],
    openai_client: OpenAI
) -> str:
    """
    为一个分支生成摘要
    用于 SUMMARY 模式的上下文继承
    """
    content = "\n".join([m.content for m in messages])
    
    prompt = f"""请为以下对话分支生成简短摘要（不超过 100 字）：
    
{content}

摘要应该包含：
1. 核心主题
2. 关键结论（如果有）
3. 延伸问题（如果有）

格式：主题 | 结论 | 延伸"""
    
    response = await openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200
    )
    
    return response.choices[0].message.content
```

---

## 5. API 设计

### 5.1 REST API 端点

| 方法 | 端点 | 描述 |
|------|------|------|
| `GET` | `/api/trees` | 获取所有对话树 |
| `POST` | `/api/trees` | 创建新对话树 |
| `GET` | `/api/trees/{tree_id}` | 获取指定对话树 |
| `DELETE` | `/api/trees/{tree_id}` | 删除对话树 |
| `POST` | `/api/trees/{tree_id}/nodes` | 在树中添加节点 |
| `PATCH` | `/api/nodes/{node_id}` | 更新节点内容 |
| `DELETE` | `/api/nodes/{node_id}` | 删除节点 |
| `POST` | `/api/nodes/{node_id}/branch` | 从节点创建分支 |
| `GET` | `/api/nodes/{node_id}/path` | 获取从根到节点的路径 |
| `POST` | `/api/ai/completion` | 发送消息并获取 AI 回复 |
| `POST` | `/api/nodes/{node_id}/summarize` | 生成节点摘要 |
| `GET` | `/api/search` | 搜索节点 |

### 5.2 请求/响应示例

#### 创建分支

**请求：**
```json
POST /api/nodes/{node_id}/branch
{
    "title": "探索 Attention 机制",
    "context_mode": "full",
    "tags": ["MLIP", "Transformer"]
}
```

**响应：**
```json
{
    "new_node_id": "node_abc123",
    "tree_id": "tree_xyz789",
    "parent_id": "node_xyz456",
    "title": "探索 Attention 机制",
    "context_mode": "full",
    "tags": ["MLIP", "Transformer"]
}
```

---

## 6. 验收标准

### 6.1 MVP 验收

- [ ] 用户可以创建新的对话树
- [ ] 用户可以在任意节点继续对话
- [ ] 用户可以从任意节点创建分支
- [ ] 用户可以在分支间切换
- [ ] 上下文正确继承
- [ ] 消息持久化存储
- [ ] 基本的错误处理

### 6.2 视觉验收

- [ ] 树状结构清晰可辨
- [ ] 当前节点高亮显示
- [ ] 面包屑导航正确
- [ ] 响应式布局（桌面端）
- [ ] 加载状态指示器
- [ ] 错误提示友好

---

## 7. 版本规划

| 版本 | 目标 | 预计时间 |
|------|------|----------|
| v0.1 MVP | 核心功能可用 | Week 1-2 |
| v0.5 Beta | 基础功能完善 | Week 3-4 |
| v1.0 | 正式发布 | Week 5-6 |
| v2.0 | 科研功能 | 待定 |

---

*文档版本：1.0*
*最后更新：2026-03-24*
