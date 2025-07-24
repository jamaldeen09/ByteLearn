"use client"
import { useEffect, useState } from "react";
import CourseCardComponent from "@/app/client/components/reusableComponents/CoursesCard";
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks";
import axios from "../../utils/config/axios"
import { getCourses } from "@/app/redux/coursesSlices/courseSlice";
import { motion } from "framer-motion";
import { container, item } from "./MainDashboard"
import { courseSchema } from "../../types/types";
import { useRouter } from "next/navigation";

const Courses = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const courses = useAppSelector(state => state.coursesSlice.courses)
    const router = useRouter()

    const dispatch = useAppDispatch()
    useEffect(() => {
        setLoading(true)
        axios.get("/api/courses", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")} ` } }).then((res) => {
            dispatch(getCourses(res.data.courses));
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            setLoading(false);
        })
    }, [dispatch])


    return (
        <div className="lg:col-span-16 px-4 flex flex-col gap-4 h-[90vh] justify-items-center">


            {loading ? (
                <div className="grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 md:justify-items-center py-10">
                    {[...Array(6)].map((_, i) => (

                        <div key={i} className="mb-4 break-inside-avoid w-full  rounded-lg overflow-hidden animate-pulse space-y-2">
                            <div className="w-full h-90 md:h-72 bg-gray-200 rounded-lg" />
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                    <div className="w-24 h-4 bg-gray-200 rounded" />
                                </div>
                                <div className="w-6 h-4 bg-gray-200 rounded" />
                            </div>
                        </div>

                    ))}
                </div>
            ) : courses.length <= 0 ?
                <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
                    <div className="relative w-48 h-48 mb-6">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="w-full h-full text-gray-300"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 19.5A2.5 2.5 0 016.5 17H20M4 7l6.5 6.5M20 7l-6.5 6.5M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    className="w-8 h-8 text-gray-400"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-medium text-gray-700 mb-2">No courses available</h3>
                    <p className="text-gray-500 max-w-md mb-6">
                        It looks like there aren&apos;t any courses here yet. Be the first to create one!
                    </p>

                    <button onClick={() => router.push('/client/dashboard?tab=course-creation')} className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200
                    hover:cursor-pointer">
                        Create New Course
                    </button>
                </div>
                : <div className="grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 md:justify-items-center py-10">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="visible"
                        className="contents"
                    >
                        {courses.map((course: courseSchema, index: number) => (
                            <motion.div key={index} variants={item} className="mb-4 break-inside-avoid w-full ">
                                <CourseCardComponent id={course?._id} imageUrl={course?.imageUrl} creator={course?.creator} likes={course?.likes} title={course?.title} />
                            </motion.div>
                        ))}</motion.div>
                </div>}
        </div>
    )
}
export default Courses