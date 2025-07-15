"use client"

import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { deactivatePreview } from "@/app/redux/triggers/imagePreviewTrigger"
import { AnimatePresence, motion } from "framer-motion"
import { XIcon } from "lucide-react"
import Image from "next/image"



const ImagePreviewComponent = () => {
    const { clickedImageId, activatePreview } = useAppSelector(state => state.imagePreview)

    const clickedImagesInformation = useAppSelector(state => state.messages.messages).find((msg) => msg._id === clickedImageId)
    const dispatch = useAppDispatch()
    return (
        <AnimatePresence>
            {activatePreview && (
                <motion.div

                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="inset-0 fixed h-full w-full centered-flex centered-flex bg-black/70"
                >
                    <motion.div
                        key="profile-sidebar"
                        initial={{ y: "100vh" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100vh" }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            duration: 0.2,
                        }}
                        className="h-full max-h-[80vh] bg-white w-full max-w-[80vw] rounded-xl py-6"
                    >
                        <div className="w-full flex items-center justify-between px-8">
                            <h1 className="text-3xl font-extrabold">Image Preview</h1>
                            <XIcon className="hover:cursor-pointer hover:scale-105" onClick={() => {
                                dispatch(deactivatePreview())
                            }} />
                        </div>
                        <div className="w-full h-full col-centered">
                            <div className="w-full h-fit centered-flex">
                                <Image
                                    src={clickedImagesInformation?.imageUrl || "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"}
                                    unoptimized={true}
                                    width={300}
                                    height={20}
                                    className="rounded-2xl"
                                    alt={"A preview of an image from gallery"}
                                />
                            </div>

                            <div className="w-full text-center flex flex-col gap-2">
                                <p className="text-3xl">Sent By: {clickedImagesInformation?.sender.fullName}</p>
                                <p className="text-gray-400">
                                    Sent At:{" "}
                                    {new Date(
                                        clickedImagesInformation?.sentAt ?? new Date()
                                    ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </p>
                            </div>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ImagePreviewComponent