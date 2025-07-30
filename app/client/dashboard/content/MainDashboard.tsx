"use client"

import NewCourseCard from "@/app/client/components/reusableComponents/NewCourseCard"
import OngoingCourse from "@/app/client/components/reusableComponents/OngoingCourse"
import { courseSchema, EnrolledCourse } from "@/app/client/types/types"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { motion, Variants } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import axios from "../../utils/config/axios"
import { setEnrolledCourses } from "@/app/redux/coursesSlices/enrolledCoursesSlice"
import { setProgress } from "@/app/redux/coursesSlices/progressSlice"
import { getCourses } from "@/app/redux/coursesSlices/courseSlice"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { ArrowRight, BookOpen } from "lucide-react"

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
    const courses = useAppSelector(state => state.coursesSlice.courses)

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
                if (err.response.status === 401) {
                    router.push("/client/auth/login")
                    return
                } else {
                    toast.error(err?.response?.data?.msg)
                    return
                }
            })
    }, [router])

    useEffect(() => {
        fetchMostLikedCourses()
    }, [fetchMostLikedCourses])

    const calculateCourseProgress = useCallback((course: EnrolledCourse): number => {
        if (!course.progressData) return 0

        const courseToUse = course.progressData.snapshottedCourse || course
        const completedSet = new Set(course.progressData.completedSkills)

        let totalSkills = 0
        let completedCount = 0

        courseToUse.topics.forEach(topic => {
            topic.skills.forEach(skill => {
                totalSkills++
                if (completedSet.has(skill._id)) {
                    completedCount++
                }
            })
        })

        return totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0
    }, [])


    return (
        <div className="lg:col-span-14 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent py-10">
            <div className="min-h-[91vh] px-4 sm:px-6 flex flex-col space-y-10">

                {/* Ongoing Courses Section */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, type: "spring", damping: 14, stiffness: 100 }}
                    className="bg-white rounded-2xl w-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                            Ongoing Courses
                        </h2>
                    </div>

                    <div className="p-6">
                        {isLoading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse w-full" />
                                ))}
                            </div>
                        ) : enrolledCourses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                                    <BookOpen className="w-10 h-10 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-800 mb-2">No Active Courses</h3>
                                <p className="text-gray-500 mb-6 max-w-md">
                                    You haven&apos;t enrolled in any courses yet. Explore our catalog to start learning.
                                </p>
                                <button
                                    onClick={() => router.push('/client/dashboard?tab=courses')}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2
                                    hover:cursor-pointer"
                                >
                                    Browse Courses
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                {enrolledCourses.map(course => {
                                    const progress = calculateCourseProgress(course)
                                    const lastVisited = progressData.find(p => String(p.course) === course._id)?.lastVisitedSkill
                                    const foundCourse = courses.find(c => c._id === course._id)

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
                                                courseImgURL={course.imageUrl}
                                                courseName={course.title}
                                                currentTopic={currentTopic}
                                                progress={progress}
                                                countinueLearningLink={continueLearningLink}
                                                courseId={course._id}
                                                isPublished={foundCourse?.isPublished}
                                                likedByCurrentUser={foundCourse?.likedByCurrentUser}
                                            />
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
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

