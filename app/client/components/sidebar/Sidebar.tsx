import { useEffect, useCallback } from "react"
import { SidebarLinkSchema } from "../../types/types"
import { sidebarlinks } from "../../utils/utils"
import Logo from "../reusableComponents/Logo"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import axios from "../../utils/config/axios"
import toast from "react-hot-toast"
import { getInformation } from "@/app/redux/informationSlices/usersInformationSlice"
import { getNotifications } from "@/app/redux/chatSlices/notificationSlice"
import { socket } from "../../utils/config/io"
import { events } from "../../utils/events"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons"
import { useUnread } from "../../utils/context"


const Sidebar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(state => state.notificationContainer.notifications);
    const notSeenNotifs = notifications.filter((notif) => !notif.isSeen);
    const usersInformation = useAppSelector(state => state.usersInformation)
    const currentTab = searchParams.get('tab');

    const isActiveButton = currentTab === 'course-creation';
    const { totalUnread, setTotalUnread } = useUnread();

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
            console.log("🔄 Total unread from server:", res.data.totalUnread);
            setTotalUnread(res.data.totalUnread);
        }).catch((err) => {
            console.error(err)
            if (err.response.status === 401 || err.response.status === 403) {
                router.push("/client/auth/login")
                return
            }
            toast.error("A server error occurred. Please bare with us")
        })
    }, [dispatch, router, setTotalUnread])

    useEffect(() => {
        fetchNotifs()
    }, [dispatch, fetchNotifs])

    useEffect(() => {
        fetchChatNotifications()
    }, [dispatch, fetchChatNotifications])

    const handleRouteChange = (value: string) => {
        let tabParam = "";
        switch (value) {
            case "a":
                tabParam = "";
                break;
            case "b":
                tabParam = "?tab=my-courses";
                break;
            case "c":
                tabParam = "?tab=courses";
                break;
            case "d":
                tabParam = "?tab=chat";
                break;
            case "e":
                tabParam = "?tab=inbox";
                break;
            case "g":
                tabParam = "?tab=profile";
                break;

            default:
                tabParam = "";
        }
        router.push(`/client/dashboard${tabParam}`);
    };

    const isActive = (value: string) => {
        switch (value) {
            case "a": return !tab;
            case "b": return tab === "my-courses";
            case "c": return tab === "courses";
            case "d": return tab === "chat";
            case "e": return tab === "inbox";
            case "g": return tab === "profile";
            default: return false;
        }
    };

    const fetchInfo = useCallback(() => {

        axios.get("/api/get-information", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }
        }).then((res) => {

            dispatch(getInformation(res.data.payload));
        }).catch((err) => {
            console.error(err)
            toast.error(err.response?.msg || "Failed to fetch information");
            return;
        });

    }, [dispatch]);

    useEffect(() => {
        fetchInfo();
    }, [fetchInfo]);

    useEffect(() => {
        const data = {
            room: usersInformation._id.toString()
        }

        socket.emit(events.JOIN_ROOM, data)
        return () => {
            socket.off(events.JOIN_ROOM)
        }
    }, [dispatch, usersInformation._id])
    return (
        <div className="col-span-1 hidden max-lg:col-span-3 py-4 md:flex flex-col bg-white/40 border border-gray-300 h-full">
            {/* Routes */}
            <div className="min-h-fit flex flex-col space-y-4">
                {/* logo + title */}
                <div className="flex justify-center items-center">
                    <Logo />
                </div>

                {/* Links */}
                <ul className="flex flex-col h-fit px-3 space-y-10 mt-6">
                    {sidebarlinks.map((link: SidebarLinkSchema) => (
                        <li
                            key={link.value}
                            onClick={() => handleRouteChange(link.value)}
                            className={`
                                group relative flex items-center transition-all duration-200
                                hover:cursor-pointer rounded-full mx-auto
                                justify-center w-12 h-12 liCon
                                ${isActive(link.value)
                                    ? "bg-black text-white"
                                    : "hover:bg-black hover:text-white"
                                }
                            `}
                        >
                            {/* Icon */}
                            <span className="relative">
                                {link.icon}
                                {/* Chats Number */}
                                {link.routeName === "Chats" && (
                                    <span className={`${tab === "chat" ? "bg-white text-black" : "text-white"} 
                                        text-xs font-bold ${totalUnread <= 0 || isNaN(totalUnread) ? "" : "bg-black w-4 h-4"} rounded-full absolute centered-flex top-0 left-4 unread`}>
                                        {totalUnread <= 0 ? "" : isNaN(totalUnread) ? "" : totalUnread}
                                    </span>
                                )}

                                {notSeenNotifs.length > 0 && link.routeName === "Inbox" && (
                                    <span className={`${tab === "inbox" ? "bg-white text-black" : "text-white"} 
                                        text-xs font-bold bg-black rounded-full w-4 h-4 absolute centered-flex top-0 left-3 unread`}>
                                        {notSeenNotifs.length}
                                    </span>
                                )}
                            </span>

                            <span className={`
                                absolute -top-10 left-1/2 transform -translate-x-1/2
                                bg-black text-white text-xs font-medium py-1 px-2 rounded
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                whitespace-nowrap pointer-events-none
                                before:content-[''] before:absolute before:top-full before:left-1/2 
                                before:-translate-x-1/2 before:border-4 before:border-transparent 
                                before:border-t-black z-50 ml-4 lg:m-0
                                ${link.routeName === "Course Creation" ? "mr-4" : ""}
                            `}>
                                {link.routeName}
                            </span>
                        </li>
                    ))}

                    <motion.button
                        whileHover={isActiveButton ? {} : {
                            scale: 1.1,
                            cursor: "pointer",
                            filter: "saturate(150%)"
                        }}
                        whileTap={isActiveButton ? {} : {
                            scale: 0.9,
                            cursor: "pointer"
                        }}
                        transition={{
                            type: "spring",
                            damping: 10,
                            stiffness: 100,
                            duration: 0.3
                        }}
                        className={`rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 via-sky-500
    text-white w-14 h-14 centered-flex mx-auto shadow-lg
    relative group`}
                        animate={{
                            scale: isActiveButton ? 1.1 : 1,
                            filter: isActiveButton ? "saturate(150%)" : "saturate(100%)"
                        }}
                        onClick={() => router.push('/client/dashboard?tab=course-creation')}
                    >
                        <FontAwesomeIcon icon={faMagicWandSparkles} className="text-xl" />

                        {/* Tooltip */}
                        <span className="
    absolute -top-10 left-1/2 transform -translate-x-1/2
    bg-black text-white text-xs font-medium py-1 px-2 rounded
    opacity-0 group-hover:opacity-100 transition-opacity duration-300
    whitespace-nowrap pointer-events-none
    before:content-[''] before:absolute before:top-full before:left-1/2 
    before:-translate-x-1/2 before:border-4 before:border-transparent 
    before:border-t-black z-50
  ">
                            Create Course
                        </span>
                    </motion.button>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar