"use client"

import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { untriggerNewFriend } from "@/app/redux/triggers/newFriendTrigger"
import { Input } from "@/components/ui/input"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeftIcon, ReceiptRussianRuble } from "lucide-react"
import { useEffect, useState } from "react"
import { firstNameValidation, lastNameValidation } from "../../utils/utils"
import axios from "../../utils/config/axios"
import { socket } from "../../utils/config/io"
import { events } from "../../utils/events.js"
import toast from "react-hot-toast"
import WhiteSpinner from "../reusableComponents/WhiteSpinner"
import { showSuccessToast } from "../../utils/ToastContainer"
import { useRouter } from "next/navigation"

const NewFriendSidebar = () => {
    const newFriendTrigger = useAppSelector(state => state.newFriendTrigger.triggerNewFriend)
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter()

    // strings
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const usersInformation = useAppSelector(state => state.usersInformation)

    // booleans
    const [firstNameErr, setFirstNameErr] = useState<boolean>(false);
    const [lastNameErr, setLastNameErr] = useState<boolean>(false);
    const [sendRequest, setSendRequest] = useState<boolean>(false);
    const [extraErr, setExtraErr] = useState<string>("")

    useEffect(() => {
        const data = {
            room: usersInformation._id.toString()
        }

        socket.emit(events.JOIN_ROOM, data);
        return () => {
            socket.off(events.JOIN_ROOM)
        }
    })

    useEffect(() => {
        socket.on(events.SEND_NOTIFICATION, ({ msg }) => {
            console.log(msg)
            toast.success(msg);
            return;
        })

        return () => {
            socket.off(events.SEND_NOTIFICATION)
        }
    })
    useEffect(() => {
        setLoading(true);
        if (!sendRequest) {
            setLoading(false);
            return;
        }
        const firstNameValidity = firstNameValidation(firstName)
        const lastNameValidity = lastNameValidation(lastName)

        if (firstNameValidity && lastNameValidity) {  
            const data = {
                firstName,
                lastName,
            }
            socket.emit(events.ADD_FRIEND, data)

            // Server Error
            socket.on(events.ERROR_OCCURED, ({ msg }) => {
                setLoading(false)
                toast.error(msg);
                setFirstName("")
                setLastName("")
                return;
            })
            
            // not found
            socket.on(events.NOT_FOUND, ({ msg }) => {
                setLoading(false)
                setExtraErr(msg);
                setFirstName("")
                setLastName("")
                return;
            })

            // cannot add onself
            socket.on(events.NOT_ALLOWED, ({ msg }) => {
                setLoading(false)
                setExtraErr(msg);
                setFirstName("")
                setLastName("")
                return;
            })

            // send notification
            socket.on(events.NEW_NOTIFICATION, ({ msg }) => {
                setLoading(false)
                setFirstName("")
                setLastName("")

                toast.success(msg);
                return;
            })
        }

        return () => {
            socket.off(events.ADD_FRIEND)
            socket.off(events.NOT_FOUND)
            socket.off(events.ERROR_OCCURED)
            socket.off(events.NOT_ALLOWED)
            socket.off(events.SEND_NOTIFICATION)
            socket.off(events.NEW_NOTIFICATION)
        }
    }, [sendRequest])

    
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
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Input
                                        placeholder="Firstname"
                                        type="text"
                                        className={`${firstNameErr && "border-destructive focus-visible:ring-destructive focus:border-0"} rounded-full h-12 px-10`}
                                        value={firstName}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const newFirstName = e.target.value;
                                            setExtraErr("")
                                            if (!firstNameValidation(newFirstName)) {
                                                setFirstNameErr(true);
                                            } else {
                                                setFirstNameErr(false);
                                            }
                                            setFirstName(e.target.value)
                                        }}
                                    />
                                    <p className="text-red-600 text-xs ml-2">
                                       {firstNameErr && "Firstname must be 5 characters"}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 ">
                                    <Input
                                        placeholder="Lastname"
                                        type="text"
                                        className={`${lastNameErr && "border-destructive focus-visible:ring-destructive focus:border-0"}  rounded-full h-12 px-10`}
                                        value={lastName}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const newLastName= e.target.value;
                                            setExtraErr("")
                                            if (!lastNameValidation(newLastName)) {
                                                setLastNameErr(true);
                                            } else {
                                                setLastNameErr(false)
                                            }
                                            setLastName(e.target.value)
                                        }}
                                    />
                                    <p className="text-red-600 text-xs ml-2">
                                        {lastNameErr && "Lastname must be 5 characters"}
                                    </p>

                                    {/* extra err */}
                                    <p className="text-red-600 text-xs">
                                        {extraErr}
                                    </p>
                                </div>

                            </div>
                            {(!firstNameValidation(firstName) || !lastNameValidation(lastName))  ?
                            <button 
                                className={`w-full bg-gray-200 rounded-full text-gray-400 py-3
                              cursor-not-allowed 
                            `}>
                                <p>Send Friend Request</p>
                                
                            </button> 
                            
                            : <button onClick={
                                () => {
                                  setSendRequest(true)
                                }
                            }
                                className={`w-full bg-black rounded-full text-white font-bold py-3
                            hover:cursor-pointer hover:bg-black/85 transition-all duration-200
                            centered-flex ${loading && "space-x-4"}`}>
                                <p>Send Friend Request</p>
                                <span className="relative top-[0.2rem]">
                                    {loading && <WhiteSpinner />}
                                </span>
                            </button>}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default NewFriendSidebar