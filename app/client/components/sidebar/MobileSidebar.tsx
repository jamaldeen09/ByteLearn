"use client"
import { motion } from "framer-motion"
import Logo from "../reusableComponents/Logo"
import { sidebarlinks } from "../../utils/utils"
import { SidebarLinkSchema } from "../../types/types"
import { xIcon } from "@/app/icons/Icons"
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

const MobileSidebar = () => {
    const dispatch = useAppDispatch()
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab')
    const usersInformation = useAppSelector(state => state.usersInformation)
    const currentTab = searchParams.get('tab');

    const isActiveButton = currentTab === 'course-creation';

    // Wrap fetchInfo in useCallback
    const fetchInfo = useCallback(async () => {
        axios.get("/api/get-information", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } })
            .then((res) => {
                dispatch(getInformation(res.data.payload))
            }).catch((err) => {
                console.error(err)
                toast.error(err)
            })
    }, [dispatch])

    useEffect(() => {
        fetchInfo();
    }, [fetchInfo])

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

            default: return false;
        }
    };

    useEffect(() => {
        const data = {
            room: usersInformation._id.toString()
        }

        socket.emit(events.JOIN_ROOM, data)
        return () => {
            socket.off(events.JOIN_ROOM)
        }
    }, [dispatch])
    return (
        <motion.div
            key="mobile-sidebar"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
            }}
            className="fixed top-0 left-0 h-full w-80 max-w-xs bg-white shadow-xl z-50 md:hidden overflow-y-auto
            gap-10  flex flex-col"
        >
            {/* logo + title */}
            <div className="flex justify-between items-center pr-6">
                <div className="flex items-center">
                    <Logo />
                    <h1 className="font-extrabold text-xl">ByteLearn</h1>
                </div>

                <div onClick={() => dispatch(untriggerCanvas())}
                    className="fit hover:cursor-pointer">
                    <span>{xIcon}</span>
                </div>
            </div>

            {/* links */}

            <ul className="flex flex-col h-fit px-2 space-y-8">

                {sidebarlinks.map((link: SidebarLinkSchema) => {
                    return (
                        <li
                            key={link.value}
                            onClick={() => handleRouteChange(link.value)}
                            className={`
                                flex items-center space-x-4 w-full py-5 rounded-full hover:bg-black
                                hover:text-white transition-all duration-300 hover:cursor-pointer px-4
                                ${isActive(link.value)
                                    ? "bg-black text-white"
                                    : "hover:bg-black hover:text-white"
                                }
                            `}
                        >
                            {/* Icon */}
                            <span
                                className="relative"
                            >
                                {link.icon}
                                {/* Chats Number */}
                                {link.routeName === "Chats" && <span
                                    className="text-xs font-bold bg-black rounded-full w-4 h-4 text-white absolute centered-flex top-0 left-4
                                  unread">
                                    2
                                </span>}
                            </span>

                            <span className="ml-2">
                                {link.routeName}
                            </span>
                        </li>
                    )
                })}


                <div onClick={() => router.push('/client/dashboard?tab=course-creation')}
                className={`flex items-center space-x-4 hover:cursor-pointer
                bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400 hover:via-sky-500 rounded-full hover:text-white transition-colors duration-200
                ${isActiveButton && "from-blue-500 to-cyan-400 via-sky-500 text-white"}`}>
                <motion.button
    
                    className={`rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 via-sky-500
                    text-white w-14 h-14 centered-flex shadow-lg
                    relative group`}
                   
                
                >
                    <FontAwesomeIcon icon={faMagicWandSparkles} className="text-xl" />

                   
                </motion.button>
                <p className="">Create Course</p>
                </div>
            </ul>

        </motion.div>
    )
}

export default MobileSidebar