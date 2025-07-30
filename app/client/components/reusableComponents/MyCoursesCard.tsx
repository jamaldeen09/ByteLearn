"use client"
import { motion } from "framer-motion"
import { MyCoursesCardProps } from "../../types/types"
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";
import axios from "@/app/client/utils/config/axios"
import { getCourses } from "@/app/redux/coursesSlices/courseSlice";

const MyCoursesCard = ({
    imgUrl,
    instructorImg,
    title,
    progress,
    instructorsName,
    courseId,
}: MyCoursesCardProps & { courseId: string }) => {

    const router = useRouter();
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const dispatch = useAppDispatch()
    useEffect(() => {
        axios.get("/api/courses", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")} ` } }).then((res) => {
            dispatch(getCourses(res.data.courses));
        }).catch((err) => {
            console.error(err);
        })
    }, [dispatch])

    const progressColor = clampedProgress >= 70
        ? "bg-green-500"
        : clampedProgress >= 40
            ? "bg-yellow-500"
            : "bg-red-500";

    const progressData = useAppSelector(state =>
        state.progress.find(p => p.course === courseId)
    );
    const course = useAppSelector(state =>
        state.coursesSlice.courses.find(c => c._id === courseId)
    );

    const getLastVisitedTopic = () => {
        if (!progressData?.lastVisitedSkill || !course) return "Start Learning";

        for (const topic of course.topics) {
            const skill = topic.skills.find(s => s._id === progressData.lastVisitedSkill);
            if (skill) return topic.title;
        }
        return "Continue Learning";
    };

    const lastTopic = getLastVisitedTopic();

    const handleContinueCourse = async () => {
        try {
            if (progressData?.lastVisitedSkill) {
                router.push(
                    `/client/dashboard?tab=my-courses&courseId=${courseId}&skillId=${progressData.lastVisitedSkill}`
                );
                return;
            }

            router.push(
                `/client/dashboard?tab=my-courses&courseId=${courseId}`
            );

        } catch (err) {
            console.error("Failed to navigate to continue learning:", err);
        }
    };

    return (
        <motion.div
            onClick={handleContinueCourse}
            className="w-full mt-6 sm:m-0 h-[40vh] sm:h-full md:max-w-[27rem] max-lg:max-w-[30rem] rounded-lg transition-all duration-300 flex flex-col hover:cursor-pointer">
            {/* Card content */}
            <div>
                {/* Top: Image + Gradient Overlay */}
                <div className="relative w-full h-90 md:h-72 group">
                    <Image
                        src={imgUrl}
                        alt={title}
                        className="w-full h-full object-cover rounded-lg"
                        width={0}
                        height={0}
                        unoptimized={true}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute bottom-0 left-0 w-full h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-b-lg flex justify-between px-4 items-center">
                        <h1 className="text-md max-lg:text-xl  text-white font-bold">{title}</h1>
                    </div>
                </div>

                {/* Bottom: Text or Details */}
                <div className="py-2 flex items-center flex-col gap-2 md:flex-col md:gap-2 md:mt-4 md:justify-start mt-4 sm:gap-0 sm:justify-between sm:flex-row
                max-lg:gap-0 max-lg:justify-between max-lg:flex-row max-lg:m-0">
                    <div className="flex items-center gap-2">
                        <Image
                            unoptimized={true}
                            src={instructorImg}
                            alt="Instructor"
                            width={30}
                            height={30}
                            className="rounded-full"
                        />
                        <p className="text-sm">{instructorsName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-400 iphone:text-[0.7rem] text-xs">Last Topic: {lastTopic}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-1 w-full">
                <div className="flex justify-between text-xs">
                    <span className="font-medium">{clampedProgress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-700",
                            progressColor
                        )}
                        style={{ width: `${clampedProgress}%` }}
                    />
                </div>
            </div>

        </motion.div>

    )
}

export default MyCoursesCard