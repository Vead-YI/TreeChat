import { useEffect } from 'react'
import { useStore } from './stores/appStore'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChatView from './components/ChatView'
import RightPanel from './components/RightPanel'

function App() {
  const { 
    currentTree, 
    sidebarOpen, 
    rightPanelOpen,
    loadTree,
    setTrees,
    createTree,
    trees,
  } = useStore()

  // 初始化：加载树列表
  useEffect(() => {
    async function init() {
      try {
        const response = await fetch('http://localhost:8000/api/trees')
        const data = await response.json()
        setTrees(data)
        
        // 如果有树，加载最新的
        if (data.length > 0 && !currentTree) {
          loadTree(data[0].id)
        } else if (data.length === 0) {
          // 创建第一个树
          createTree('我的第一个对话')
        }
      } catch (error) {
        console.error('Failed to load trees:', error)
        // 即使后端不可用，也让用户可以创建树
      }
    }
    
    init()
  }, [])

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f]">
      {/* 头部 */}
      <Header />
      
      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧树状导航 */}
        {sidebarOpen && <Sidebar />}
        
        {/* 中间聊天区 */}
        <ChatView />
        
        {/* 右侧节点信息 */}
        {rightPanelOpen && currentTree && <RightPanel />}
      </div>
    </div>
  )
}

export default App
