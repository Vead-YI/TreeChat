import { useState } from 'react'
import { useStore, useNodePath } from '../stores/appStore'
import { 
  Tag,
  Clock,
  Hash,
  FileText,
  Edit3,
  Save,
  X,
} from 'lucide-react'

export default function RightPanel() {
  const { currentTree, updateNode } = useStore()
  const path = useNodePath(currentTree?.active_node_id || null)
  const activeNode = path[path.length - 1]
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedTags, setEditedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  
  if (!currentTree || !activeNode) {
    return (
      <aside className="w-72 bg-[#12121a] border-l border-white/5 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <FileText size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">选择节点查看详情</p>
        </div>
      </aside>
    )
  }
  
  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      updateNode(activeNode.id, { content: editedTitle } as any)
    }
    setIsEditing(false)
  }
  
  const handleAddTag = () => {
    if (newTag.trim() && !editedTags.includes(newTag.trim())) {
      setEditedTags([...editedTags, newTag.trim()])
      updateNode(activeNode.id, { tags: [...editedTags, newTag.trim()] } as any)
      setNewTag('')
    }
  }
  
  const handleRemoveTag = (tag: string) => {
    const newTags = editedTags.filter(t => t !== tag)
    setEditedTags(newTags)
    updateNode(activeNode.id, { tags: newTags } as any)
  }
  
  return (
    <aside className="w-72 bg-[#12121a] border-l border-white/5 flex flex-col overflow-hidden">
      {/* 头部 */}
      <div className="p-4 border-b border-white/5">
        <h2 className="font-medium flex items-center gap-2">
          <FileText size={16} />
          节点信息
        </h2>
      </div>
      
      {/* 内容 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 角色 */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">角色:</span>
          <span className={`
            px-2 py-0.5 rounded text-xs
            ${activeNode.role === 'user' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}
          `}>
            {activeNode.role === 'user' ? '👤 用户' : '🤖 AI'}
          </span>
        </div>
        
        {/* 标题/内容 */}
        <div>
          <label className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <Edit3 size={12} />
            内容
          </label>
          
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm resize-none"
                rows={4}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveTitle}
                  className="flex-1 px-2 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded text-xs"
                >
                  <Save size={12} className="inline mr-1" />
                  保存
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-xs"
                >
                  <X size={12} className="inline mr-1" />
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors group"
              onClick={() => {
                setEditedTitle(activeNode.content)
                setIsEditing(true)
              }}
            >
              <p className="text-sm text-gray-200 whitespace-pre-wrap">
                {activeNode.content.slice(0, 200)}
                {activeNode.content.length > 200 && '...'}
              </p>
              <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100">
                点击编辑
              </p>
            </div>
          )}
        </div>
        
        {/* 标签 */}
        <div>
          <label className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <Tag size={12} />
            标签
          </label>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {(editedTags.length > 0 ? editedTags : activeNode.tags).map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-xs"
              >
                #{tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-400"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            {activeNode.tags.length === 0 && editedTags.length === 0 && (
              <span className="text-xs text-gray-500">暂无标签</span>
            )}
          </div>
          
          <div className="flex gap-1">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="添加标签..."
              className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-xs"
            />
            <button
              onClick={handleAddTag}
              className="px-2 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded text-xs"
            >
              添加
            </button>
          </div>
        </div>
        
        {/* AI 摘要 */}
        {activeNode.summary && (
          <div>
            <label className="flex items-center gap-1 text-xs text-gray-400 mb-2">
              <FileText size={12} />
              AI 摘要
            </label>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-200/80">
                {activeNode.summary}
              </p>
            </div>
          </div>
        )}
        
        {/* 时间信息 */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock size={12} />
            <span>创建于 {new Date(activeNode.created_at).toLocaleString('zh-CN')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock size={12} />
            <span>更新于 {new Date(activeNode.updated_at).toLocaleString('zh-CN')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Hash size={12} />
            <span>ID: {activeNode.id.slice(0, 12)}...</span>
          </div>
        </div>
        
        {/* 分支信息 */}
        {activeNode.children.length > 0 && (
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              分支 ({activeNode.children.length})
            </label>
            <div className="space-y-1">
              {activeNode.children.slice(0, 3).map((childId) => {
                const child = currentTree.nodes[childId]
                return child ? (
                  <div
                    key={childId}
                    className="p-2 bg-white/5 rounded text-xs text-gray-300 cursor-pointer hover:bg-white/10"
                  >
                    🌿 {child.content.slice(0, 30)}
                    {child.content.length > 30 && '...'}
                  </div>
                ) : null
              })}
              {activeNode.children.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  还有 {activeNode.children.length - 3} 个分支...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
