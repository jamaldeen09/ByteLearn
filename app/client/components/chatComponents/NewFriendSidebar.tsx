"use client"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { untriggerNewFriend } from "@/app/redux/triggers/newFriendTrigger"
import { Input } from "@/components/ui/input"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeftIcon } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { firstNameValidation, lastNameValidation } from "../../utils/utils"
import { socket } from "../../utils/config/io"
import { events } from "../../utils/events.js"
import toast from "react-hot-toast"
import WhiteSpinner from "../reusableComponents/WhiteSpinner"

const NewFriendSidebar = () => {
    const newFriendTrigger = useAppSelector(state => state.newFriendTrigger.triggerNewFriend)
    const dispatch = useAppDispatch()
    const usersInformation = useAppSelector(state => state.usersInformation)

    const [loading, setLoading] = useState<boolean>(false)
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [firstNameErr, setFirstNameErr] = useState<boolean>(false)
    const [lastNameErr, setLastNameErr] = useState<boolean>(false)
    const [sendRequest, setSendRequest] = useState<boolean>(false)
    const [extraErr, setExtraErr] = useState<string>("")

    const handleSocketEvents = useCallback(() => {
        const data = {
            firstName,
            lastName,
        }

        socket.emit(events.ADD_FRIEND, data)

        socket.on(events.ERROR_OCCURED, ({ msg }) => {
            setLoading(false)
            toast.error(msg)
            setFirstName("")
            setLastName("")
        })
        
        socket.on(events.NOT_FOUND, ({ msg }) => {
            setLoading(false)
            setExtraErr(msg)
            setFirstName("")
            setLastName("")
        })

        socket.on(events.NOT_ALLOWED, ({ msg }) => {
            setLoading(false)
            setExtraErr(msg)
            setFirstName("")
            setLastName("")
        })

        socket.on(events.NEW_NOTIFICATION, ({ msg }) => {
            setLoading(false)
            setFirstName("")
            setLastName("")
            toast.success(msg)
        })

        return () => {
            socket.off(events.ADD_FRIEND)
            socket.off(events.NOT_FOUND)
            socket.off(events.ERROR_OCCURED)
            socket.off(events.NOT_ALLOWED)
            socket.off(events.NEW_NOTIFICATION)
        }
    }, [firstName, lastName])

    useEffect(() => {
        const data = {
            room: usersInformation._id.toString()
        }

        socket.emit(events.JOIN_ROOM, data)
        return () => {
            socket.off(events.JOIN_ROOM)
        }
    }, [usersInformation._id])

    useEffect(() => {
        socket.on(events.SEND_NOTIFICATION, ({ msg }) => {
            toast.success(msg)
            return;
        })

        return () => {
            socket.off(events.SEND_NOTIFICATION)
        }
    }, [])

    useEffect(() => {
        if (!sendRequest) {
            setLoading(false)
            return
        }

        const firstNameValidity = firstNameValidation(firstName)
        const lastNameValidity = lastNameValidation(lastName)

        if (firstNameValidity && lastNameValidity) {  
            setLoading(true)
            handleSocketEvents()
        }

        return () => {
            setSendRequest(false)
        }
    }, [sendRequest, firstName, lastName, handleSocketEvents])

    return (
        <AnimatePresence>
            {newFriendTrigger && (
                <div className="inset-0 absolute h-full">
                    <motion.div
                        key="friend-sidebar"
                        initial={{ x: "-100vw" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100vw" }}
                        transition={{ duration: 0.2 }}
                        className="bg-white w-full h-full z-50 flex flex-col gap-6 px-6"
                    >
                        {/* Header */}
                        <div className="w-full flex flex-col">
                            <div className="w-full flex items-center space-x-4 py-4">
                                <ArrowLeftIcon 
                                    onClick={() => dispatch(untriggerNewFriend())} 
                                    className="w-5 h-5 hover:cursor-pointer" 
                                />
                                <p>Add Friend</p>
                            </div>
                        </div>

                        {/* Add Friend Form */}
                        <div className="w-full flex flex-col gap-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Input
                                        placeholder="Firstname"
                                        type="text"
                                        className={`${firstNameErr && "border-destructive focus-visible:ring-destructive focus:border-0"} rounded-full h-12 px-10`}
                                        value={firstName}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const newFirstName = e.target.value
                                            setExtraErr("")
                                            setFirstNameErr(!firstNameValidation(newFirstName))
                                            setFirstName(newFirstName)
                                        }}
                                    />
                                    <p className="text-red-600 text-xs ml-2">
                                       {firstNameErr && "Firstname must be 5 characters"}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Input
                                        placeholder="Lastname"
                                        type="text"
                                        className={`${lastNameErr && "border-destructive focus-visible:ring-destructive focus:border-0"} rounded-full h-12 px-10`}
                                        value={lastName}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const newLastName = e.target.value
                                            setExtraErr("")
                                            setLastNameErr(!lastNameValidation(newLastName))
                                            setLastName(newLastName)
                                        }}
                                    />
                                    <p className="text-red-600 text-xs ml-2">
                                        {lastNameErr && "Lastname must be 5 characters"}
                                    </p>
                                    <p className="text-red-600 text-xs">
                                        {extraErr}
                                    </p>
                                </div>
                            </div>

                            {(!firstNameValidation(firstName) || !lastNameValidation(lastName)) ? (
                                <button 
                                    className="w-full bg-gray-200 rounded-full text-gray-400 py-3 cursor-not-allowed"
                                >
                                    <p>Send Friend Request</p>
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setSendRequest(true)}
                                    className={`w-full bg-black rounded-full text-white font-bold py-3 hover:cursor-pointer hover:bg-black/85 transition-all duration-200 centered-flex ${loading && "space-x-4"}`}
                                >
                                    <p>Send Friend Request</p>
                                    {loading && (
                                        <span className="relative top-[0.2rem]">
                                            <WhiteSpinner />
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default NewFriendSidebar