"use client"

import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { untriggerNewFriend } from "@/app/redux/triggers/newFriendTrigger"
import { Input } from "@/components/ui/input"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeftIcon } from "lucide-react"

const NewFriendSidebar = () => {
    const newFriendTrigger = useAppSelector(state => state.newFriendTrigger.triggerNewFriend)
    const dispatch = useAppDispatch();
    return (
        <AnimatePresence>
            {newFriendTrigger && (
                <div
                    className="inset-0 absolute h-full"
                >
                    <motion.div
                        key="friend-sidebar"
                        initial={{ x: "-100vw" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100vw" }}
                        transition={{ duration: 0.2 }}
                        className="bg-white w-full h-full z-50
                        flex flex-col gap-6 px-6"
                    >
                        {/* Header */}
                        <div className="w-full flex flex-col">
                            <div className="w-full flex items-center space-x-4 py-4">
                                <ArrowLeftIcon onClick={() => dispatch(untriggerNewFriend())} className="w-5 h-5 hover:cursor-pointer" />
                                <p>Add Friend</p>
                            </div>
                        </div>

                        {/* Add */}
                        <div className="w-full flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <Input
                                    placeholder="Fullname"
                                    type="text"
                                    className="rounded-full h-12 px-10"
                                />
                                <p className="ml-2 text-red-600"></p>
                            </div>
                            <button className="w-full bg-black rounded-full text-white font-bold py-3
                            hover:cursor-pointer hover:bg-black/85 transition-all duration-200">
                                Add Friend
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default NewFriendSidebar