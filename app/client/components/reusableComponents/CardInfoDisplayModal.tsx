import { useAppSelector } from "@/app/redux/essentials/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { courseSchema, topicSchema } from "../../types/types";

type cardInfoDisplayProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    courseId: string,
};

const CardInfoDisplayModal = ({ open, setOpen, courseId }: cardInfoDisplayProps) => {
   
    const courses = useAppSelector(state => state.coursesSlice.courses)
    const foundCourse: courseSchema | undefined = courses.find((course: courseSchema) => course.id === courseId)

    return (
        <>
          <AnimatePresence>
        {open && (
            <motion.div
                className="fixed inset-0 z-50 flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Top bar that closes the modal */}
                <div
                    onClick={() => setOpen(false)}
                    className="h-16 w-full bg-black bg-opacity-40 flex items-center justify-end px-4 hover:cursor-pointer"
                >
                    <XIcon className="text-white w-6 h-6 hover:text-gray-300 transition-colors" />
                </div>

                {/* Modal content area */}
                <motion.div
                    onClick={(e) => e.stopPropagation()} // Prevent accidental close
                    initial={{ y: 140 }}
                    animate={{ y: 0 }}
                    exit={{ y: 140 }}
                    transition={{ duration: 0.2, type: "spring" }}
                    className="flex-1 bg-white rounded-t-2xl overflow-y-auto flex justify-center"
                >
                    <div className="w-full max-w-5xl min-h-fit overflow-y-auto">
                        <div className="w-full max-w-5xl h-fit py-10 flex flex-col gap-6">
                            {/* Header */}
                            <div className="w-full">
                                <h1 className="text-3xl font-extrabold">{foundCourse?.title || "React Typescript"}</h1>
                            </div>

                            {/* Instructor information */}
                            <div className="w-full flex items-center justify-between h-fit">
                                <div className="flex items-center space-x-6">
                                    <Image
                                        src={
                                            foundCourse?.creator.profilePicture ||
                                            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww"
                                        }
                                        alt={`${foundCourse?.creator.fullName}'s avatar`}
                                        width={0}
                                        height={0}
                                        className="rounded-full h-14 w-14 object-cover"
                                        unoptimized={true}
                                    />
                                    <p className="">{foundCourse?.creator.fullName|| "Olatunji Labubu"}</p>
                                </div>

                                <div className="w-fit flex space-x-4 items-center">
                                    <button className="bg-white rounded-full p-3 border border-gray-300">
                                        <Heart className="w-4 h-4" />
                                    </button>
                                    <button className="bg-black text-white font-extrabold px-8 py-3 hover:cursor-pointer rounded-full hover:bg-black/90">
                                        Enroll
                                    </button>
                                </div>
                            </div>

                            <div className="w-full flex items-center space-x-10">
                                <p className="text-gray-400 text-xs">Skills: {foundCourse?.topics.map((topic) => topic.skills.length)}</p>
                                <p className="text-gray-400 text-xs">Category: {foundCourse?.category}</p>
                            </div>

                           <div className="">
                           <div
                                style={{
                                    backgroundImage: `url(${foundCourse?.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/TC-TLE_LLBG_08-08-2014b.jpg/250px-TC-TLE_LLBG_08-08-2014b.jpg"})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}
                                className="w-full h-[70vh] rounded-2xl"
                            ></div>
                           </div>

                            <div className="w-full flex flex-col gap-4 mt-2">
                                <div className="w-full">Topics</div>
                                {foundCourse?.topics.map((topic: topicSchema) => {
                                    return (
                                        <li key={topic._id} className="list-decimal">
                                            {topic.title}
                                        </li>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
        </>
    )
};

export default CardInfoDisplayModal;
