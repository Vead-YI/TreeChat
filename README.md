# 🌲 言枢

<div align="center">

**A Branching Conversation Interface for AI**

*让 AI 对话从「一条铁轨」变成「一片会生长的森林」*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-green.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)

</div>

---

## 🧠 核心理念

> **Human thinking is not linear. Why should AI conversations be?**

传统聊天工具把对话压缩成一条铁轨：

```
ChatGPT:  A → B → C → D → E → F → G → ...
```

但人类的思维是**分形**的：

```
TreeChat:
                    A (问题)
                   / \
                  B   C (不同的探索方向)
                 /|\   \
                D E F   G (更深层的追问)
               /   \
              H     I (完全不同的子话题)
```

**一句话总结：对话不再是时间流，而是认知空间。**

---

## ✨ 核心功能

| 功能 | 描述 |
|------|------|
| 🌳 **树状对话** | 告别线性，从任意节点创建分支 |
| 🔀 **分支探索** | 像 Git 一样管理你的思维分支 |
| 📍 **快速导航** | 面包屑路径 + 树状可视化 |
| 🧠 **智能上下文** | 完整继承 / 摘要模式 / 冷启动 |
| 🏷️ **标签系统** | 给节点打标签，全局搜索 |
| 📊 **知识演化** | 可视化你的思维路径 |

---

## 🚀 快速开始

### 前置要求

- Python 3.11+
- Node.js 18+
- pnpm (推荐) 或 npm

### 1. 克隆项目

```bash
git clone https://github.com/Vead-YI/TreeChat.git
cd TreeChat
```

### 2. 启动后端

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export OPENAI_API_KEY="your-api-key"  # Linux/macOS
# set OPENAI_API_KEY="your-api-key"   # Windows

# 启动服务器
uvicorn main:app --reload --port 8000
```

### 3. 启动前端

```bash
cd frontend

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 4. 打开浏览器

访问 [http://localhost:5173](http://localhost:5173)

---

## 🏗️ 技术架构

### 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        前端 (React + TypeScript)                 │
│                                                                 │
│   ┌────────────┐    ┌──────────────┐    ┌─────────────────┐     │
│   │  🌳 树导航  │    │   💬 聊天界面  │    │   📋 节点信息     │     │
│   └────────────┘    └──────────────┘    └─────────────────┘     │
│                                                                 │
│                    Zustand (状态管理)                            │
└──────────────────────────────┬──────────────────────────────────┘
                               │ REST API
┌──────────────────────────────▼──────────────────────────────────┐
│                        后端 (FastAPI + Python)                   │
│                                                                 │
│   ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐    │
│   │  树服务      │  │   AI 服务     │  │   上下文服务          │   │
│   │  TreeService│  │   AIService  │  │   ContextService    │    │
│   └─────────────┘  └──────────────┘  └─────────────────────┘    │
│                                                                 │
│                    SQLite / PostgreSQL                          │
└─────────────────────────────────────────────────────────────────┘
```

### 技术栈

| 层次 | 技术 |
|------|------|
| **前端框架** | React 18 + TypeScript |
| **状态管理** | Zustand |
| **UI 组件** | Tailwind CSS + Radix UI |
| **树可视化** | React Flow |
| **后端框架** | FastAPI |
| **数据库** | SQLite (开发) / PostgreSQL (生产) |
| **ORM** | SQLAlchemy 2.0 |
| **AI 集成** | OpenAI API (GPT-4o) |

### 项目结构

```
TreeChat/
├── frontend/                    # React 前端
│   ├── src/
│   │   ├── components/         # UI 组件
│   │   │   ├── TreeView/       # 树状导航
│   │   │   ├── ChatView/       # 聊天界面
│   │   │   ├── NodePanel/      # 节点信息
│   │   │   └── ...
│   │   ├── hooks/              # React Hooks
│   │   ├── api/                # API 调用
│   │   ├── stores/             # Zustand stores
│   │   └── utils/              # 工具函数
│   └── package.json
│
├── backend/                    # FastAPI 后端
│   ├── main.py                 # 应用入口
│   ├── routes/                 # API 路由
│   │   ├── trees.py            # 树相关 API
│   │   ├── nodes.py            # 节点相关 API
│   │   └── ai.py               # AI 相关 API
│   ├── models/                 # 数据模型
│   ├── services/               # 业务逻辑
│   │   ├── tree_service.py
│   │   ├── context_service.py
│   │   └── ai_service.py
│   └── core/                   # 核心配置
│       ├── database.py
│       └── config.py
│
├── database/                   # 数据库相关
│   └── schema.sql
│
├── docs/                       # 文档
│   ├── API.md
│   └── ARCHITECTURE.md
│
├── scripts/                    # 工具脚本
│
└── README.md
```

---

## 📖 核心概念

### 节点 (Node)

对话中的每一个消息都是一个**节点**：

```python
{
    "id": "node_abc123",
    "role": "user",           # user / assistant / system
    "content": "什么是 Transformer？",
    "parent_id": "node_xyz789", # 父节点（None 表示根节点）
    "children": ["node_def456"], # 子节点
    "summary": "用户询问 Transformer 的定义...",
    "tags": ["MLIP", "Transformer"],
    "created_at": "2024-01-15T10:30:00Z"
}
```

### 对话树 (Tree)

一个完整的对话项目是一棵**树**：

```python
{
    "id": "tree_xyz789",
    "root_id": "node_root",
    "nodes": {
        "node_root": {...},
        "node_abc123": {...},
        "node_def456": {...}
    },
    "active_node_id": "node_def456",
    "title": "MLIP 研究"
}
```

### 上下文继承模式

创建分支时可以选择的上下文继承方式：

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| **完整继承** | 继承父节点到根的全部对话 | 延续性探索 |
| **摘要模式** | 只继承 AI 生成的摘要 | 长对话节省 token |
| **冷启动** | 不继承任何上下文 | 完全独立的新话题 |

---

## 🎯 使用场景

### 场景 1: 研究性对话

```
📚 MLIP 研究
├── 📄 势函数调研
│   ├── Lennard-Jones
│   │   ├── 参数拟合方法
│   │   └── 与其他势函数对比
│   └── DeepMD 系列
│       ├── 架构分析
│       └── 训练技巧
└── 📄 分子动力学基础
    ├── 基本原理
    └── 常用软件
```

### 场景 2: 代码调试

```
🐛 Bug 排查
├── 尝试方案 A
│   ├── 成功但性能差
│   └── 放弃原因
├── 尝试方案 B
│   └── ✅ 最终方案
└── 📝 经验总结
```

### 场景 3: 写作构思

```
📝 文章大纲
├── 引言
│   ├── 背景介绍
│   └── 问题提出
├── 正文
│   ├── 论点 1
│   │   ├── 支持证据
│   │   └── 反方观点
│   └── 论点 2
└── 结论
```

---

## 🔮 未来规划

### 近期 (v1.0)
- [ ] 标签系统和全局搜索
- [ ] 节点摘要自动生成
- [ ] 导出/导入功能 (JSON, Markdown)
- [ ] 键盘快捷键
- [ ] 暗色模式

### 中期 (v2.0) - 科研方向
- [ ] **Context Compression**: 智能压缩长对话
- [ ] **知识图谱集成**: 跨对话的知识关联
- [ ] **分支对比视图**: 可视化不同分支的差异
- [ ] **RAG 检索增强**: 基于历史分支的检索

### 长期 (v3.0)
- [ ] 多 Agent 协作分支
- [ ] 认知效率分析报告
- [ ] 学术论文发表

---

## 📊 科研价值

TreeChat 不仅仅是一个产品，更是一个**研究平台**：

### 潜在研究方向

1. **对话结构的认知建模**
   - 树 vs 线性对话的信息保留效率对比
   - 用户在不同结构中的思考模式分析

2. **AI Memory Architecture**
   - 分支记忆 vs 全局记忆的对比研究
   - Context Compression 的最佳实践

3. **知识演化可视化**
   - 思维路径追踪与回溯
   - 知识网络的动态演化

4. **类 Git 的 AI 交互范式**
   - Commit / Branch / Merge 在对话中的应用
   - 版本控制思想在 AI 对话中的延伸

### 可能的论文方向

> **"Tree-Structured Interaction Paradigm for Large Language Models"**

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南

1. Fork 本仓库
2. 创建你的分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 👤 作者

**Zuyang Li** — PhD 申请者，MLIP 研究方向

[![GitHub](https://img.shields.io/badge/GitHub-Vead--YI-blue.svg)](https://github.com/Vead-YI)
[![Twitter](https://img.shields.io/badge/Twitter-@veadyi-blue.svg)](https://twitter.com/veadyi)

---

## 🙏 致谢

- 灵感来源：Git 版本控制、思维导图、认知科学
- 图标设计：[Lucide Icons](https://lucide.dev/)
- 开源社区

---

<div align="center">

**Built with ❤️ for better AI conversations**

*让思维的分支自然生长*

</div>
