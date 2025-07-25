"use client"
import { useEffect, useState } from "react";
import CourseCardComponent from "@/app/client/components/reusableComponents/CoursesCard";
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks";
import axios from "../../utils/config/axios"
import { getCourses } from "@/app/redux/coursesSlices/courseSlice";
import { motion } from "framer-motion";
import { container, item } from "./MainDashboard"
import { courseSchema } from "../../types/types";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Courses = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const courses = useAppSelector(state => state.coursesSlice.courses)
    const router = useRouter()
    const [category, setCategory] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [noResults, setNoResults] = useState<boolean>(false);
    const [searchedCourses, setSearchedCourses] = useState<courseSchema[]>([]);
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    const dispatch = useAppDispatch()
    useEffect(() => {
        setLoading(true)
        axios.get("/api/courses", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } }).then((res) => {
            dispatch(getCourses(res.data.courses));
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            setLoading(false);
        })
    }, [dispatch])

    const uniqueCategories = Array.from(
        new Set(
            courses
                .map((course: courseSchema) => course?.category)
                .filter((category): category is string => Boolean(category))
        )
    );

    const foundCourses: courseSchema[] = courses.filter((course) => course.category === category)

    const handleSearch = () => {
        if (searchTerm.trim() === "") {
            setHasSearched(false);
            setNoResults(false);
            return;
        }

        const results = courses.filter((course) => 
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
    : courses;

    return (
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
            <div className="col-span-16 px-4 flex flex-col gap-4 h-[90vh] justify-items-center">

                {loading ? (
                    <div className="grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 md:justify-items-center py-10">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="mb-4 break-inside-avoid w-full rounded-lg overflow-hidden animate-pulse space-y-2">
                                <div className="w-full h-90 md:h-72 bg-gray-200 rounded-lg" />
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
                ) : courses.length <= 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
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
                                    d="M4 19.5A2.5 2.5 0 016.5 17H20M4 7l6.5 6.5M20 7l-6.5 6.5M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        className="w-8 h-8 text-gray-400"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-medium text-gray-700 mb-2">No courses available</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            It looks like there aren&apos;t any courses here yet. Be the first to create one!
                        </p>

                        <button onClick={() => router.push('/client/dashboard?tab=course-creation')} className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 hover:cursor-pointer">
                            Create New Course
                        </button>
                    </div>
                ) : noResults ? (
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
                ) : (
                    <div className="grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 md:justify-items-center py-10 w-full">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="visible"
                            className="contents"
                        >
                            {displayCourses.map((course: courseSchema, index: number) => (
                                <motion.div key={index} variants={item} className="mb-4 break-inside-avoid w-full">
                                    <CourseCardComponent 
                                        id={course?._id} 
                                        imageUrl={course?.imageUrl} 
                                        creator={course?.creator} 
                                        likes={course?.likes} 
                                        title={course?.title} 
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                )}
            </div>
        </>
    )
}
export default Courses