import ChatSidebar from '@/app/client/components/chatComponents/ChatSidebar'
import MainChatArea from '@/app/client/components/chatComponents/MainChatArea'
import React from 'react'

const Chat = () => {
  return (
    <div className="col-span-14 h-screen grid grid-cols-16 overflow-hidden">
      {/* Chat Sidebar - scrollable */}
      <div className="col-span-5 h-screen overflow-y-auto">
        <ChatSidebar />
      </div>

      {/* Main Chat Area - fixed */}
      <div className="col-span-11 h-screen fixed right-0 ">
        <MainChatArea />
      </div>
    </div>
  )
}

export default Chat