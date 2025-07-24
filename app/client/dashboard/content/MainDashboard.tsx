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
import { getCourses } from "@/app/redux/coursesSlices/courseSlice"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

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
    const router = useRouter()
    const [mostLikedCourses, setMostLikedCourses] = useState<courseSchema[]>([])

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
                axios.get("/api/courses", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")} ` } })
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

    const fetchMostLikedCourses = useCallback(() => {
        axios.get("/api/most-popular-courses", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } })
            .then((res) => {
                setMostLikedCourses(res.data.mostLikedCourses)
            }).catch((err) => {
                console.error(err)
                if (err.response.statu === 401) {
                    router.push("/client/auth/login")
                    return;
                } else {
                    toast.error(err?.response?.data?.msg);
                    return;
                }
            })
    }, [router])
    
    useEffect(() => {
        fetchMostLikedCourses();
    }, [fetchMostLikedCourses])

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
        <div className="lg:col-span-14 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent py-10">
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
                            <div className="flex flex-col items-center justify-center h-full py-20 sm:py-12 px-4 sm:px-6 text-center">
                                {/* Animated Lightbulb Illustration - Responsive Sizing */}
                                <div className="relative mb-6 sm:mb-8 w-32 h-32 sm:w-44 sm:h-44">
                                    {/* Outer glow circle (pulse animation) */}
                                    <div className="absolute inset-0 rounded-full bg-gray-100 animate-pulse opacity-20 fit centered-flex"></div>

                                    {/* Lightbulb container */}
                                    <div className="relative flex items-center justify-center w-full h-full">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-16 w-16 sm:h-24 sm:w-24 text-gray-900"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.5}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                            />
                                        </svg>
                                    </div>

                                    {/* Subtle sparkle effect - Hidden on mobile */}
                                    <div className="absolute top-2 right-3 sm:top-4 sm:right-6">
                                        <svg
                                            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 animate-ping opacity-70"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path stroke="currentColor" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Text Content - Responsive Typography */}
                                <h3 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2 sm:mb-3 tracking-tight">
                                    Your Learning Journey Awaits
                                </h3>
                                <p className="text-gray-500 mb-6 sm:mb-8 max-w-xs sm:max-w-md text-xs sm:text-sm leading-relaxed">
                                    No active enrollments yet. Browse our catalog to find courses that match your interests and career goals.
                                </p>

                                {/* CTA Button - Responsive Sizing */}
                                <button
                                    onClick={() => router.push('/client/dashboard?tab=courses')}
                                    className="px-4 py-2 hover:cursor-pointer sm:mb-10 sm:px-6 sm:py-3 bg-gray-900 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 hover:shadow-md flex items-center"
                                >
                                    Discover Courses
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        )
                            : (
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
                    <div className="w-full">
                        <h1 className="font-bold text-xl">Most Liked Courses</h1>
                    </div>

                    <div className="min-h-[60vh] gap-6 grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-4 py-4">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="visible"
                            className="contents"
                        >
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (

                                    <div key={i} className="w-full md:max-w-[27rem] md:h-76 overflow-hidden rounded-lg transition-all duration-300 flex flex-col hover:cursor-pointer">
                                        <div className="w-full h-90 md:h-64 bg-gray-200 rounded-lg" />
                                        <div className="flex items-center justify-between px-2 mt-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                                <div className="w-24 h-4 bg-gray-200 rounded" />
                                            </div>
                                            <div className="w-6 h-4 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                mostLikedCourses.map((course: courseSchema, index: number) => (
                                    <motion.div key={index} variants={item}>
                                        <NewCourseCard
                                            id={course?._id}
                                            getId={() => course?._id}
                                            instructorImg={course?.creator?.profilePicture}
                                            title={course?.title}
                                            category={course?.category}
                                            instructorName={course?.creator?.fullName}
                                            courseImg={course?.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                                            likes={course?.likes}
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
