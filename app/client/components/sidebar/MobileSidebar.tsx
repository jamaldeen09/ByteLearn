"use client"
import { motion } from "framer-motion"
import Logo from "../reusableComponents/Logo"
import { sidebarlinks } from "../../utils/utils"
import { SidebarLinkSchema, SidebarProps } from "../../types/types"
import { xIcon } from "@/app/icons/Icons"
import { useAppDispatch } from "@/app/redux/essentials/hooks"

const MobileSidebar = ({ currentRoute, setCurrentRoute }: SidebarProps) => {
    const handleRouteChange = (value: string) => {
        setCurrentRoute(value);
    };
    const dispatch = useAppDispatch();
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
            gap-4  flex flex-col"
        >
            {/* logo + title */}
            <div className="flex justify-between items-center pr-6">
                <div className="flex items-center">
                <Logo />
                <h1 className="font-extrabold text-xl">ByteLearn</h1>
                </div>

                <div onClick={() => dispatch}
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
                                ${currentRoute === link.value
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
            </ul>

        </motion.div>
    )
}

export default MobileSidebar