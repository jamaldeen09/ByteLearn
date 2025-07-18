"use client"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "@/app/client/utils/config/axios"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { courseSchema } from "../../types/types";
import GeneratedCoursePreview from "./GeneratedCoursePreview";
import BlackOrbitalLoader from "../../components/reusableComponents/OrbitalLoader";
const CourseCreation = (): React.ReactElement => {

    // local states
    const [disabledBtn, setDisabledBtn] = useState<boolean>(true);
    const [courseName, setCourseName] = useState<string>("")
    const [briefDescription, setBriefDescription] = useState<string>("")
    const [courseCategory, setCourseCategory] = useState<string>("")
    const router = useRouter()

    const [usersCreatedCourse, setUsersCreatedCourses] = useState<courseSchema[]>([])
    const [generatedCoursePreview, setGeneratedCoursePreview] = useState<courseSchema | null>(null)


    const [courseGenerationLoader, setCourseGenerationLoader] = useState<boolean>(false);

    // Validation constants
    const COURSE_NAME_MIN = 5;
    const COURSE_NAME_MAX = 60;
    const DESC_MIN = 20;
    const DESC_MAX = 300;
    const CATEGORY_MIN = 3;
    const CATEGORY_MAX = 30;
    useEffect(() => {
        if ((courseName.length < COURSE_NAME_MIN || courseName.length > COURSE_NAME_MAX) || (briefDescription.length < DESC_MIN || briefDescription.length > DESC_MAX)
            || (courseCategory.length < CATEGORY_MIN || courseCategory.length > CATEGORY_MAX)) {
            setDisabledBtn(true);
            return;
        }

        setDisabledBtn(false)
        return;
    }, [
        courseName,
        briefDescription,
        courseCategory
    ])

    const generateCourse = () => {
        setCourseGenerationLoader(true);
       
        axios.post("/api/create-course", { promptCourseName: courseName, promptCourseDescription: briefDescription, promptCategory: courseCategory }, { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } })
            .then((res) => {
                setCourseGenerationLoader(false);
                setUsersCreatedCourses(res.data.newCreatedCoursesList)
                setGeneratedCoursePreview(res.data.course)

                setCourseCategory("")
                setCourseName("")
                setBriefDescription("")
            }).catch((err) => {
                console.log(err)
                setCourseGenerationLoader(false);
                if (err.response.status === 401) {
                    router.push("/client/auth/login")
                    return;
                } else if (err.response.staus === 400) {
                    toast.error("Please make sure the fields are valid")
                } else {
                    toast.error("An error occured in our server. Please bare with us");
                    return;
                }
            })
    }
    return (
        <div className="col-span-16 min-h-[90vh] p-6">
            {/* Top Section */}
            <div className="flex flex-col lg:flex-row gap-6 h-full">
                {/* Left: Course Input - Modern Monochrome Card */}
                <div className="flex-1">
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
                            <h2 className="text-2xl font-bold text-white">Create New Course</h2>
                            <p className="text-gray-300 mt-1">Let AI help you build amazing learning content</p>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 md:p-8 space-y-6">
                            {/* Course Name Field - Improved Responsiveness */}
                            <div className="space-y-3">
                                <Label className="block text-xs md:text-sm font-medium text-gray-700 uppercase tracking-wider">
                                    Course Title
                                </Label>
                                <div className="relative">
                                    <Input
                                        value={courseName}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCourseName(e.target.value)}
                                        type="text"
                                        className="w-full px-4 md:px-6 py-4 md:py-8 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm md:text-base"
                                        placeholder="e.g Advanced React Patterns"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <svg className="h-4 w-4 md:h-5 md:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="block text-xs md:text-sm font-medium text-gray-700 uppercase tracking-wider">
                                    Course Category
                                </Label>
                                <div className="relative">
                                    <Input
                                        value={courseCategory}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCourseCategory(e.target.value)}
                                        type="text"
                                        className="w-full px-4 md:px-6 py-4 md:py-8 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm md:text-base"
                                        placeholder="e.g Programming"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <svg className="h-4 w-4 md:h-5 md:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Description Field */}
                            <div className="space-y-3">
                                <Label className="block text-xs md:text-sm font-medium text-gray-700 uppercase tracking-wider">
                                    Course Description
                                </Label>
                                <Textarea
                                    value={briefDescription}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBriefDescription(e.target.value)}
                                    className="w-full px-4 md:px-6 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 placeholder-gray-400 min-h-[120px] md:min-h-[150px] text-sm md:text-base"
                                    placeholder="Give a brief description of your course..."
                                />
                            </div>

                            {/* Generate Button */}
                            {disabledBtn ? <motion.button
                                disabled={true}
                                className="w-full bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 py-3 md:py-4 rounded-xl font-medium flex items-center justify-center space-x-2 text-sm md:text-base cursor-not-allowed"
                                whileHover={{}}
                                whileTap={{}}
                                transition={{}}
                            >
                                <svg className="w-4 h-4 md:w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                <span>Generate with AI</span>
                            </motion.button> : <motion.button
                                onClick={() => generateCourse()}
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.2)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white py-3 md:py-4 rounded-xl font-medium flex items-center justify-center space-x-2 text-sm md:text-base
          hover:cursor-pointer"
                            >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                <span>Generate with AI</span>
                            </motion.button>}
                        </div>
                    </div>
                </div>

                {/* Right: Preview Panel - Monochrome Version */}
                {courseGenerationLoader ? (
                    <div
                        className="flex-1"
                    >
                        <div className="h-full bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-dashed border-gray-300 shadow-inner overflow-hidden transition-all duration-500 hover:border-gray-400">
                            <div className="h-full flex flex-col items-center justify-center p-6 md:p-8 text-center">
                                <BlackOrbitalLoader />
                            </div>
                        </div>
                    </div>
                ) : !generatedCoursePreview ? (
                    <div className="flex-1">
                        <div className="h-full bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-dashed border-gray-300 shadow-inner overflow-hidden transition-all duration-500 hover:border-gray-400">
                            <div className="h-full flex flex-col items-center justify-center p-6 md:p-8 text-center">
                                <div className="mb-4 md:mb-6">
                                    <svg className="w-16 h-16 md:w-20 md:h-20 text-gray-300 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-500 mb-2">AI Course Preview</h3>
                                <p className="text-gray-400 text-sm md:text-base max-w-md">
                                    Your generated course content will appear here with interactive preview.
                                </p>
                                <div className="mt-4 md:mt-6 bg-gray-100 text-gray-600 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium">
                                    Try generating your first course!
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <GeneratedCoursePreview course={generatedCoursePreview} />
                )}
            </div>

            {/* Created Courses Section */}
        </div>
    );
};

export default CourseCreation;
