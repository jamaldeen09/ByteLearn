"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { SidebarNavProps } from "../../types/types"
import { harmBurgerMenu, searchIcon } from "@/app/icons/Icons"
import { useAppDispatch } from "@/app/redux/essentials/hooks"
import { triggerCanvas, untriggerCanvas } from "@/app/redux/triggers/canvasTriggerSlice"


const SidebarNav = ({ profilePic, firstName }: SidebarNavProps) => {
    // trigger dropdown
    const [triggerDropdown, setTriggerDropdown] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        document.body.addEventListener("click", () => {
            dispatch(untriggerCanvas())
        })
    }, [])
    return (
        <nav
            className="p-4"
        >

            <div className="flex items-center justify-between">

                <div className="w-full relative flex items-center gap-4 md:block md:gap-0">
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
                        <Input className="w-full bg-white rounded-full px-14 shadow-md h-10" type="text" placeholder="Search" />
                        <motion.span
                            whileHover={{ scale: 1.1, cursor: "pointer", filter: "brightness(90%)" }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2, type: "spring", damping: 9, stiffness: 100 }}
                            className="absolute top-2 text-gray-400 left-5  font-extrabold">
                            {searchIcon}
                        </motion.span>
                    </div>
                </div>

                <div className="flex items-center space-x-4 relative w-full justify-end">
                    <img onClick={() => setTriggerDropdown(true)} className="w-10 h-10 rounded-full hover:cursor-pointer" src={profilePic} alt="Rounded avatar" />
                    <p className="text-md">{firstName}</p>

                    {/* Dropdown */}
                    <AnimatePresence>
                        {triggerDropdown && (
                            <motion.div
                                key="dropdown"
                                exit={{ y: -20, opacity: 0 }}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.1, type: "spring", damping: 10, stiffness: 100 }}
                                className="rounded-lg border h-40 absolute top-[5rem] z-50 w-[5vw] bg-white"
                            >

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    )
}

export default SidebarNav