"use client"
import { motion } from "framer-motion"
import { container, item } from "./MainDashboard"
import MyCoursesCard from "@/app/client/components/reusableComponents/MyCoursesCard"
import { courseSchema, MyCoursesProp } from "@/app/client/types/types"
import CourseContent from "../courseContent/CourseContent"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { useCallback, useEffect, useState } from "react"
import axios from "../../../utils/config/axios"
import { setProgress } from "@/app/redux/coursesSlices/progressSlice"
import Image from 'next/image'
import BlackSpinner from "@/app/client/components/reusableComponents/BlackSpinner"
import { setEnrolledCourses } from "@/app/redux/coursesSlices/enrolledCoursesSlice"

const MyCourses = ({ courseId }: MyCoursesProp) => {
    const [isLoading, setIsLoading] = useState(true)
    const progressData = useAppSelector(state => state.progress)
    const enrolledCourses = useAppSelector(state => state.enrolledCourses.enrolledCourses)


    const calculateCourseProgress = useCallback((course: courseSchema): number => {
        if (!course?.topics || course.topics.length === 0) return 0;

        // Find progress data for this course
        const courseProgress = progressData.find(p => String(p.course) === course.id);
        if (!courseProgress) return 0;

        const completedSet = new Set(courseProgress.completedSkills.map(id => String(id)));

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
    }, [progressData]);



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
            <div className="col-span-14 centered-flex h-screen">
                <BlackSpinner />
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
                <div className="px-4 w-fit m-0 sm:mx-auto max-lg:m-0">
                    <h1 className="font-extrabold text-xl">My Courses</h1>
                </div>
                <div className="grid max-lg:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-4 justify-items-center">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="visible"
                        className="contents"
                    >
                        {enrolledCourses.map((course) => (
                            <motion.div key={course.id} variants={item}>
                                <MyCoursesCard
                                    imgUrl={course.imageUrl || "https://i.pinimg.com/736x/9d/3b/e7/9d3be76d616a58069ccadd8d949cca72.jpg"}
                                    title={course.title}
                                    desc={course.description}
                                    progress={calculateCourseProgress(course)}
                                    courseId={course.id}
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