import { useStore } from '../stores/appStore'
import { 
  Menu, 
  Plus, 
  Search, 
  Settings,
  PanelLeftClose,
  PanelRightClose,
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

  return (
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
  )
}
