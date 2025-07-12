"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { SidebarDropdownLinks, SidebarNavProps } from "../../types/types"
import { harmBurgerMenu } from "@/app/icons/Icons"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { triggerCanvas, untriggerCanvas } from "@/app/redux/triggers/canvasTriggerSlice"
import { sidebarDropdownLinks } from "../../utils/utils"
import { socket } from "../../utils/config/io.js"
import { events } from "../../utils/events"


const SidebarNav = () => {
    // trigger dropdown
    const [triggerDropdown, setTriggerDropdown] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const usersInformation = useAppSelector(state => state.usersInformation)
        
    
    useEffect(() => {
        document.body.addEventListener("click", () => {
            setTriggerDropdown(false)
            dispatch(untriggerCanvas())
        })
    }, [])
    return (
        <nav
            className="p-4 border-b border-gray-200"
        >

            <div className="flex items-center justify-between">

                <div className="w-full relative flex items-center gap-6 md:block md:gap-0">
                    <motion.div
                        onClick={() => dispatch(triggerCanvas())}
                        whileHover={{ scale: 1.2, cursor: "pointer" }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2, type: "spring", damping: 9, stiffness: 100 }}
                        className="w-fit md:hidden">
                        <span

                            className="">{harmBurgerMenu}
                        </span>
                    </motion.div>
                    <div className="relative w-full max-w-2xl">
                        <h1 className="font-bold sm:text-xl">ByteLearn</h1>
                    </div>
                </div>

                <div className="flex items-center space-x-4 relative w-full justify-end">
                    <img onClick={() => setTriggerDropdown(true)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:cursor-pointer" src={usersInformation.avatar ? usersInformation.avatar : "https://thumbs.dreamstime.com/b/black-school-icon-shadow-logo-design-white-157312165.jpg"}  alt={`${usersInformation.fullName}'s profile picture`} />
                    <p className="text-sm sm:text-md">{usersInformation.fullName}</p>
                </div>
                {/* Dropdown */}
                <AnimatePresence>
                    {triggerDropdown && (
                       <div
                       
                         className="inset-0 fixed flex justify-end px-6 md:px-16 py-20"
                       >
                         <motion.div
                            key="dropdown"
                            exit={{ y: -20, opacity: 0 }}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.1, type: "spring", damping: 10, stiffness: 100 }}
                            className="rounded-lg border h-fit z-50 w-[50vw] md:w-[14vw] bg-white 
                            flex flex-col justify-between px-2 py-2 shadow-lg gap-3"
                        >
                            {/* MAIN */}
                            <div className="w-full flex items-center border-b border-gray-200 px-4 py-2 space-x-4">
                            <img className="w-8 h-8 rounded-full hover:cursor-pointer" src={usersInformation.avatar ? usersInformation.avatar : "https://thumbs.dreamstime.com/b/black-school-icon-shadow-logo-design-white-157312165.jpg"} alt={`${usersInformation.fullName}'s profile picture`} />
                                <p className="text-sm">{usersInformation.fullName}</p>
                            </div>
                            <div className="flex flex-col space-y-4 w-full">
                            {sidebarDropdownLinks.map((link: SidebarDropdownLinks) => {
                                return (
                                    <p key={link.name} className={link.styles} onClick={link.routingFunc}>{link.name}</p>
                                )
                            })}
                            </div>
                        </motion.div>
                       </div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    )
}

export default SidebarNav