import ChatSidebar from '@/app/client/components/chatComponents/ChatSidebar'
import MainChatArea from '@/app/client/components/chatComponents/MainChatArea'
import React from 'react'

const Chat = () => {
  return (
    <div className="col-span-14 h-[90vh] grid grid-cols-16 gap-6 overflow-hidden">
      {/* Chat Sidebar - scrollable */}
      <div className="col-span-16 lg:col-span-5 h-full overflow-hidden">
        <ChatSidebar />
      </div>
   
      {/* Main Chat Area - fixed */}
      <div className="col-span-11 hidden h-full lg:block">
        <MainChatArea />
      </div>
    </div>
  )
}

export default Chat