"use client"
import { motion } from "framer-motion"
import { harmBurgerMenu } from "@/app/icons/Icons"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { triggerCanvas } from "@/app/redux/triggers/canvasTriggerSlice"
import Image from 'next/image'

const SidebarNav = () => {
    // trigger dropdown
    const dispatch = useAppDispatch()
    const usersInformation = useAppSelector(state => state.usersInformation)
    return (
        <nav className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <div className="w-full relative flex items-center gap-6 md:block md:gap-0">
                    <motion.div
                        onClick={() => dispatch(triggerCanvas())}
                        whileHover={{ scale: 1.2, cursor: "pointer" }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2, type: "spring", damping: 9, stiffness: 100 }}
                        className="w-fit md:hidden"
                    >
                        <span className="">{harmBurgerMenu}</span>
                    </motion.div>
                    <div className="relative w-full max-w-2xl">
                        <h1 className="font-bold sm:text-xl">ByteLearn</h1>
                    </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4 relative w-full justify-end">
                    <Image 
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" 
                        src={usersInformation.avatar ? usersInformation.avatar : "https://thumbs.dreamstime.com/b/black-school-icon-shadow-logo-design-white-157312165.jpg"} 
                        alt={`${usersInformation.fullName}'s profile picture`}
                        width={40}
                        height={40}
                        unoptimized={true}
                    />
                    <p className="text-[0.6rem] sm:text-[0.8rem]">{usersInformation.fullName}</p>
                </div>
            </div>
        </nav>
    )
}

export default SidebarNav