// import ChatSidebar from '@/app/client/components/chatComponents/ChatSidebar'
// import MainChatArea from '@/app/client/components/chatComponents/MainChatArea'
// import React from 'react'

// const Chat = () => {
//   return (
//     <div className="col-span-14 h-[90vh] grid grid-cols-16 gap-6 overflow-hidden">
//       {/* Chat Sidebar - scrollable */}
//       <div className="col-span-16 lg:col-span-5 h-full overflow-hidden">
//         <ChatSidebar />
//       </div>
   
//       {/* Main Chat Area - fixed */}
//       <div className="col-span-11 hidden h-full lg:block">
//         <MainChatArea />
//       </div>
//     </div>
//   )
// }

// export default Chat
import ChatSidebar from '@/app/client/components/chatComponents/ChatSidebar'
import MainChatArea from '@/app/client/components/chatComponents/MainChatArea'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Chat = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  useEffect(() => {
    // Client-side check
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="col-span-14 h-[90vh] grid grid-cols-16 gap-6 overflow-hidden relative">
      {/* Chat Sidebar - slides out on mobile when chat is selected */}
      <motion.div
        className="col-span-16 lg:col-span-5 h-full overflow-hidden"
        initial={false}
        animate={{
          x: selectedChat && isMobile ? '-100%' : 0,
          opacity: selectedChat && isMobile ? 0 : 1
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <ChatSidebar />
      </motion.div>
   
      <AnimatePresence>
        {(selectedChat || !isMobile) && (
          <motion.div
            className="col-span-16 lg:col-span-11 h-full fixed lg:relative inset-0 bg-white z-10 lg:z-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Mobile back button */}
            {isMobile && (
              <button 
                className="lg:hidden absolute left-4 top-4 z-20 p-2 bg-gray-100 rounded-full shadow"
                onClick={() => setSelectedChat(null)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <MainChatArea />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Chat