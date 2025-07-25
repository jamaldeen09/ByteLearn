"use client"

import { AnimatePresence, motion } from "framer-motion"
import { XIcon, ImageIcon } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import Image from "next/image"
import { IMessage } from "../../types/types"
import { activatePreview, getImageId } from "@/app/redux/triggers/imagePreviewTrigger"

type ImagesViewProps = {
    trigger: boolean,
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>,
    setGalleryTrigger: React.Dispatch<React.SetStateAction<boolean>>,
    setProfileView: React.Dispatch<React.SetStateAction<boolean>>,
}

const ImageView = ({ trigger, setTrigger, setGalleryTrigger, setProfileView }: ImagesViewProps) => {
    const messages = useAppSelector(state => state.messages.messages)
    const dispatch = useAppDispatch()

    const getOnlyImages = messages.filter((msg) => msg.imageUrl)

    return (
        <AnimatePresence>
            {trigger && (
                <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="inset-0 fixed h-full w-full flex justify-end bg-black/10"
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
                        className="w-full max-w-sm bg-white h-full flex flex-col py-10 px-4 gap-4"
                    >
                        <div className="w-full flex items-center justify-between">
                            <p className="font-extrabold text-xl">Gallery</p>
                            <XIcon 
                                onClick={() => setTrigger(false)} 
                                className="hover:cursor-pointer text-gray-500 hover:text-gray-800 transition-colors" 
                            />
                        </div>

                        {getOnlyImages.length > 0 ? (
                            <div className="overflow-y-auto flex-grow">
                                <div className="grid grid-cols-2 gap-4 justify-items-center">
                                    {getOnlyImages.map((msg: IMessage, index: number) => (
                                        <Image
                                            key={index}
                                            src={msg?.imageUrl || "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"}
                                            alt="An image that was sent to the people participating in chat exchange"
                                            width={180}
                                            height={180}
                                            className="rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 active:scale-90 hover:brightness-75 object-cover"
                                            unoptimized
                                            onClick={() => {
                                                dispatch(activatePreview())
                                                setGalleryTrigger(false)
                                                setTrigger(false)
                                                setProfileView(false)
                                                dispatch(getImageId(msg._id))
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col items-center justify-center gap-4 text-center p-8">
                                <div className="bg-gray-100 p-6 rounded-full">
                                    <ImageIcon className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-medium text-gray-800">No Images Yet</h3>
                                <p className="text-gray-500 max-w-xs">
                                    Images shared in this conversation will appear here
                                </p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ImageView