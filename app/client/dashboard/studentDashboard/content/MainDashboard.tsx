"use client"
import NewCourseCard from "@/app/client/components/reusableComponents/NewCourseCard"
import OngoingCourse from "@/app/client/components/reusableComponents/OngoingCourse"
import { courseSchema } from "@/app/client/types/types";
import { arrowDown } from "@/app/icons/Icons"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks";
import { motion, Variants } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import axios from "../../../utils/config/axios"
import { setEnrolledCourses } from "@/app/redux/coursesSlices/enrolledCoursesSlice";
import { setProgress } from "@/app/redux/coursesSlices/progressSlice";
import Image from "next/image";
import { getCourses } from "@/app/redux/coursesSlices/courseSlice";


export const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            when: "beforeChildren"
        }
    }
};

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
};



const MainDashboard = () => {
    const enrolledCourses = useAppSelector(state => state.enrolledCourses.enrolledCourses)
    const progressData = useAppSelector(state => state.progress)
    const [isLoading, setIsLoading] = useState(true)
    const dispatch = useAppDispatch()
    const newestCourses = useAppSelector(state => state.coursesSlice.courses).slice(0, 3);

    const fetchDashboardData = useCallback(async () => {
        try {
            setIsLoading(true);

            const [enrolledCoursesRes, progressRes] = await Promise.all([
                axios.get("/api/enrolled-courses", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("bytelearn_token")}` },
                }),
                axios.get("/api/progress", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("bytelearn_token")}` },
                }),
            ]);

            dispatch(setEnrolledCourses(enrolledCoursesRes.data.courses));
            dispatch(setProgress(progressRes.data.progress));
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const calculateCourseProgress = useCallback((course: courseSchema): number => {
        if (!course?.topics) return 0
        const courseProgress = progressData.find(p => String(p.course) === course.id)
        if (!courseProgress) return 0

        const completedSet = new Set(courseProgress.completedSkills)
        let totalSkills = 0
        let completedCount = 0

        course.topics.forEach(topic => {
            topic.skills.forEach(skill => {
                totalSkills++
                if (completedSet.has(skill._id)) {
                    completedCount++
                }
            })
        })

        return totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0
    }, [progressData])

    useEffect(() => {
        if (enrolledCourses.length > 0 || progressData.length > 0) {
            setIsLoading(false);
        }
    }, [enrolledCourses, progressData]);

    useEffect(() => {
        setIsLoading(true); 
    
        axios.get("/api/courses").then((res) => {
            dispatch(getCourses(res.data.courses));
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [dispatch]);

    return (
        <>

            {/* Main Content */}

            <div className="lg:col-span-14 overflow-y-auto ">
                <div className="min-h-[91vh] px-4 sm:px-6 flex flex-col space-y-4">
                    {/* Page Title */}
                    <div className="w-full max-w-2xl mx-auto md:m-0">
                        <h1 className="text-xl font-extrabold">My Dashboard</h1>
                    </div>
                    {/* My courses area */}
                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, type: "spring", damping: 14, stiffness: 100 }}
                        className="bg-white h-[52vh] rounded-2xl w-full mt-4 border border-gray-400 px-6 py-4 overflow-hidden
                hover:shadow-lg transition-shadow duration-300">
                        <div className="">
                            <p className="text-gray-400 flex items-center gap-1 font-bold ">Ongoing Courses <span>{arrowDown}</span></p>
                        </div>

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
                                        className=" object-contain"
                                        unoptimized={true}
                                        width={200}
                                        height={200}
                                    />
                                    <p className="text-gray-500 font-semibold">No enrolled courses yet</p>
                                </div>
                            ) : (
                                enrolledCourses.map(course => {
                                    const progress = calculateCourseProgress(course);
                                    const lastVisited = progressData.find(p => String(p.course) === course.id)?.lastVisitedSkill;

                                    const continueLearningLink = lastVisited
                                        ? `/client/dashboard/studentDashboard?tab=my-courses&courseId=${course.id}&skillId=${lastVisited}`
                                        : `/client/dashboard/studentDashboard?tab=my-courses&courseId=${course.id}`;

                                    const currentTopic = (() => {
                                        for (const topic of course.topics) {
                                            for (const skill of topic.skills) {
                                                if (skill._id === lastVisited) {
                                                    return topic.title;
                                                }
                                            }
                                        }
                                        return "Start course";
                                    })();

                                    return (
                                        <OngoingCourse
                                            key={course.id}
                                            courseImgURL={course.imageUrl}
                                            courseName={course.title}
                                            currentTopic={currentTopic}
                                            progress={progress}
                                            countinueLearningLink={continueLearningLink}
                                            courseId={course.id}
                                        />
                                    );
                                })
                            )}
                        </div>


                    </motion.div>

                    {/* New Courses Area */}
                    <div className="w-full h-fit flex flex-col gap-6 mt-4">

                        {/* New Courses Area Title*/}
                        <div className="w-full max-w-md mx-auto md:m-0">
                            <h1 className="font-bold text-xl">New courses</h1>
                        </div>

                        {/* New Courses */}
                        <div className="min-h-[60vh] grid md:grid-cols-2 max-lg:grid-cols-3 md:gap-4 lg:gap-4 py-4 justify-items-center md:justify-items-start">
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="visible"
                                className="contents "
                            >
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            variants={item}
                                            className="w-full max-w-[27rem] h-[22rem] bg-gray-200 rounded-lg animate-pulse"
                                        />
                                    ))
                                ) : (
                                    newestCourses.map((course: courseSchema) => (
                                        <motion.div key={course.id} variants={item}>
                                            <NewCourseCard
                                                id={course.id}
                                                getId={() => course.id}
                                                instructorImg={course.creator.profilePicture}
                                                title={course.title}
                                                category={course.category}
                                                instructorName={course.creator.fullName}
                                                courseImg={course.imageUrl}
                                                likes={course.likes ? course.likes : 0}
                                            />
                                        </motion.div>
                                    ))
                                )}


                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainDashboard