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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useAppSelector } from "@/app/redux/essentials/hooks";
import DeepseekSpinner from "../../components/reusableComponents/DeepseekSpinner";
import { Trash } from "lucide-react";
import BasicSpinner from "../../components/reusableComponents/BasicSpinner";
import CourseDetailsModal from "../../components/reusableComponents/CreatedCourseDetails";
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
    const [deletingCourse, setDeletingCourse] = useState<boolean>(false)
    const [deletedCourse, setDeletedCourse] = useState<string>("");

    const [seeCreatedCourseDetails, setSeeCreatedCourseDetails] = useState<boolean>(false);

    const [getCourseToView, setGetCourseToView] = useState<courseSchema | null>(null)

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

    const deleteCreatedCourse = (id: string) => {
        setDeletingCourse(true);
        axios.delete(`/api/delete-createdCourse/${id}`, { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } })
            .then((res) => {
                setDeletingCourse(false);
                toast.success(res.data.msg)
                return;
            }).catch((err) => {
                setDeletingCourse(false);
                console.error(err)
                if (err.response.status === 401 || err.response.status == 403) {
                    router.push("/client/auth/login")
                    return;
                } else if (err.response.status === 404) {
                    toast.error(err.response.data.msg);
                    return;
                } else {
                    toast.error("A server error occured please bare with us")
                    return;
                }
            })
    }
    useEffect(() => {
        setLoadingUsersCreatedCourse(true);
        axios
            .get(`/api/creators-work/${usersinfo.fullName}`)
            .then((res) => {
                setUsersCreatedCourses(res.data.data);
                setLoadingUsersCreatedCourse(false);
            })
            .catch((err) => {
                setLoadingUsersCreatedCourse(false);
                console.error(err);
                toast.error("Error occurred in getting creator's work");
            })
    }, []);
    return (
        <>
            <div className="col-span-16 min-h-screen p-6 flex flex-col">
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
                    <div className="w-full md:max-w-[440px] sm:mx-auto md:m-0 md:w-full">
                      <h1 className="text-xl max-lg:text-2xl">Manage Courses</h1>
                    </div>
                    <div className={`w-full h-fit grid md:grid-cols-2 lg:grid-cols-3 py-10 gap-6`}>
                        {loadingUsersCreatedCourse ? (
                            Array.from([1, 2, 3, 4, 5, 6]).map((i) => {
                                return (
                                    <div key={i} className="w-full max-w-[27rem] mx-auto md:mx-0 h-[27rem] animate-pulse bg-white border border-gray-100 rounded-xl overflow-hidden">
                                        <div className="relative w-full h-64 bg-gray-200" />
                                        <div className="p-4 flex flex-col h-[calc(100%-16rem)]">
                                            <div className="flex-grow space-y-2">
                                                <div className="w-3/4 h-4 bg-gray-300 rounded" />
                                                <div className="w-full h-3 bg-gray-200 rounded" />
                                                <div className="w-5/6 h-3 bg-gray-200 rounded" />
                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-gray-300" />
                                                    <div className="w-20 h-3 bg-gray-200 rounded" />
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-3 bg-gray-200 rounded" />
                                                    <div className="w-16 h-6 bg-gray-300 rounded-full" />
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
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
                                    You haven't created any courses. Get started by following the instructions to generate a course.
                                </p>
                            </div>
                        ) : usersCreatedCourse.map((course: courseSchema) => (
                            <div
                                onClick={() => {
                                    setGetCourseToView(course)
                                    setSeeCreatedCourseDetails(true);
                                }}
                                key={course._id}
                                className="w-full md:max-w-[27rem] max-lg:max-w-[30rem] mx-auto md:mx-0 h-[27rem] group overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/10"
                            >
                                {/* Card Container */}
                                <div className="relative flex flex-col h-full bg-white border border-gray-100 rounded-xl overflow-hidden">
                                    {/* Image with Gradient Overlay */}
                                    <div className="relative w-full h-64 overflow-hidden">
                                        <Image
                                            src={course.imageUrl}
                                            alt={course.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105 h-64"
                                            unoptimized
                                        />

                                        {/* Status Badge */}
                                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${course.isPublished
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {course.isPublished ? 'Published' : 'Draft'}
                                        </div>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                                {course.description}
                                            </p>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                                            <div className="flex items-center flex-col gap-2 max-lg:gap-0 max-lg:flex-row space-x-2">
                                                <Image
                                                    src={course.creator.profilePicture}
                                                    alt={course.creator.fullName}
                                                    width={28}
                                                    height={28}
                                                    className="rounded-full border border-gray-200"
                                                    unoptimized
                                                />
                                                <span className="text-xs sm:text-sm font-medium text-gray-700">
                                                    {course.creator.fullName}
                                                </span>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center space-x-1 text-gray-400">
                                                    <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
                                                    <span className="text-xs">{course.likes}</span>
                                                </div>

                                                {!course.isPublished ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            publishCourse(course._id)
                                                        }}
                                                        className={`px-3 py-1 text-xs font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-all
                hover:cursor-pointer hover:scale-105 duration-300 ${(isPublishing && courseGettingPublished === course._id) && "centered-flex space-x-4"}`}
                                                    >
                                                        <p>Publish</p>
                                                        {(isPublishing && courseGettingPublished === course._id) && (
                                                            <DeepseekSpinner />
                                                        )}
                                                    </button>
                                                ) : (<button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        draftCourse(course._id)
                                                    }}
                                                    className={`px-3 py-1 text-xs font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-all
        hover:cursor-pointer hover:scale-105 duration-300 ${(isDrafting && courseGettingDrafted === course._id) && "centered-flex space-x-4"}`}
                                                >
                                                    <p>Draft</p>
                                                    {(isDrafting && courseGettingDrafted === course._id) && (
                                                        <DeepseekSpinner />
                                                    )}
                                                </button>)}
                                                <button
                                                    onClick={() => {
                                                        deleteCreatedCourse(course._id)
                                                        setDeletedCourse(course._id)
                                                    }}
                                                    className="p-2 rounded-full bg-red-50 text-red-600  hover:cursor-pointer hover:scale-105 transition-all duration-300"
                                                >
                                                    {deletedCourse === course._id && deletingCourse ? <BasicSpinner /> : <Trash className="w-3 h-3" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
