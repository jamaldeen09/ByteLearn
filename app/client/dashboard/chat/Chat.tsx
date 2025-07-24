import ChatSidebar from '@/app/client/components/chatComponents/ChatSidebar'
import MainChatArea from '@/app/client/components/chatComponents/MainChatArea'
import { useAppSelector } from '@/app/redux/essentials/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const Chat = () => {
  const isClickedFriend = useAppSelector(state => state.clickedFriend)
  const [hasBeenClicked, setHasBeenClicked] = useState<boolean>(false)

  useEffect(() => {
    if (isClickedFriend.id) {
      setHasBeenClicked(true)
    } else {
      setHasBeenClicked(false)
    }
  }, [isClickedFriend])

  return (
    <>
      {/* Desktop Chat */}
      <div className="col-span-14 h-full grid-cols-16 gap-6 overflow-hidden relative hidden lg:grid py-4">
        {/* Chat Sidebar - slides out on mobile when chat is selected */}
        <motion.div
          className="col-span-16 lg:col-span-5 h-full overflow-hidden"
        >
          <ChatSidebar />
        </motion.div>

        <div className="col-span-16 lg:col-span-11 h-full">
          <MainChatArea />
        </div>
      </div>

      {/* Mobile Chat */}
      <AnimatePresence>
        {!hasBeenClicked ? (
          <motion.div
            key="chat-sidebar"
            initial={{ x: "-100vw" }}
            animate={{ x: 0 }}
            exit={{ x: "-100vw" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.2,
            }}
            className="h-screen lg:hidden mt-4">
            <div
              className="w-full h-full overflow-hidden"
            >
              <ChatSidebar />
            </div>
          </motion.div>
        ) : <motion.div
          key="main-chat-area"
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          exit={{ x: "100vw" }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.2,
          }}
          className="w-full h-full lg:hidden mt-4"
        >
          <MainChatArea />
        </motion.div>}
      </AnimatePresence>
    </>
  )
}

export default Chat
