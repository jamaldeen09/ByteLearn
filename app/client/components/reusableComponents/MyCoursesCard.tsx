"use client"
import { motion } from "framer-motion"
import { MyCoursesCardProps } from "../../types/types"
import { cn } from "@/lib/utils";

const MyCoursesCard = ({ imgUrl, instructorImg, title, desc, continueCourse, progress,instructorsName }: MyCoursesCardProps) => {

    // Ensure progress is between 0-100
    const clampedProgress = Math.min(100, Math.max(0, progress));

    // Determine color based on progress (red < 40%, yellow < 70%, green >= 70%)
    const progressColor = clampedProgress >= 70
        ? "bg-green-500"
        : clampedProgress >= 40
            ? "bg-yellow-500"
            : "bg-red-500";

    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3, type: "spring", damping: 5, stiffness: 100 }}
            className="rounded-t-xl sm:w-[80vw] md:w-[60vw] max-lg:w-full mb-6 hover:cursor-pointer"
        >
            {/* Image Area*/}
            <div
                style={{
                    backgroundImage: `url(${imgUrl})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover"
                }}
                className="h-56 rounded-t-xl">
            </div>
            {/* Body */}
            <div className="bg-white px-4 flex flex-col gap-3 py-4 rounded-b-xl">

                {/* category */}
                <div className="flex items-start">
                    <div className="bg-blue-300 h-5 rounded-full min-w-16 iphone:text-[0.5rem] sm:text-xs centered-flex px-2 py-3 text-blue-800">
                        <p>{"space and science"}</p>
                    </div>
                </div>

                {/* Title */}
                <div className="flex flex-col gap-2">
                    <h1 className="font-extrabold text-md sm:text-xl">{title || "What's Up . April 2020"}</h1>
                    <p className="text-gray-400 text-sm">Topic: {desc || "State management with react"}</p>
                </div>

                {/* Description */}
                <div className="">
                    <p className="text-gray-400 iphone:text-[0.5rem]  sm:text-xs">
                        {"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus recusandae vitae placeat blanditiis quaerat eligendi non nam fugit ducimus nostrum quia hic modi vel esse id numquam, veritatis consectetur. Libero. Lorem ipsum dolor sit amet consectetur adipisicing elit"}
                    </p>
                </div>

                {/* Progress bar with percentage */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs">

                        <span className="font-medium">{clampedProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-700",
                                progressColor
                            )}
                            style={{ width: `${clampedProgress}%` }}
                        />
                    </div>
                </div>

                {/* Instructor Info */}
                <div className="flex items-center space-x-3 ">
                    <img
                        src={instructorImg || "https://media.istockphoto.com/id/515264642/photo/happy-teacher-at-desk-talking-to-adult-education-students.jpg?s=612x612&w=0&k=20&c=cpcqqIE9WgVgirdpelsjl2GqwhPFMu5UajW2QG-MOrM="}
                        alt={`The avator of ${title}'s instructor`}
                        className="w-10 h-10 rounded-full"
                    />

                    <div className="flex items-center justify-between w-full">
                        {/* Name */}
                        <div className="centered-flex">
                            <h1 className="font-bold iphone:text-md sm:text-lg">
                                {instructorsName || "Eric Michell"}
                            </h1>
                        </div>

                        {/* continue */}
                        <div className="">
                            <p className="underline text-sm font-extrabold hover:cursor-pointer hover:brightness-90 transition-all duration-300">Continue</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default MyCoursesCard