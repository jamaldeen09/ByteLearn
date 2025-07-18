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
      >
        <ChatSidebar />
      </motion.div>
   
      <AnimatePresence>
        {(selectedChat || !isMobile) && (
          <motion.div
            className="col-span-16 lg:col-span-11 h-full fixed lg:relative inset-0 bg-white z-10 lg:z-auto"
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