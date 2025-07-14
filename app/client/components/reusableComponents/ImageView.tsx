"use client"

import { AnimatePresence, motion } from "framer-motion"
import { XIcon } from "lucide-react"
import { useAppSelector } from "@/app/redux/essentials/hooks"
import Image from "next/image"
import { IMessage } from "../../types/types"




type ImagesViewProps = {
    trigger: boolean,
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>,

}
const ImageView = ({ trigger, setTrigger }: ImagesViewProps) => {
    const messages = useAppSelector(state => state.messages.messages)
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
                flex flex-col py-10 px-4 gap-4 ">
                        <div className="w-full flex items-center justify-end">
                            <XIcon onClick={() => setTrigger(false)} className="w-4 h-4" />
                        </div>

                        <div className="flex flex-col gap-4">
                            {messages.map((msg: IMessage, index: number) => {
                                return (
                                    <Image
                                        key={index}
                                        src={msg?.imageUrl ? msg?.imageUrl : ""}
                                        alt="An image that was sent to the people particiapting in chat exchange"
                                        width={100}
                                        height={100}
                                        className="rounded-lg"
                                        unoptimized={true}
                                    />
                                )
                            })}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ImageView