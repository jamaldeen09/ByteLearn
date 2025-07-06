"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { SidebarNavProps } from "../../types/types"
import { searchIcon } from "@/app/icons/Icons"


const SidebarNav = ({ profilePic, firstName }: SidebarNavProps) => {
    // trigger dropdown
    const [triggerDropdown, setTriggerDropdown] = useState<boolean>(false);

    useEffect(() => {
        document.body.addEventListener("click", () => {
            setTriggerDropdown(false);
        })
    }, [])
    return (
        <nav
            className="flex items-center md:justify-end p-4 basic-border"
        >

            <div className="w-full flex items-center space-x-10 justify-between md:w-fit md:justify-start">
                <div className="w-fit relative">
                    <div className="relative">
                        <Input className="h-10 hidden md:w-56 md:block bg-white rounded-full px-4" type="text" placeholder="Search" />
                        <motion.span
                            whileHover={{ scale: 1.1, cursor: "pointer", filter: "brightness(90%)" }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2, type: "spring", damping: 9, stiffness: 100 }}
                            className="md:absolute md:top-1 md:right-2  bg-black text-white rounded-ful centered-flex rounded-full w-10 h-10 md:w-8 md:h-8">
                            {searchIcon}
                        </motion.span>
                    </div>
                </div>

                <div className="flex items-center space-x-4 relative">
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