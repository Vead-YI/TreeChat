import { useState } from 'react'
import { useStore, MessageNode } from '../stores/appStore'
import { 
  ChevronRight, 
  ChevronDown,
  Plus,
  Trash2,
  GitBranch,
  MoreHorizontal,
} from 'lucide-react'

function TreeNode({ nodeId, level = 0 }: { nodeId: string; level?: number }) {
  const { currentTree, switchNode } = useStore()
  const [expanded, setExpanded] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  
  if (!currentTree || !currentTree.nodes[nodeId]) return null
  
  const node = currentTree.nodes[nodeId]
  const isActive = currentTree.active_node_id === nodeId
  const hasChildren = node.children.length > 0
  const isRoot = !node.parent_id
  
  // 获取节点显示文本
  const displayText = node.summary 
    ? node.summary.slice(0, 30) + (node.summary.length > 30 ? '...' : '')
    : node.content.slice(0, 40) + (node.content.length > 40 ? '...' : '')
  
  return (
    <div className="select-none">
      {/* 节点内容 */}
      <div
        className={`
          flex items-center gap-1 py-1.5 px-2 rounded-lg cursor-pointer
          transition-all group
          ${isActive 
            ? 'bg-indigo-500/20 text-indigo-400 border-l-2 border-indigo-500' 
            : 'hover:bg-white/5 text-gray-300 border-l-2 border-transparent'
          }
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => switchNode(nodeId)}
        onContextMenu={(e) => {
          e.preventDefault()
          setShowMenu(true)
        }}
      >
        {/* 展开/折叠按钮 */}
        <button
          className={`w-4 h-4 flex items-center justify-center shrink-0 ${hasChildren ? 'text-gray-500' : 'invisible'}`}
          onClick={(e) => {
            e.stopPropagation()
            setExpanded(!expanded)
          }}
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        
        {/* 角色图标 */}
        <span className="text-xs shrink-0">
          {node.role === 'user' ? '👤' : node.role === 'assistant' ? '🤖' : '⚙️'}
        </span>
        
        {/* 节点文本 */}
        <span className="flex-1 text-sm truncate">
          {displayText}
        </span>
        
        {/* 操作按钮 */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5">
          <button
            className="p-1 hover:bg-white/10 rounded"
            title="添加分支"
            onClick={(e) => {
              e.stopPropagation()
              // TODO: 打开创建分支弹窗
            }}
          >
            <GitBranch size={12} />
          </button>
          <button
            className="p-1 hover:bg-white/10 rounded text-red-400"
            title="删除"
            onClick={(e) => {
              e.stopPropagation()
              // TODO: 删除节点
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      
      {/* 子节点 */}
      {hasChildren && expanded && (
        <div className="tree-children">
          {node.children.map((childId) => (
            <TreeNode key={childId} nodeId={childId} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar() {
  const { currentTree, trees, loadTree, deleteTree, createTree } = useStore()
  const [searchQuery, setSearchQuery] = useState('')

  // 过滤树列表
  const filteredTrees = trees.filter((tree) =>
    tree.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className="w-64 bg-[#12121a] border-r border-white/5 flex flex-col">
      {/* 搜索 */}
      <div className="p-3">
        <input
          type="text"
          placeholder="搜索对话..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 placeholder-gray-500"
        />
      </div>
      
      {/* 对话列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider">
          对话 ({filteredTrees.length})
        </div>
        
        <div className="space-y-0.5 px-2">
          {filteredTrees.map((tree) => (
            <div
              key={tree.id}
              className={`
                flex items-center justify-between p-2 rounded-lg cursor-pointer
                transition-colors
                ${currentTree?.id === tree.id 
                  ? 'bg-indigo-500/20 text-indigo-400' 
                  : 'hover:bg-white/5 text-gray-300'
                }
              `}
              onClick={() => loadTree(tree.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{tree.title}</div>
                <div className="text-xs text-gray-500">
                  {tree.node_count} 节点 · {new Date(tree.updated_at).toLocaleDateString('zh-CN')}
                </div>
              </div>
              <button
                className="p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`确定删除「${tree.title}」吗？`)) {
                    deleteTree(tree.id)
                  }
                }}
              >
                <Trash2 size={14} className="text-gray-500 hover:text-red-400" />
              </button>
            </div>
          ))}
        </div>
        
        {/* 分隔线 */}
        <div className="mx-3 my-3 border-t border-white/5" />
        
        {/* 当前树的节点 */}
        {currentTree && currentTree.root_id && (
          <div className="px-3 py-2">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              🌳 节点树
            </div>
            <div className="space-y-0.5">
              <TreeNode nodeId={currentTree.root_id} />
            </div>
          </div>
        )}
      </div>
      
      {/* 底部 */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => createTree()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors"
        >
          <Plus size={16} />
          新建对话树
        </button>
      </div>
    </aside>
  )
}
