import { create } from 'zustand'

// ============ 类型定义 ============

export type Role = 'user' | 'assistant' | 'system'
export type ContextMode = 'full' | 'summary' | 'cold'

export interface MessageNode {
  id: string
  tree_id: string
  parent_id: string | null
  children: string[]
  role: Role
  content: string
  created_at: string
  updated_at: string
  summary?: string
  tags: string[]
  edit_count: number
}

export interface ConversationTree {
  id: string
  title: string
  root_id: string | null
  nodes: Record<string, MessageNode>
  active_node_id: string | null
  created_at: string
  updated_at: string
  tags: string[]
}

export interface TreeSummary {
  id: string
  title: string
  root_id: string | null
  active_node_id: string | null
  node_count: number
  created_at: string
  updated_at: string
  tags: string[]
}

// ============ Store 定义 ============

interface AppState {
  // 数据
  trees: TreeSummary[]
  currentTree: ConversationTree | null
  isLoading: boolean
  error: string | null
  
  // UI 状态
  sidebarOpen: boolean
  rightPanelOpen: boolean
  
  // 操作
  setTrees: (trees: TreeSummary[]) => void
  setCurrentTree: (tree: ConversationTree | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  toggleSidebar: () => void
  toggleRightPanel: () => void
  
  // 树操作
  createTree: (title?: string) => Promise<void>
  loadTree: (treeId: string) => Promise<void>
  deleteTree: (treeId: string) => Promise<void>
  
  // 节点操作
  addMessage: (content: string) => Promise<void>
  createBranch: (title: string, contextMode?: ContextMode) => Promise<void>
  switchNode: (nodeId: string) => void
  updateNode: (nodeId: string, updates: Partial<MessageNode>) => void
}

// ============ API 函数 ============

const API_BASE = 'http://localhost:8000/api'

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(error.detail || 'Request failed')
  }
  
  return response.json()
}

// ============ Store 实现 ============

export const useStore = create<AppState>((set, get) => ({
  // 初始状态
  trees: [],
  currentTree: null,
  isLoading: false,
  error: null,
  sidebarOpen: true,
  rightPanelOpen: true,
  
  // 设置方法
  setTrees: (trees) => set({ trees }),
  setCurrentTree: (tree) => set({ currentTree: tree }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  
  // 创建新对话树
  createTree: async (title?: string) => {
    set({ isLoading: true, error: null })
    try {
      const tree = await apiRequest<ConversationTree>('/trees', {
        method: 'POST',
        body: JSON.stringify({
          title: title || '新对话',
          tags: [],
        }),
      })
      set((state) => ({
        trees: [
          {
            id: tree.id,
            title: tree.title,
            root_id: tree.root_id,
            active_node_id: tree.active_node_id,
            node_count: Object.keys(tree.nodes).length,
            created_at: tree.created_at,
            updated_at: tree.updated_at,
            tags: tree.tags,
          },
          ...state.trees,
        ],
        currentTree: tree,
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '创建失败' })
    } finally {
      set({ isLoading: false })
    }
  },
  
  // 加载对话树
  loadTree: async (treeId: string) => {
    set({ isLoading: true, error: null })
    try {
      const tree = await apiRequest<ConversationTree>(`/trees/${treeId}`)
      set({ currentTree: tree })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载失败' })
    } finally {
      set({ isLoading: false })
    }
  },
  
  // 删除对话树
  deleteTree: async (treeId: string) => {
    try {
      await apiRequest(`/trees/${treeId}`, { method: 'DELETE' })
      set((state) => ({
        trees: state.trees.filter((t) => t.id !== treeId),
        currentTree: state.currentTree?.id === treeId ? null : state.currentTree,
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '删除失败' })
    }
  },
  
  // 发送消息并获取回复
  addMessage: async (content: string) => {
    const { currentTree } = get()
    if (!currentTree) {
      // 如果没有当前树，先创建一个
      await get().createTree()
    }
    
    const tree = get().currentTree
    if (!tree) return
    
    set({ isLoading: true, error: null })
    
    try {
      const response = await apiRequest<{
        user_node_id: string
        assistant_node_id: string
        tree_id: string
      }>('/ai/completion', {
        method: 'POST',
        body: JSON.stringify({
          tree_id: tree.id,
          node_id: tree.active_node_id,
          message: content,
          context_mode: 'full',
        }),
      })
      
      // 重新加载树以获取最新状态
      await get().loadTree(tree.id)
      
      // 更新列表中的节点数
      set((state) => ({
        trees: state.trees.map((t) =>
          t.id === tree.id ? { ...t, node_count: Object.keys(tree.nodes).length + 2 } : t
        ),
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '发送失败' })
    } finally {
      set({ isLoading: false })
    }
  },
  
  // 创建分支
  createBranch: async (title: string, contextMode: ContextMode = 'full') => {
    const { currentTree } = get()
    if (!currentTree) return
    
    const activeNodeId = currentTree.active_node_id
    if (!activeNodeId) return
    
    try {
      await apiRequest(`/trees/${currentTree.id}/nodes/${activeNodeId}/branch`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          context_mode: contextMode,
          tags: [],
        }),
      })
      
      // 重新加载树
      await get().loadTree(currentTree.id)
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '创建分支失败' })
    }
  },
  
  // 切换节点
  switchNode: (nodeId: string) => {
    const { currentTree } = get()
    if (!currentTree) return
    
    // 直接更新本地状态
    set({
      currentTree: {
        ...currentTree,
        active_node_id: nodeId,
      },
    })
  },
  
  // 更新节点
  updateNode: (nodeId: string, updates: Partial<MessageNode>) => {
    const { currentTree } = get()
    if (!currentTree || !currentTree.nodes[nodeId]) return
    
    set({
      currentTree: {
        ...currentTree,
        nodes: {
          ...currentTree.nodes,
          [nodeId]: {
            ...currentTree.nodes[nodeId],
            ...updates,
          },
        },
      },
    })
  },
}))

// ============ 辅助 Hooks ============

export function useNodePath(nodeId: string | null): MessageNode[] {
  const currentTree = useStore((state) => state.currentTree)
  
  if (!currentTree || !nodeId) return []
  
  const path: MessageNode[] = []
  let current = currentTree.nodes[nodeId]
  
  while (current) {
    path.unshift(current)
    current = current.parent_id ? currentTree.nodes[current.parent_id] : undefined as any
  }
  
  return path
}

export function useNodeChildren(nodeId: string | null): MessageNode[] {
  const currentTree = useStore((state) => state.currentTree)
  
  if (!currentTree || !nodeId || !currentTree.nodes[nodeId]) return []
  
  return currentTree.nodes[nodeId].children
    .map((id) => currentTree.nodes[id])
    .filter(Boolean)
}
