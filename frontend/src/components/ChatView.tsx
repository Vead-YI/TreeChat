import { useState, useRef, useEffect } from 'react'
import { useStore, useNodePath, MessageNode } from '../stores/appStore'
import { 
  Send,
  GitBranch,
  ChevronRight,
  Loader2,
  MessageSquare,
} from 'lucide-react'

function MessageBubble({ node }: { node: MessageNode }) {
  const { currentTree, switchNode } = useStore()
  
  const isActive = currentTree?.active_node_id === node.id
  
  return (
    <div
      className={`
        flex gap-3 p-4 rounded-xl transition-colors
        ${node.role === 'user' ? 'bg-indigo-500/10' : 'bg-white/5'}
        ${isActive ? 'ring-2 ring-indigo-500/50' : ''}
      `}
      onClick={() => switchNode(node.id)}
    >
      {/* 头像 */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center shrink-0
        ${node.role === 'user' ? 'bg-indigo-500/30' : 'bg-emerald-500/30'}
      `}>
        {node.role === 'user' ? '👤' : '🤖'}
      </div>
      
      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-300">
            {node.role === 'user' ? '你' : 'AI'}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(node.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
          {node.content}
        </div>
        
        {/* 标签 */}
        {node.tags && node.tags.length > 0 && (
          <div className="flex gap-1 mt-2">
            {node.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* 摘要提示 */}
        {node.summary && (
          <div className="mt-2 text-xs text-gray-500 italic">
            📝 {node.summary}
          </div>
        )}
      </div>
    </div>
  )
}

function BranchIndicator({ node }: { node: MessageNode }) {
  const { createBranch } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [mode, setMode] = useState<'full' | 'summary' | 'cold'>('full')
  
  const handleCreate = async () => {
    if (!title.trim()) return
    await createBranch(title, mode)
    setShowModal(false)
    setTitle('')
  }
  
  if (node.role === 'user') return null
  
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1 px-2 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded text-xs transition-colors"
      >
        <GitBranch size={12} />
        分支
      </button>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div 
            className="bg-[#1a1a25] rounded-xl p-4 w-80 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-medium mb-3">🌿 从此节点创建分支</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">分支标题</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入分支名称..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">上下文继承</label>
                <div className="space-y-1">
                  {[
                    { value: 'full', label: '✓ 完整继承', desc: '包含全部对话历史' },
                    { value: 'summary', label: '🧠 摘要模式', desc: '只包含 AI 摘要' },
                    { value: 'cold', label: '❄️ 冷启动', desc: '不继承任何上下文' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`
                        flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors
                        ${mode === opt.value ? 'bg-indigo-500/20 border border-indigo-500/50' : 'hover:bg-white/5 border border-transparent'}
                      `}
                    >
                      <input
                        type="radio"
                        name="mode"
                        value={opt.value}
                        checked={mode === opt.value}
                        onChange={(e) => setMode(e.target.value as any)}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-sm">{opt.label}</div>
                        <div className="text-xs text-gray-500">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function ChatView() {
  const { currentTree, addMessage, isLoading, error } = useStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  
  // 获取当前路径上的所有消息
  const path = useNodePath(currentTree?.active_node_id || null)
  
  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [path])
  
  // 发送消息
  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    const message = input.trim()
    setInput('')
    await addMessage(message)
    
    // 聚焦输入框
    inputRef.current?.focus()
  }
  
  // 键盘快捷键
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  
  // 空状态
  if (!currentTree || !currentTree.root_id) {
    return (
      <main className="flex-1 flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="text-6xl mb-4">🌲</div>
          <h2 className="text-xl font-medium mb-2">开始你的思维探索</h2>
          <p className="text-gray-400 text-sm mb-4">
            创建一个对话树，让你的想法像树枝一样生长
          </p>
        </div>
      </main>
    )
  }
  
  return (
    <main className="flex-1 flex flex-col bg-[#0a0a0f] overflow-hidden">
      {/* 面包屑 */}
      <div className="px-4 py-2 bg-[#12121a] border-b border-white/5 flex items-center gap-1 text-sm">
        {path.map((node, index) => (
          <div key={node.id} className="flex items-center gap-1">
            {index > 0 && <ChevronRight size={14} className="text-gray-600" />}
            <button
              onClick={() => useStore.getState().switchNode(node.id)}
              className={`
                px-2 py-0.5 rounded transition-colors
                ${index === path.length - 1 
                  ? 'bg-indigo-500/20 text-indigo-400' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }
              `}
            >
              {node.content.slice(0, 20)}{node.content.length > 20 ? '...' : ''}
            </button>
          </div>
        ))}
      </div>
      
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {path.map((node) => (
          <div key={node.id}>
            <MessageBubble node={node} />
            {/* 分支按钮（在 AI 回复后显示） */}
            {node.role === 'assistant' && (
              <div className="mt-2 ml-11">
                <BranchIndicator node={node} />
              </div>
            )}
          </div>
        ))}
        
        {/* 加载指示器 */}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400 p-4">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">AI 正在思考...</span>
          </div>
        )}
        
        {/* 错误提示 */}
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* 输入区 */}
      <div className="p-4 bg-[#12121a] border-t border-white/5">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题... (Enter 发送，Shift+Enter 换行)"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm resize-none"
              rows={1}
              style={{ maxHeight: '120px' }}
              disabled={isLoading}
            />
          </div>
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`
              p-3 rounded-xl transition-colors
              ${input.trim() && !isLoading
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <Send size={18} />
          </button>
        </div>
        
        {/* 提示 */}
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
          <span>💡 按 <kbd className="px-1 py-0.5 bg-white/10 rounded">Ctrl+B</kbd> 创建分支</span>
          <span>上下文: <span className="text-indigo-400">完整继承</span></span>
        </div>
      </div>
    </main>
  )
}
