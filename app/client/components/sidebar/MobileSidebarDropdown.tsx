"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { sidebarlinks } from "../../utils/utils"
import { SidebarLinkSchema } from "../../types/types"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { untriggerCanvas } from "@/app/redux/triggers/canvasTriggerSlice"
import axios from "../../utils/config/axios"
import { getInformation } from "@/app/redux/informationSlices/usersInformationSlice"
import { useEffect, useCallback } from "react"
import toast from "react-hot-toast"
import { socket } from "../../utils/config/io"
import { events } from "../../utils/events"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons"
import { getNotifications } from "@/app/redux/chatSlices/notificationSlice"
import { useUnread } from "../../utils/context"


const MobileSidebarDropdown = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const searchParams = useSearchParams()
    const tab = searchParams.get('tab')
    const usersInformation = useAppSelector(state => state.usersInformation)
    const currentTab = searchParams.get('tab')
    const trigger = useAppSelector(state => state.canvasTrigger.canvas)
    const notifications = useAppSelector(state => state.notificationContainer.notifications);
    const notSeenNotifs = notifications.filter((notif) => !notif.isSeen);


    const { totalUnread, setTotalUnread } = useUnread()

    const fetchNotifs = useCallback(() => {
        axios.get("/api/get-notifications", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } }).then((res) => {
            dispatch(getNotifications(res.data.notifications))
        }).catch((err) => {
            console.error(err)
            if (err.response.status === 401 || err.response.status === 403) {
                router.push("/client/auth/login")
                return
            }
            toast.error("A server error occurred. Please bare with us")
        })
    }, [dispatch, router])

    const fetchChatNotifications = useCallback(() => {
        axios.get("/api/unread-messages", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } }).then((res) => {
            setTotalUnread(res.data.totalUnread);

        }).catch((err) => {
            console.error(err)
            if (err.response.status === 401 || err.response.status === 403) {
                router.push("/client/auth/login")
                return
            }
            toast.error("A server error occurred. Please bare with us")
        })
    }, [router, setTotalUnread])

    useEffect(() => {
        fetchNotifs()
    }, [dispatch, fetchNotifs])

    useEffect(() => {
        fetchChatNotifications()
    }, [dispatch, fetchChatNotifications])


    const fetchInfo = useCallback(async () => {
        try {
            const res = await axios.get("/api/get-information", {
                headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }
            })
            dispatch(getInformation(res.data.payload))
        } catch (err) {
            console.error(err)
            toast.error("Failed to fetch user information")
        }
    }, [dispatch])

    useEffect(() => {
        fetchInfo()
        const data = { room: usersInformation._id.toString() }
        socket.emit(events.JOIN_ROOM, data)
        return () => { socket.off(events.JOIN_ROOM) }
    }, [dispatch, fetchInfo, usersInformation._id])

    const handleRouteChange = (value: string) => {
        const tabMap: Record<string, string> = {
            "a": "",
            "b": "my-courses",
            "c": "courses",
            "d": "chat",
            "e": "inbox",
            "g": "profile",
        }
        const tabParam = tabMap[value] ? `?tab=${tabMap[value]}` : ""
        router.push(`/client/dashboard${tabParam}`)


    }

    const isActive = (value: string) => {
        const tabMap: Record<string, string> = {
            "a": "",
            "b": "my-courses",
            "c": "courses",
            "d": "chat",
            "e": "inbox",
            "g": "profile",
        }
        return tab === tabMap[value]
    }

    return (
        <div className="fixed top-14 left-4 z-50 md:hidden">
            {/* Dropdown Trigger */}

            {/* Dropdown Content */}
            <AnimatePresence>
                {trigger && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 w-80 px-2 bg-white rounded-lg shadow-xl overflow-hidden"
                    >
                        <div className="border-b border-gray-100 px-4 py-3 flex justify-between items-center">
                            <h3 className="font-medium">Navigation</h3>
                            <button
                                onClick={() => dispatch(untriggerCanvas())}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <ul className="py-2">
                            {sidebarlinks.map((link: SidebarLinkSchema) => (
                                <li key={link.value} className="rounded-xl">
                                    <button
                                        onClick={() => handleRouteChange(link.value)}
                                        className={`w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors 
                                            ${isActive(link.value)
                                                ? "bg-gray-100 text-black font-medium"
                                                : "hover:bg-gray-50 text-gray-700"
                                            }`}
                                    >
                                        <span className="w-5 flex justify-center">
                                            {link.icon}
                                        </span>
                                        <span>{link.routeName}</span>
                                        {link.routeName === "Chats" && (
                                            <span className={`ml-auto ${totalUnread <= 0 ? "bg-transparent" : isNaN(totalUnread) ? "bg-transparent" : "bg-black"} text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center`}>
                                                {totalUnread <= 0 ? "" : isNaN(totalUnread) ? "" : totalUnread}
                                            </span>
                                        )}

                                        {notSeenNotifs.length > 0 && link.routeName === "Inbox" && (
                                            <span className={`${tab === "inbox" ? "bg-white text-black" : "text-white"} 
                                        text-xs font-bold bg-black rounded-full w-4 h-4 absolute centered-flex top-0 left-3 unread`}>
                                                {notSeenNotifs.length}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}

                            <li className="mt-2 pt-2 rounded-xl border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        router.push('/client/dashboard?tab=course-creation')
                                        dispatch(untriggerCanvas())
                                    }}
                                    className={`w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors rounded-xl
                                        ${currentTab === 'course-creation'
                                            ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium"
                                            : "hover:bg-gray-50 text-gray-700"
                                        }`}
                                >
                                    <span className="w-5 flex justify-center">
                                        <FontAwesomeIcon icon={faMagicWandSparkles} />
                                    </span>
                                    <span>Create Course</span>
                                </button>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default MobileSidebarDropdown