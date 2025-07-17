"use client"
import { useEffect, useState } from "react";
import CourseCardComponent from "@/app/client/components/reusableComponents/CoursesCard";
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks";
import axios from "../../utils/config/axios"
import { getCourses } from "@/app/redux/coursesSlices/courseSlice";
import BlackSpinner from "@/app/client/components/reusableComponents/BlackSpinner";
import { motion } from "framer-motion";
import { container, item } from "./MainDashboard"
import Image from 'next/image';

const Courses = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const courses = useAppSelector(state => state.coursesSlice.courses)

    const dispatch = useAppDispatch()
    useEffect(() => {
        setLoading(true)
        axios.get("/api/courses", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")} `} }).then((res) => {
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (

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

                    ))}
                </div>
            ) : courses.length <= 0 ?
                <div className="h-full centered-flex">
                    <Image
                        src="https://cdn-icons-png.flaticon.com/512/9772/9772025.png"
                        alt="An image that illustrates or shows the users that no courses are available"
                        className=""
                        width={200}
                        height={200}
                        unoptimized={true}
                    />
                </div>
                : <div className="grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 md:justify-items-center">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="visible"
                        className="contents"
                    >
                        {courses.map(course => (
                            <motion.div key={course._id} variants={item} className="mb-4 break-inside-avoid w-full sm:mx-auto max-lg:mx-0 sm:max-w-lg md:max-w-xl max-lg:max-w-lg">
                                <CourseCardComponent id={course._id} imageUrl={course.imageUrl} creator={course.creator} likes={course.likes} title={course.title} />
                            </motion.div>
                        ))}</motion.div>
                </div>}
        </div>
    )
}
export default Courses