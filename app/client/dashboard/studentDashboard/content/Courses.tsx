"use client"
import { useEffect, useState } from "react";
import CourseCardComponent from "@/app/client/components/reusableComponents/CoursesCard";
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks";
import axios from "../../../utils/config/axios"
import { getCourses } from "@/app/redux/coursesSlices/courseSlice";
import BlackSpinner from "@/app/client/components/reusableComponents/BlackSpinner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { container, item } from "./MainDashboard"
import Image from 'next/image';

const Courses = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const courses = useAppSelector(state => state.coursesSlice.courses)
    const router = useRouter();
    const usersCourses = useAppSelector(state => state.usersInformation.courses)

    const enrolledCourses = new Set(usersCourses)

    const dispatch = useAppDispatch()
    useEffect(() => {
        setLoading(true)
        axios.get("/api/courses").then((res) => {
            dispatch(getCourses(res.data.courses));
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            setLoading(false);
        })
    }, [dispatch])

    const [enrollLoading, setEnrollLoading] = useState<boolean>(false);

    const enroll = (id: string) => {
        setEnrollLoading(true);
        axios.post("/api/enroll", { courseId: id }, { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } }).then((res) => {
            setEnrollLoading(false);
            router.push(`/client/dashboard/studentDashboard?tab=my-courses&courseId=${id}`);
            toast.success(res.data.msg);
            return;
        }).catch((err) => {
            console.error(err)
            setEnrollLoading(false);
            if (err.response.status == 401 || err.response.status === 403 || err.response.status === 404) {
                router.push("/client/auth/login")
                return;
            } else if (err.response.status === 404) {
                toast.error("Course you are trying to enroll in does not exist");
                return;
            } else if (err.response.status === 409) {
                toast.error(err.response.data.msg)
                return;
            } else {
                console.error(err);
                toast.error("A server error occured. Please bare with us");
                return;
            }
        })
    }
    
    return (
        <div className="lg:col-span-16 px-4 flex flex-col gap-4 h-[90vh]">
            <div className="w-fit md:mx-auto max-lg:m-0">
                <h1 className="font-bold text-xl">Courses</h1>
            </div>

            {loading ? (
                <div className="h-[90vh] centered-flex">
                    <BlackSpinner />
                </div>
            ) : courses.length <= 0 ?
                <div className="h-full centered-flex">
                    <Image
                        src="https://cdn-icons-png.flaticon.com/512/9772/9772025.png"
                        alt="An image that illustrates or shows the users that no courses are available"
                        className="w-full"
                        width={200}
                        height={200}
                        unoptimized={true}
                    />
                </div>
                : <div className="columns-1 sm:columns-1 w-full max-lg:w-full max-lg:columns-2 lg:columns-3 gap-4 ">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="visible"
                        className="contents"
                    >
                    {courses.map(course => (
                        <motion.div key={course.id} variants={item} className="mb-4 break-inside-avoid w-full sm:mx-auto max-lg:mx-0 sm:max-w-lg md:max-w-xl max-lg:max-w-lg">
                            <CourseCardComponent {...course} enroll={() => enroll(course.id)} isEnrolling={enrollLoading} 
                            isEnrolled={enrolledCourses.has(course.id)}/>
                        </motion.div>
                    ))}</motion.div>
                </div>}
        </div>
    )
}
export default Courses