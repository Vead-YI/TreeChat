import { useState } from 'react'
import { useStore } from '../stores/appStore'
import { 
  Menu, 
  Plus, 
  Search, 
  Settings,
  PanelLeftClose,
  PanelRightClose,
  X,
} from 'lucide-react'

export default function Header() {
  const { 
    currentTree,
    toggleSidebar, 
    toggleRightPanel,
    sidebarOpen,
    rightPanelOpen,
    createTree,
  } = useStore()
  
  const [showSettings, setShowSettings] = useState(false)
  const [contextMode, setContextMode] = useState<'full' | 'summary' | 'cold'>('full')
  const [apiKey, setApiKey] = useState('')

  return (
    <>
      <header className="h-14 bg-[#12121a] border-b border-white/5 flex items-center justify-between px-4">
        {/* 左侧 */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            title={sidebarOpen ? '隐藏侧边栏' : '显示侧边栏'}
          >
            {sidebarOpen ? <PanelLeftClose size={18} /> : <Menu size={18} />}
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xl">🌲</span>
            <h1 className="font-semibold text-lg">TreeChat</h1>
          </div>
        </div>

        {/* 中间 - 当前对话标题 */}
        <div className="flex items-center gap-2">
          {currentTree && (
            <span className="text-sm text-gray-400">
              {currentTree.title}
            </span>
          )}
        </div>

        {/* 右侧 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => createTree()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />
            新对话
          </button>
          
          <button 
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            title="搜索"
          >
            <Search size={18} className="text-gray-400" />
          </button>
          
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            title="设置"
          >
            <Settings size={18} className="text-gray-400" />
          </button>
          
          <button
            onClick={toggleRightPanel}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            title={rightPanelOpen ? '隐藏信息面板' : '显示信息面板'}
          >
            {rightPanelOpen ? <PanelRightClose size={18} /> : <PanelRightClose size={18} className="text-gray-400" />}
          </button>
        </div>
      </header>

      {/* 设置对话框 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSettings(false)}>
          <div 
            className="bg-[#1a1a25] rounded-xl p-6 w-96 border border-white/10 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Settings size={20} />
                设置
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-white/10 rounded"
              >
                <X size={18} />
              </button>
            </div>

            {/* 设置项 */}
            <div className="space-y-4">
              {/* 上下文继承模式 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  📍 默认上下文继承模式
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'full', label: '✓ 完整继承', desc: '包含全部对话历史' },
                    { value: 'summary', label: '🧠 摘要模式', desc: '只包含 AI 摘要' },
                    { value: 'cold', label: '❄️ 冷启动', desc: '不继承任何上下文' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`
                        flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors
                        ${contextMode === opt.value ? 'bg-indigo-500/20 border border-indigo-500/50' : 'hover:bg-white/5 border border-transparent'}
                      `}
                    >
                      <input
                        type="radio"
                        name="contextMode"
                        value={opt.value}
                        checked={contextMode === opt.value}
                        onChange={(e) => setContextMode(e.target.value as any)}
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

              {/* API Key 设置 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  🔑 DeepSeek API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  获取 Key: <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">platform.deepseek.com</a>
                </p>
              </div>

              {/* 关于 */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium mb-2">ℹ️ 关于</h3>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>🌲 TreeChat v0.1.0</p>
                  <p>树状对话系统</p>
                  <p>
                    <a href="https://github.com/Vead-YI/TreeChat" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                      GitHub
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* 按钮 */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  // 保存设置
                  localStorage.setItem('treechat_context_mode', contextMode)
                  if (apiKey) {
                    localStorage.setItem('treechat_api_key', apiKey)
                  }
                  setShowSettings(false)
                }}
                className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
