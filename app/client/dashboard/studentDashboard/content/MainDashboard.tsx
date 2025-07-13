"use client"
import NewCourseCard from "@/app/client/components/reusableComponents/NewCourseCard"
import OngoingCourse from "@/app/client/components/reusableComponents/OngoingCourse"
import { arrowDown } from "@/app/icons/Icons"
import { motion, Variants } from "framer-motion";


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

    
    return (
        <>

            {/* Main Content */}

            <div className="lg:col-span-14 overflow-y-auto ">
                <div className="min-h-[91vh] px-6 flex flex-col space-y-4">
                    {/* Page Title */}
                    <div className="mx-auto max-lg:m-0">
                        <h1 className="text-xl font-extrabold">My Dashboard</h1>
                    </div>
                    {/* My courses area */}
                    <motion.div
                        initial={{ y: -200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, type: "spring", damping: 10, stiffness: 100 }}
                        className="bg-white h-[52vh] rounded-2xl w-full mt-4 border border-gray-400 px-6 py-4 overflow-hidden
                hover:shadow-lg transition-shadow duration-300">
                        <div className="">
                            <p className="text-gray-400 flex items-center gap-1 font-bold ">Ongoing Courses <span>{arrowDown}</span></p>
                        </div>

                        {/* ongoing courses display */}
                        <div className="w-full overflow-y-auto h-full py-6">
                            <div className="flex flex-col space-y-4">
                                {Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((i) => {
                                    return <OngoingCourse
                                        key={i}
                                        courseName="Advanced React Patterns"
                                        currentTopic="State Management with Zustand"
                                        progress={20}
                                    />
                                }))}
                            </div>
                        </div>
                    </motion.div>

                    {/* New Courses Area */}
                    <div className="w-full h-fit flex flex-col gap-6 mt-4">

                        {/* New Courses Area Title*/}
                        <div className="mx-auto max-lg:m-0">
                            <h1 className="font-bold text-xl">New courses</h1>
                        </div>

                        {/* New Courses */}
                        <div className="min-h-[60vh] grid max-lg:grid-cols-2 lg:grid-cols-3 gap-4 py-4 justify-items-center">
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="visible"
                                className="contents "
                            >
                                {Array.from([1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13]).map((i) => (
                                    <motion.div key={i} variants={item}>
                                        <NewCourseCard
                                            courseImg="https://media.istockphoto.com/id/1587601513/photo/international-day-of-human-space-flight-cosmonautics-day-concept.jpg?s=612x612&w=0&k=20&c=86fTkpYtoD73xp5OT3Jm9gR3Wu0c5ej0B9_hZ4dZBqo="
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default MainDashboard