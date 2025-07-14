"use client"
import { AnimatePresence, motion } from "framer-motion"
import { AddComponentProps, EnableAddFriendProps } from "../../types/types"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { newContact, newGroup } from "@/app/icons/Icons"
import AddComponent from "./AddComponent"

import { useAppDispatch } from "@/app/redux/essentials/hooks"
import { newFriend } from "@/app/redux/triggers/newFriendTrigger"
import { newGroupTrigger } from "@/app/redux/triggers/groupCreationTrigger"


const AddFriendSidebar = ({ triggerAddFriend, setTriggerAddFriend }: EnableAddFriendProps) => {
    const dispatch = useAppDispatch()
    const addButtonUtils: AddComponentProps[] = [
        {
            icon: newGroup, purpose: "New Group", whatTheButtonDoes: () => {
                dispatch(newGroupTrigger())
            }
        },
        {
            icon: newContact, purpose: "New Friend", whatTheButtonDoes: () => {
                dispatch(newFriend())
            }
        },
    ]
    
    return (
        <>
            <AnimatePresence>
                {triggerAddFriend && (

                    <motion.div
                        className="inset-0 absolute h-full"
                    >
                        <motion.div
                            key="addfriend-sidebar"
                            initial={{ x: "-100vw" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100vw" }}
                            transition={{ duration: 0.2 }}
                            className="bg-white w-full h-full z-50
                        flex flex-col gap-6"
                        >
                            {/* Header */}
                            <div className="w-full flex items-center space-x-4 px-6 py-4">
                                <ArrowLeftIcon onClick={() => setTriggerAddFriend(false)} className="w-5 h-5 hover:cursor-pointer" />
                                <p>New contact</p>
                            </div>

                            {/* Buttons to add */}
                            <div className="flex flex-col space-y-4 px-6">
                                {addButtonUtils.map((addComponent: AddComponentProps, index: number): React.ReactElement => {
                                    return (
                                        <AddComponent
                                            key={index}
                                            icon={addComponent.icon}
                                            purpose={addComponent.purpose}
                                            whatTheButtonDoes={addComponent.whatTheButtonDoes}

                                        />
                                    )
                                })}
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default AddFriendSidebar