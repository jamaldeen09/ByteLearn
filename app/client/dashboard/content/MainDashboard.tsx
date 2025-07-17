"use client"

import NewCourseCard from "@/app/client/components/reusableComponents/NewCourseCard"
import OngoingCourse from "@/app/client/components/reusableComponents/OngoingCourse"
import { courseSchema } from "@/app/client/types/types"
import { arrowDown } from "@/app/icons/Icons"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { motion, Variants } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import axios from "../../utils/config/axios"
import { setEnrolledCourses } from "@/app/redux/coursesSlices/enrolledCoursesSlice"
import { setProgress } from "@/app/redux/coursesSlices/progressSlice"
import Image from "next/image"
import { getCourses } from "@/app/redux/coursesSlices/courseSlice"

export const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            when: "beforeChildren"
        }
    }
}

export const item: Variants = {
    hidden: {
        y: -20,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
        }
    }
}

const MainDashboard = () => {
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(true)

    const enrolledCourses = useAppSelector(state => state.enrolledCourses.enrolledCourses)
    const progressData = useAppSelector(state => state.progress)
    const newestCourses = useAppSelector(state => state.coursesSlice.courses).slice(0, 3)

    const fetchDashboardData = useCallback(async () => {
        try {
            setIsLoading(true)

            const [enrolledRes, progressRes, coursesRes] = await Promise.all([
                axios.get("/api/enrolled-courses", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("bytelearn_token")}` },
                }),
                axios.get("/api/progress", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("bytelearn_token")}` },
                }),
                axios.get("/api/courses",  { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")} `} })
            ])

            dispatch(setEnrolledCourses(enrolledRes.data.courses))
            dispatch(setProgress(progressRes.data.progress))
            dispatch(getCourses(coursesRes.data.courses))
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err)
        } finally {
            setIsLoading(false)
        }
    }, [dispatch])

    useEffect(() => {
        fetchDashboardData()
    }, [fetchDashboardData])

    const calculateCourseProgress = useCallback((course: courseSchema): number => {
        if (!course?.topics || course.topics.length === 0) return 0

        const courseProgress = progressData.find(p => String(p.course) === course._id)
        if (!courseProgress) return 0

        const completedSet = new Set(courseProgress.completedSkills.map(id => String(id)))
        let totalSkills = 0
        let completedCount = 0

        course.topics.forEach(topic => {
            topic.skills.forEach(skill => {
                totalSkills++
                if (completedSet.has(String(skill._id))) {
                    completedCount++
                }
            })
        })

        return totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0
    }, [progressData])
    

    return (
        <div className="lg:col-span-14 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            <div className="min-h-[91vh] px-4 sm:px-6 flex flex-col space-y-10">

                {/* Ongoing Courses */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, type: "spring", damping: 14, stiffness: 100 }}
                    className="bg-white h-[52vh] rounded-2xl w-full border border-gray-400 px-6 py-4 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                    <p className="text-gray-400 flex items-center gap-1 font-bold">
                        Ongoing Courses <span>{arrowDown}</span>
                    </p>

                    <div className="flex flex-col space-y-4 overflow-y-auto h-full pr-2 py-10">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-24 bg-gray-200 rounded-xl animate-pulse w-full"
                                />
                            ))
                        ) : enrolledCourses.length === 0 ? (
                            <div className="centered-flex flex-col space-y-3">
                                <Image
                                    src="https://png.pngtree.com/png-clipart/20230814/original/pngtree-graduation-girl-with-degree-diploma-graduation-person-vector-picture-image_10637076.png"
                                    alt="No courses enrolled"
                                    className="object-contain"
                                    unoptimized={true}
                                    width={200}
                                    height={200}
                                />
                                <p className="text-gray-500 font-semibold">No enrolled courses yet</p>
                            </div>
                        ) : (
                            enrolledCourses.map(course => {
                                const progress = calculateCourseProgress(course)
                                const lastVisited = progressData.find(p => String(p.course) === course._id)?.lastVisitedSkill

                                const continueLearningLink = lastVisited
                                    ? `/client/dashboard?tab=my-courses&courseId=${course._id}&skillId=${lastVisited}`
                                    : `/client/dashboard?tab=my-courses&courseId=${course._id}`

                                const currentTopic = (() => {
                                    if (!course.topics) return "Start course"
                                    for (const topic of course.topics) {
                                        for (const skill of topic.skills) {
                                            if (skill._id === lastVisited) {
                                                return topic.title
                                            }
                                        }
                                    }
                                    return "Start course"
                                })()

                                return (
                                    <motion.div key={course._id} variants={item}>
                                        <OngoingCourse
                                            courseImgURL={course.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                                            courseName={course.title}
                                            currentTopic={currentTopic}
                                            progress={progress}
                                            countinueLearningLink={continueLearningLink}
                                            courseId={course._id}
                                        />
                                    </motion.div>
                                )
                            })
                        )}
                    </div>
                </motion.div>

                {/* New Courses Section */}
                <div className="w-full h-fit flex flex-col gap-6 mt-4">
                    <div className="w-full max-w-md mx-auto md:m-0">
                        <h1 className="font-bold text-xl">New courses</h1>
                    </div>

                    <div className="min-h-[60vh] gap-6 grid md:grid-cols-2 max-lg:grid-cols-3 md:gap-4 lg:gap-4 py-4 justify-items-center md:justify-items-start">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="visible"
                            className="contents"
                        >
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (

                                    <div key={i} className="w-full max-w-[27rem] rounded-lg overflow-hidden animate-pulse space-y-2">
                                        <div className="w-full h-64 bg-gray-200 rounded-lg" />
                                        <div className="flex items-center justify-between px-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                                <div className="w-24 h-4 bg-gray-200 rounded" />
                                            </div>
                                            <div className="w-6 h-4 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                newestCourses.map((course: courseSchema) => (
                                    <motion.div key={course._id} variants={item}>
                                        <NewCourseCard
                                            id={course._id}
                                            getId={() => course._id}
                                            instructorImg={course.creator.profilePicture}
                                            title={course.title}
                                            category={course.category}
                                            instructorName={course.creator.fullName}
                                            courseImg={course.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                                            likes={course.likes}
                                        />
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainDashboard
