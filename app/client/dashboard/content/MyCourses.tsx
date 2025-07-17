"use client"
import { motion } from "framer-motion"
import { container, item } from "./MainDashboard"
import MyCoursesCard from "@/app/client/components/reusableComponents/MyCoursesCard"
import { MyCoursesProp, MyCourseWithProgress } from "@/app/client/types/types"
import CourseContent from "../courseContent/CourseContent"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { useCallback, useEffect, useState } from "react"
import axios from "../../utils/config/axios"
import { setProgress } from "@/app/redux/coursesSlices/progressSlice"
import Image from 'next/image'
import { setEnrolledCourses } from "@/app/redux/coursesSlices/enrolledCoursesSlice"

const MyCourses = ({ courseId }: MyCoursesProp) => {
    const [isLoading, setIsLoading] = useState(true)
    const enrolledCourses = useAppSelector(state => state.enrolledCourses.enrolledCourses)


    const calculateCourseProgress = useCallback((course: MyCourseWithProgress): number => {
        if (!course?.topics || course.topics.length === 0) return 0;
    
        if (!course.progressData) return 0;
    
        const completedSet = new Set(course.progressData.completedSkills);
    
        let totalSkills = 0;
        let completedCount = 0;
    
        course.topics.forEach(topic => {
            topic.skills.forEach(skill => {
                totalSkills++;
                if (completedSet.has(String(skill._id))) {
                    completedCount++;
                }
            });
        });
    
        return totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;
    }, []);
    



    const dispatch = useAppDispatch()
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);

            const [enrolledCoursesRes, progressRes] = await Promise.all([
                axios.get("/api/enrolled-courses", {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }
                }),
                axios.get("/api/progress", {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }
                })
            ]);

            dispatch(setEnrolledCourses(enrolledCoursesRes.data.courses));
            dispatch(setProgress(progressRes.data.progress));
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchData()
    }, [fetchData])

    if (isLoading) {
        return (
            <div className="lg:col-span-16 overflow-y-auto h-full flex flex-col space-y-6">
               
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-4 justify-items-center">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="w-full max-w-[30rem] animate-pulse rounded-lg shadow-md p-4 space-y-4 bg-white">
                            {/* Image skeleton */}
                            <div className="w-full h-48 bg-gray-200 rounded-lg" />
    
                            {/* Title skeleton */}
                            <div className="h-4 w-3/4 bg-gray-200 rounded" />
    
                            {/* Instructor section */}
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                <div className="h-3 w-1/2 bg-gray-200 rounded" />
                            </div>
    
                            {/* Last topic */}
                            <div className="h-3 w-1/3 bg-gray-200 rounded" />
    
                            {/* Progress bar */}
                            <div className="space-y-1 mt-2">
                                <div className="h-3 w-12 bg-gray-200 rounded" />
                                <div className="w-full h-2 bg-gray-200 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (enrolledCourses.length === 0) {
        return (
            <div className="col-centered gap-3 h-screen col-span-14">
                <Image
                    src="https://cdn-icons-png.flaticon.com/512/9772/9772025.png"
                    alt="No courses available"
                    className="w-full max-w-sm"
                    width={400}
                    height={400}
                    unoptimized={true}
                />
                <h1 className="font-bold text-xl">No course history</h1>
            </div>
        )
    }

    return (
        courseId ? <CourseContent courseId={courseId} /> :
            <div className="lg:col-span-16 overflow-y-auto h-full flex flex-col space-y-6">
               
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-4 justify-items-center">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="visible"
                        className="contents"
                    >
                        {enrolledCourses.map((course) => (
                            <motion.div key={course._id} variants={item}>
                                <MyCoursesCard
                                    imgUrl={course.imageUrl || "https://i.pinimg.com/736x/9d/3b/e7/9d3be76d616a58069ccadd8d949cca72.jpg"}
                                    title={course.title}
                                    desc={course.description}
                                    progress={calculateCourseProgress(course)}
                                    courseId={course._id}
                                    instructorsName={course.creator.fullName}
                                    instructorImg={course.creator.profilePicture}
                                    category={course.category}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
    )
}

export default MyCourses