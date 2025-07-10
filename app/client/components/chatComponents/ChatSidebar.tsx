"use client"
import { searchIcon } from "@/app/icons/Icons"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { PlusIcon } from "lucide-react"
import FriendFilters from "./FriendFilters"

const ChatSidebar = () => {
  return (
    <div className="border border-gray-200 h-screen ">

        {/* Heading */}
        <div className="w-full flex items-center justify-between py-4">
          <h1 className="font-bold text-xl">Chats</h1>

          <motion.button
            className="rounded-full w-8 h-8 centered-flex bg-black text-white"
            whileHover={{ scale: 1.09, cursor: "pointer", filter: "brightness(90%)" }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", damping: 10, stiffness: 100 }}
          >
            <PlusIcon />
          </motion.button>
        </div>

        {/* Input field */}
        <div className="w-full relative">
          <Input 
            placeholder="Search by name"
            type="text"
            className="h-12 rounded-full bg-gray-50 px-14"
          />
          <span className="text-gray-400 absolute text-sm top-3 left-4">{searchIcon}</span>
        </div>

        {/* Filters */}
        <div className="w-full flex items-center space-x-3">
           <FriendFilters />
           <FriendFilters />
           <FriendFilters />
           <FriendFilters />
        </div>

        {/* Chats Area */}
        <div className="w-full basic-border h-fit">

        </div>
    </div>
  )
}

export default ChatSidebar