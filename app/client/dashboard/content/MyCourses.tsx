"use client"
import { motion } from "framer-motion"
import { container, item } from "./MainDashboard"
import MyCoursesCard from "@/app/client/components/reusableComponents/MyCoursesCard"
import { EnrolledCourse, MyCoursesProp } from "@/app/client/types/types"
import CourseContent from "../courseContent/CourseContent"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { useCallback, useEffect, useState } from "react"
import axios from "../../utils/config/axios"
import { setProgress } from "@/app/redux/coursesSlices/progressSlice"
import { setEnrolledCourses } from "@/app/redux/coursesSlices/enrolledCoursesSlice"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"


const MyCourses = ({ courseId }: MyCoursesProp) => {
    const [isLoading, setIsLoading] = useState(true)
    const enrolledCourses = useAppSelector(state => state.enrolledCourses.enrolledCourses) as EnrolledCourse[]
    const router = useRouter()
    const [category, setCategory] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [noResults, setNoResults] = useState<boolean>(false);
    const [searchedCourses, setSearchedCourses] = useState<EnrolledCourse[]>([]);
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    const calculateCourseProgress = useCallback((course: EnrolledCourse): number => {
        if (!course?.topics || course.topics.length === 0) return 0;
        if (!course.progressData) return 0;

        const courseToUse = course.progressData.snapshottedCourse || course;
        const completedSet = new Set(course.progressData.completedSkills);

        let totalSkills = 0;
        let completedCount = 0;

        courseToUse.topics.forEach(topic => {
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


    const uniqueCategories = Array.from(
        new Set(
            enrolledCourses
                .map((enrolledCourse) => enrolledCourse?.category)
                .filter((category): category is string => Boolean(category))
        )
    );

    const foundCourses = enrolledCourses.filter((course) => course.category === category);

    const handleSearch = () => {
        if (searchTerm.trim() === "") {
            setHasSearched(false);
            setNoResults(false);
            return;
        }

        const results = enrolledCourses.filter((course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchedCourses(results);
        setHasSearched(true);
        setNoResults(results.length === 0);
    };

    const displayCourses = hasSearched
        ? searchedCourses
        : category && category !== "All"
            ? foundCourses
            : enrolledCourses;

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
        </div> : courseId ? <CourseContent courseId={courseId} /> : enrolledCourses.length <= 0 ?
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
                    You haven&apos;t enrolled in any courses yet. Discover our collection and start expanding your skills today.
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
            </div> :
            <>
                <div className="col-span-16 px-4 py-6 flex flex-col gap-4">
                    <div className="relative w-full max-w-2xl">
                        <input
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setSearchTerm(e.target.value);
                                if (e.target.value === "") {
                                    setHasSearched(false);
                                    setNoResults(false);
                                }
                            }}
                            type="text"
                            placeholder="Search for a course"
                            className="bg-gray-100 rounded-full h-14 px-6 pr-16 w-full focus:ring-0 focus:outline-0 text-sm hover:bg-white border border-transparent hover:border hover:border-gray-300 duration-300 transition-all truncate"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <motion.button
                            whileHover={{ scale: 1.1, filter: "brightness(300%)" }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-full hover:cursor-pointer text-white centered-flex w-9 h-9 bg-black absolute top-[0.6rem] right-4"
                            onClick={handleSearch}
                        >
                            <MagnifyingGlassIcon className="w-4 h-4" />
                        </motion.button>
                    </div>

                    <div className="flex items-center space-x-4 px-2">
                        <p className="text-xs">Filter by category: </p>
                        <Select
                            value={category}
                            onValueChange={(value) => {
                                setCategory(value);
                                setHasSearched(false);
                                setNoResults(false);
                            }}
                        >
                            <SelectTrigger className="truncate max-w-[200px] text-xs">
                                <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent className="iphone:w-[90vw] sm:w-fit text-xs">
                                <SelectItem value="All">
                                    <p className="text-xs">All</p>
                                </SelectItem>
                                {uniqueCategories.map((category: string, index: number) => (
                                    <SelectItem
                                        key={index}
                                        value={category}
                                        className="text-xs"
                                    >
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {noResults ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center col-span-16">
                        <div className="relative w-48 h-48 mb-6">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="w-full h-full text-gray-300"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <MagnifyingGlassIcon className="w-16 h-16 text-gray-400" />
                            </div>
                        </div>

                        <h3 className="text-xl font-medium text-gray-700 mb-2">No courses found</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            We couldn&apos;t find any courses matching &ldquo;{searchTerm}&rdquo;. Try different keywords or browse all courses.
                        </p>

                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setNoResults(false);
                                setHasSearched(false);
                            }}
                            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 hover:cursor-pointer"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : 

                    <div className="grid col-span-16 md:grid-cols-2 lg:grid-cols-3 gap-60 sm:gap-4 px-4 sm:py-12">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="visible"
                            className="contents"
                        >
                            {displayCourses.map((course) => (
                                <motion.div key={course._id} variants={item}>
                                    <MyCoursesCard
                                        imgUrl={course.imageUrl || "https://i.pinimg.com/736x/9d/3b/e7/9d3be76d616a58069ccadd8d949cca72.jpg"}
                                        title={course.title}
                                        progress={calculateCourseProgress(course)}
                                        
                                        courseId={course._id}
                                        instructorsName={course.creator.fullName}
                                        instructorImg={course.creator.profilePicture}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                }
            </>
    )
}

export default MyCourses