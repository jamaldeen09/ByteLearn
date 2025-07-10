"use client"
import { searchIcon } from "@/app/icons/Icons"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { PlusIcon } from "lucide-react"
import FriendFilters from "./FriendFilters"
import Friend from "./Friend"
import AddFriendSidebar from "./AddFriendSidebar"
import { useEffect, useState } from "react"
import NewFriendSidebar from "./NewFriendSidebar"
import AddGroupTrigger from "./AddGroupTrigger"

const ChatSidebar = () => {
  const generateArray = (lastNum: number): number[] => {
    let generatedArr: number[] = [];
    for (let i = 0; i < lastNum; i++) {
      generatedArr.push(i)
    }

    return generatedArr
  }
  const [ addfriendTrigger, setAddFriendTrigger ] = useState<boolean>(false)

 
  return (
    <div className="border border-gray-200 h-full col-span-5  overflow-hidden
    flex flex-col gap-6 relative basic-border">

        {/* Heading */}
        <div className="w-full flex items-center justify-between mt-6 px-4">
          <h1 className="font-bold text-xl">Chats</h1>

          <motion.button
            className="rounded-full w-8 h-8 centered-flex bg-black text-white"
            whileHover={{ scale: 1.09, cursor: "pointer", filter: "brightness(90%)" }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", damping: 10, stiffness: 100 }}
            onClick={() => setAddFriendTrigger(true)}
          >
            <PlusIcon />
          </motion.button>
        </div>

        {/* Input field */}
        <div className="w-full relative px-4">
          <Input 
            placeholder="Search by name"
            type="text"
            className="h-12 rounded-full bg-gray-50 px-16"
          />
          <span className="text-gray-400 absolute text-sm top-3 left-9">{searchIcon}</span>
        </div>

        {/* Filters */}
        <div className="w-full flex items-center space-x-3 px-4">
           <FriendFilters />
           <FriendFilters />
           <FriendFilters />
           <FriendFilters />
        </div>

        {/* Chats Area */}
        <div className="w-full flex flex-col h-full overflow-hidden overflow-y-auto px-2 gap-4 py-4">
    
           {Array.from(generateArray(20)).map((i) => {
            return (
               <Friend key={i}/>
            )
           })}
        </div>
      
      {/* Add sidebar */}
      <AddFriendSidebar 
        triggerAddFriend={addfriendTrigger}
        setTriggerAddFriend={setAddFriendTrigger}
      />

      {/* Add friend sidebar */}
      <NewFriendSidebar />

      {/* Add group sidebar */}
      <AddGroupTrigger />
    </div>
  )
}

export default ChatSidebar