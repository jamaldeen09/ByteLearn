"use client"
import { motion } from "framer-motion"
import { container, item } from "./MainDashboard"
import MyCoursesCard from "@/app/client/components/reusableComponents/MyCoursesCard"


const MyCourses = () => {
    return (
        <div
            className="lg:col-span-16 overflow-y-auto  h-full
     flex flex-col space-y-6"
        >
            <div className="px-4">
                <h1 className="font-extrabold text-xl md:mx-auto max-lg:m-0">My Courses</h1>
            </div>
            <div className="grid max-lg:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-4 justify-items-center">

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    className="contents"
                >
                    {Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).map((i) => {
                        return <motion.div key={i} variants={item}>
                            <MyCoursesCard
                                imgUrl="https://i.pinimg.com/736x/9d/3b/e7/9d3be76d616a58069ccadd8d949cca72.jpg"
                                key={i}
                                progress={20}
                            />
                        </motion.div>
                    })}
                </motion.div>
            </div>
        </div>
    )
}

export default MyCourses