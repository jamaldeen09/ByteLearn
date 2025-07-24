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
import { setEnrolledCourses } from "@/app/redux/coursesSlices/enrolledCoursesSlice"
import { useRouter } from "next/navigation"

const MyCourses = ({ courseId }: MyCoursesProp) => {
    const [isLoading, setIsLoading] = useState(true)
    const enrolledCourses = useAppSelector(state => state.enrolledCourses.enrolledCourses)
    const router = useRouter()


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

   

    if (enrolledCourses.length === 0) {
        return (


            <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 text-center col-span-14">
                <div className="relative w-56 h-56 mb-8 md:w-64 md:h-64">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl -rotate-3"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-gray-100 to-gray-200 rounded-2xl rotate-3"></div>
                    <div className="relative flex items-center justify-center w-full h-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-20 w-20 text-gray-900 md:h-24 md:w-24"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 md:text-3xl">Your learning journey starts here</h3>
                <p className="text-gray-600 mb-8 max-w-md text-sm md:text-base">
                    You haven't enrolled in any courses yet. Discover our collection and start expanding your skills today.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0">
                    <button
                        onClick={() => router.push('/client/dashboard?tab=courses')}
                        className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 
                        hover:cursor-pointer"
                    >
                        Browse Courses
                    </button>
                </div>
            </div>
                
              
        )
      }

return (
    isLoading ? <div className="lg:col-span-16 overflow-y-auto h-full flex flex-col space-y-6">

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-6 justify-items-center">
        {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-full h-90 md:max-w-[30rem] animate-pulse rounded-lg shadow-md px-4 py-1 space-y-4 bg-white">
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
</div> : courseId ? <CourseContent courseId={courseId} /> :
        <div className="lg:col-span-16 overflow-y-auto h-full flex flex-col space-y-6">

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-12 ">
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