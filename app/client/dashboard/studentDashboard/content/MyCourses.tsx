"use client"
import { motion } from "framer-motion"
import { container, item } from "./MainDashboard"
import MyCoursesCard from "@/app/client/components/reusableComponents/MyCoursesCard"
import { courseSchema, MyCoursesProp } from "@/app/client/types/types"
import CourseContent from "../courseContent/CourseContent"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { useEffect } from "react"
import axios from "../../../utils/config/axios"
import { getCourses } from "@/app/redux/coursesSlices/courseSlice"
import { setProgress } from "@/app/redux/coursesSlices/progressSlice"

const MyCourses = ({ courseId }: MyCoursesProp) => {
    const courses = useAppSelector(state => state.coursesSlice.courses);
    const progressData = useAppSelector(state => state.progress);
    const completedSkills = useAppSelector(state => state.completedSkills.completedSkills);

    const calculateCourseProgress = (course: courseSchema): number => {
        if (!course?.topics) return 0;

        // Find progress data for this course
        const courseProgress = progressData.find(p => p.course === course.id);
        if (!courseProgress) return 0;

        const completedSet = new Set(courseProgress.completedSkills);
        let totalSkills = 0;
        let completedCount = 0;

        course.topics.forEach(topic => {
            topic.skills.forEach(skill => {
                totalSkills++;
                if (completedSet.has(skill._id)) {
                    completedCount++;
                }
            });
        });

        return totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;
    };

    const dispatch = useAppDispatch()
    useEffect(() => {
   
        axios.get("/api/courses").then((res) => {
            dispatch(getCourses(res.data.courses));
        }).catch((err) => {
            console.error(err);
        })


    }, [])
    const fetchProgressData = async () => {
        try {
          const response = await axios.get("/api/progress", {
            headers: { Authorization: `Bearer ${localStorage.getItem("bytelearn_token")}` },
          });
          dispatch(setProgress(response.data.progress));
        } catch (err) {
          console.error("Failed to fetch progress data:", err);
        }
      };
    
      useEffect(() => {
        fetchProgressData();
      }, []);

    if (courses.length === 0) {
        return (
            <div className="col-centered gap-3 h-screen col-span-14">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/9772/9772025.png"
                    alt="An image that illustrates or shows the users that no courses are available"
                    className="w-full max-w-sm"
                />
                <h1 className="font-bold text-xl">No course history</h1>
            </div>
        );
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
                        {courses.map((course) => (
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