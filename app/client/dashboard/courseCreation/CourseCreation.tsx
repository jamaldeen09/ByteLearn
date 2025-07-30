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
import Image from "next/image";
import { useAppSelector } from "@/app/redux/essentials/hooks";
import { Archive, ArchiveRestore, BarChart2, Pencil, Users } from "lucide-react";
import CourseDetailsModal from "../../components/reusableComponents/CreatedCourseDetails";
import { useSearchParams } from "next/navigation";
import CourseEditorPage from "./EditorPage";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import DeepseekSpinner from "../../components/reusableComponents/DeepseekSpinner";
import { AxiosError } from "axios";
import BlackSpinner from "../../components/reusableComponents/BlackSpinner";
const CourseCreation = (): React.ReactElement => {

    // local states
    const [disabledBtn, setDisabledBtn] = useState<boolean>(true);
    const [courseName, setCourseName] = useState<string>("")
    const [briefDescription, setBriefDescription] = useState<string>("")
    const [courseCategory, setCourseCategory] = useState<string>("")
    const router = useRouter()

    const [usersCreatedCourse, setUsersCreatedCourses] = useState<courseSchema[]>([])
    const [generatedCoursePreview, setGeneratedCoursePreview] = useState<courseSchema | null>(null)
    const [loadingUsersCreatedCourse, setLoadingUsersCreatedCourse] = useState<boolean>(false);

    const [courseGenerationLoader, setCourseGenerationLoader] = useState<boolean>(false);
    const usersinfo = useAppSelector(state => state.usersInformation)
    const [isPublishing, setIsPublishing] = useState<boolean>(false);
    const [isDrafting, setIsDrafting] = useState<boolean>(false);
    const [courseGettingDrafted, setCourseGettingDrafted] = useState<string>('');
    const [courseGettingPublished, setCourseGettingPublished] = useState<string>("")
    const [seeCreatedCourseDetails, setSeeCreatedCourseDetails] = useState<boolean>(false);
    const [getCourseToView, setGetCourseToView] = useState<courseSchema | null>(null)
    const [filter, setFilter] = useState<'active' | 'archived'>('active');
    const [archivingCourse, setArchivingCourse] = useState<boolean>(false);
    const [courseBeingArchived, setCourseBeingArchived] = useState<string>("")
    const [restoringCourse, setRestoringCourse] = useState<boolean>(false)
    const [courseBeingRestored, setCourseBeingRestored] = useState<string>("");

    const [action, setAction] = useState<"none" | "archive" | "restore">("none")

    // Filter courses based on selection
    const filteredCourses = usersCreatedCourse.filter(course =>
        filter === 'active' ? !course.isArchived : course.isArchived
    );

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
                } else if (err.response.status === 406) {
                    toast.error(err.response.data.msg)

                    setCourseCategory("")
                    setCourseName("")
                    setBriefDescription("")
                    return;
                } else {
                    toast.error("An error occured in our server. Please bare with us");
                    return;
                }
            })
    }
    const publishCourse = (id: string) => {
        setIsPublishing(true)
        setCourseGettingPublished(id);
        axios.put("/api/publish-course", { courseId: id }, { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } }).then((res) => {
            setIsPublishing(false)
            setUsersCreatedCourses(res.data.createdCourses);
            toast.success("Course published successfully");
            return;
        }).catch((err) => {
            console.error(err)
            setIsPublishing(false)
            if (err.response.status === 401 || err.response.status == 403) {
                router.push("/client/auth/login")
                return;
            } else if (err.response.status === 404) {
                toast.error("Course was not found");
                return;
            } else {
                toast.error("A server error occured please bare with us.")
                return;
            }
        })
    }
    const draftCourse = (id: string) => {
        setIsDrafting(true)
        setCourseGettingDrafted(id)
        axios.put("/api/draft-course", { courseId: id }, { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } }).then((res) => {
            setIsDrafting(false)
            setUsersCreatedCourses(res.data.createdCourses);
            toast.success("Course drafted successfully");
            return;
        }).catch((err) => {
            console.error(err)
            setIsDrafting(false)
            if (err.response.status === 401 || err.response.status == 403) {
                router.push("/client/auth/login")
                return;
            } else if (err.response.status === 404) {
                toast.error("Course was not found");
                return;
            } else {
                toast.error("A server error occured please bare with us.")
                return;
            }
        })
    }

    const fetchCreatedCourses = () => {
        setLoadingUsersCreatedCourse(true)
        axios
            .get(`/api/get-createdCourses`, { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } })
            .then((res) => {
                setUsersCreatedCourses(res.data.data);
                setLoadingUsersCreatedCourse(false);
            })
            .catch((err) => {
                setLoadingUsersCreatedCourse(false);
                console.error(err);
                toast.error("Error occurred in getting creator's work");
            })
    }

    const archiveCourse = (id: string) => {
        setAction("archive")
        setArchivingCourse(true);
        setCourseBeingArchived(id);
        axios.patch(`/api/archive-course/${id}`, {}, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}`
            }
        }).then((res) => {
            setArchivingCourse(false);
            toast.success(`${res.data.msg} has been arhived`)

            fetchCreatedCourses();
            setCourseBeingArchived("");
            return;
        }).catch((err: unknown) => {
            setArchivingCourse(false);
            setCourseBeingArchived("");
            if (err instanceof AxiosError) {
                console.error(err)

                if (err.response?.status === 401 || err.response?.status === 404) {
                    router.push("/client/auth/login");
                    return;
                } else {
                    toast.error("A server error occured please bare with us.")
                }
            }
        })
    }

    const restoreCourse = (id: string) => {
        setAction("restore")
        setRestoringCourse(true)
        setCourseBeingRestored(id);

        axios.patch(`/api/restore-course/${id}`, {}, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}`
            }
        }).then((res) => {
            toast.success(res.data.msg);
            fetchCreatedCourses();
            setRestoringCourse(false)
            setCourseBeingRestored("");
        }).catch((err) => {
            setRestoringCourse(false);
            setCourseBeingRestored("");
            if (err instanceof AxiosError) {
                console.error(err)

                if (err.response?.status === 401 || err.response?.status === 404) {
                    router.push("/client/auth/login");
                    return;
                } else {
                    toast.error("A server error occured please bare with us.")
                }
            }
        })
    }
    useEffect(() => {
        setLoadingUsersCreatedCourse(true);
        axios
            .get(`/api/get-createdCourses`, { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } })
            .then((res) => {
                setUsersCreatedCourses(res.data.data);
                setLoadingUsersCreatedCourse(false);
            })
            .catch((err) => {
                setLoadingUsersCreatedCourse(false);
                console.error(err);
                toast.error("Error occurred in getting creator's work");
            })
    }, [usersinfo.fullName]);
    const searchParams = useSearchParams();
    const subTab = searchParams.get('subTab');

    if (subTab === "edit-course") return <CourseEditorPage />
    return (
        <>
            <div className="col-span-16 min-h-screen p-6 flex flex-col overflow-hidden">
                {/* Top Section */}
                <div className="flex flex-col lg:flex-row gap-6 h-full">
                    {/* Left: Course Input - Modern Monochrome Card */}
                    <div className="flex-1">
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-lg overflow-hidden ">
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
                                            className="w-full px-4 md:px-6 py-6 md:py-8 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm md:text-base"
                                            placeholder="e.g React Patterns"
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
                                            className="w-full px-4 md:px-6 py-6 md:py-8 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm md:text-base"
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
                            <div className="h-[80vh] lg:h-full bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-dashed border-gray-300 shadow-inner overflow-hidden transition-all duration-500 hover:border-gray-400">
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
                        <GeneratedCoursePreview course={generatedCoursePreview} onPublish={() => {
                            publishCourse(generatedCoursePreview?._id)
                            setGeneratedCoursePreview(null);
                        }} onDraft={() => {
                            draftCourse(generatedCoursePreview?._id)
                            setGeneratedCoursePreview(null);
                        }} />
                    )}
                </div>

                {/* Created Courses Section */}
                <div className="w-full min-h-fit flex flex-col gap-4 py-10">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
                        <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>

                        <div className="flex items-center gap-4">
                            {/* Archive Filter */}
                            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setFilter('active')}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === 'active' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Active Courses
                                </button>
                                <button
                                    onClick={() => setFilter('archived')}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === 'archived' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Archived
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={`w-full h-fit grid md:grid-cols-2 lg:grid-cols-3 py-10 gap-6`}>
                        {loadingUsersCreatedCourse ? (

                            [...Array(6)].map((_, index) => (
                                <div
                                    key={index}
                                    className="w-full max-w-[27rem] mx-auto md:mx-0 h-[27rem] bg-white border border-gray-200 rounded-xl overflow-hidden"
                                >
                                    {/* Image Skeleton - Responsive height */}
                                    <div className="relative w-full h-48 bg-gray-200 animate-pulse">
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-300/20 to-transparent" />
                                    </div>

                                    {/* Content Skeleton */}
                                    <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
                                        {/* Title */}
                                        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />

                                        {/* Description */}
                                        <div className="space-y-2 mb-4">
                                            <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                                            <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse" />
                                        </div>

                                        {/* Stats */}
                                        <div className="flex justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
                                                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
                                                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                                            </div>
                                        </div>

                                        {/* Footer - Responsive layout */}
                                        <div className="flex items-center justify-between border-t pt-4 mt-auto">
                                            <div className="flex items-center space-x-2">
                                                <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
                                                <div className="hidden sm:block h-3 w-20 bg-gray-200 rounded animate-pulse" />
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                {/* Buttons - Responsive sizing */}
                                                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                                                <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse hidden sm:block" />
                                                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : usersCreatedCourse.length <= 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 rounded-lg bg-gray-50 p-6">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 ">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-gray-400"
                                    >
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-700 mb-1">No courses created yet</h3>
                                <p className="text-gray-500 text-center max-w-md">
                                    You haven&apos;t created any courses. Get started by following the instructions to generate a course.
                                </p>
                            </div>
                        ) :
                            <div className="min-h-screen py-6 col-span-14 flex flex-col mx-auto">
                                {/* Filter Controls */}

                                {filter === 'archived' && filteredCourses.length === 0 ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-16">
                                        <div className="bg-gray-100 p-6 rounded-full mb-6">
                                            <Archive className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-medium text-gray-800 mb-2">No Archived Courses</h3>
                                        <p className="text-gray-500 text-center max-w-md mb-6">
                                            You haven't archived any courses yet. Archive courses to keep them out of your active list while preserving them for future use.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={() => setFilter('active')}
                                                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors hover:cursor-pointer"
                                            >
                                                View Active Courses
                                            </button>

                                        </div>
                                    </div>) :
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredCourses.map((course) => (
                                            <div
                                                key={course._id}
                                                className={`relative group rounded-xl overflow-hidden overflow-x-hidden border transition-all duration-300 hover:shadow-lg ${course.isArchived ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-white'
                                                    }`}
                                            >
                                                {/* Archive Ribbon */}
                                                {course.isArchived && (
                                                    <div className="hover:cursor-pointer absolute top-0 right-0 bg-gray-300 text-gray-700 px-3 py-1 text-xs font-medium z-10 rounded-bl-lg">
                                                        Archived
                                                    </div>
                                                )}

                                                {/* Course Image */}
                                                <div
                                                    onClick={() => {
                                                        setGetCourseToView(course)
                                                        setSeeCreatedCourseDetails(true);
                                                    }}
                                                    className="relative h-48 w-full overflow-hiddenn overflow-x-hidden hover:cursor-pointer
                                            ">
                                                    <Image
                                                        src={course.imageUrl}
                                                        alt={course.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                        unoptimized
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                                                    {/* Status Badge */}
                                                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${course.isPublished
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {course.isPublished ? 'Published' : 'Draft'}
                                                    </div>
                                                </div>

                                                {/* Course Content */}
                                                <div className="p-5">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                                                            {course.title}
                                                        </h3>

                                                    </div>

                                                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-4">
                                                        {course.description}
                                                    </p>

                                                    {/* Stats */}
                                                    <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                                                        <div className="flex items-center space-x-2">
                                                            <Users className="w-4 h-4" />
                                                            <span>{course.enrollments || 0} enrollments</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <BarChart2 className="w-4 h-4" />
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center justify-between border-t pt-4">
                                                        <div className="flex items-center space-y-1 sm:space-y-0 sm:space-x-2 flex-col text-center sm:text-start sm:flex-row">
                                                            <Image
                                                                src={course.creator.profilePicture}
                                                                alt={course.creator.fullName}
                                                                width={24}
                                                                height={24}
                                                                className="rounded-full border border-gray-200"
                                                                unoptimized
                                                            />
                                                            <span className="text-xs text-gray-600">
                                                                {course.creator.fullName}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center space-x-2">

                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        onClick={() => {

                                                                            if (course.isArchived) {
                                                                                restoreCourse(course._id);
                                                                            }

                                                                            else {
                                                                                archiveCourse(course._id);
                                                                            }
                                                                        }}
                                                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer"
                                                                    >
                                                                        {courseBeingArchived === course._id && archivingCourse ? (
                                                                            <BlackSpinner />
                                                                        ) : courseBeingRestored === course._id && restoringCourse ? (
                                                                            <BlackSpinner />
                                                                        ) : course.isArchived ? (
                                                                            <ArchiveRestore className="w-4 h-4 text-gray-600" />
                                                                        ) : (
                                                                            <Archive className="w-4 h-4 text-gray-600" />
                                                                        )}
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {course.isArchived ? 'Restore course' : 'Archive course'}
                                                                </TooltipContent>
                                                            </Tooltip>

                                                            {!course.isPublished ? (
                                                                !course.isArchived && (
                                                                    <button
                                                                        onClick={() => publishCourse(course._id)}
                                                                        className={`px-3 hover:cursor-pointer py-1 text-xs bg-black text-white rounded-full hover:bg-gray-800 transition-colors
                                                                ${isPublishing && "centered-flex space-x-4"}`}
                                                                    >
                                                                        <p>Publish</p>
                                                                        {isPublishing && courseGettingPublished === course._id && (
                                                                            <span className="mt-1">
                                                                                <DeepseekSpinner />
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                )
                                                            ) : (
                                                                !course.isArchived && (
                                                                    <button
                                                                        onClick={() => draftCourse(course._id)}
                                                                        className={`px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors hover:cursor-pointer
                                                            ${isDrafting && "centered-flex space-x-4"}`}
                                                                    >
                                                                        <p>Draft</p>
                                                                        {isDrafting && courseGettingDrafted === course._id && (
                                                                            <span className="mt-1">
                                                                                <DeepseekSpinner />
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                )
                                                            )}


                                                            {!course.isPublished && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <button
                                                                            onClick={() => router.push(`/client/dashboard?tab=course-creation&subTab=edit-course&courseId=${course._id}`)}
                                                                            className="p-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer"
                                                                        >
                                                                            <Pencil className="w-4 h-4 text-gray-600" />

                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        Edit course
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>}
                            </div>
                        }
                    </div>
                </div>
            </div>
            <CourseDetailsModal
                open={seeCreatedCourseDetails}
                setOpen={setSeeCreatedCourseDetails}
                course={getCourseToView}
            />
        </>
    );
};

export default CourseCreation;
