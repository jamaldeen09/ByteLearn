"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ProfileSidebar } from "../../types/types"
import Image from "next/image"
import { imagesIcon } from "@/app/icons/Icons"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { XIcon } from "lucide-react"



const ProfileViewSidebar = ({ fullName, bio, trigger, setTrigger, avatar, imgView, triggerImgView }: ProfileSidebar) => {
    
    return (
        <AnimatePresence>
            {trigger && (
                <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="inset-0 fixed h-full w-full flex justify-end bg-black/70"
                >
                    {/* Sidebar */}
                    <motion.div 
                    key="profile-sidebar"
                    initial={{ x: 320 }}
                    animate={{ x: 0 }}
                    exit={{ x: 320 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }}
                    className="w-full max-w-sm bg-white h-full
                flex flex-col py-10 px-6 items-center gap-10">
                        <div className="w-full flex justify-end items-center">
                            <XIcon onClick={() => setTrigger(false)} />
                        </div>
                        {/* Name */}
                        <div className="w-full flex flex-col gap-4 text-center">
                            <Image
                                src={avatar ? avatar : "https://t3.ftcdn.net/jpg/06/33/54/78/360_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg"}
                                alt="Profile View"
                                width={90}
                                height={90}
                                unoptimized={true}
                                className="rounded-full mx-auto"
                            />
                            <div className="flex flex-col gap-1">
                                <h1 className="font-bold text-2xl">{fullName || "Jamal Olatunji"}</h1>
                                <p className="text-gray-400 text-sm">Bio: {bio}</p>
                            </div>
                        </div>

                        <div onClick={() => triggerImgView(true)}
                        className="w-full flex items-center space-x-4 py-4 px-3 rounded-md border border-gray-200 hover:cursor-pointer">
                            <p>{imagesIcon}</p>
                            <div className="flex items-center w-full justify-between">
                                <p className="text-black">Photos</p>
                                <ArrowRightIcon className="size-4" />
                            </div>
                        </div>
                        
                    </motion.div>
                   
                </motion.div>
            )}

        </AnimatePresence>
    )
}

export default ProfileViewSidebar