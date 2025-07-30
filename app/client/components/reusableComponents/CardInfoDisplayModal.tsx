"use client"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { courseSchema, topicSchema } from "../../types/types";
import { useEffect, useState } from "react";
import axios from "@/app/client/utils/config/axios"
import toast from "react-hot-toast";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import WhiteSpinner from "./WhiteSpinner";
import FeedBackSidebar from "./FeedBackSidebar";
import OtherWork from "./OtherWork";
import BasicSpinner from "./BasicSpinner";
import { changeState } from "@/app/redux/coursesSlices/likedStateSlice";


type cardInfoDisplayProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    courseId: string;
};


const CardInfoDisplayModal = ({ open, setOpen, courseId }: cardInfoDisplayProps) => {

    const courses = useAppSelector(state => state.coursesSlice.courses);
    const foundCourse: courseSchema | undefined = courses.find((course: courseSchema) => course._id === courseId);
    const [enrollLoading, setEnrollLoading] = useState<boolean>(false);
    const [loadingCreatorsWork, setLoadingCreatorsWork] = useState<boolean>(true);
    const [clickedWork, setClickedWork] = useState<string>("");
    const [clickedWorkModal, setClickedWorkModal] = useState<boolean>(false);
    const router = useRouter();
    const handleClose = () => {
        setOpen(false);
    };
    const [creatorsWork, setCreatorsWork] = useState<courseSchema[]>([]);
    const enrolledCourses = useAppSelector(state =>
        state.enrolledCourses.enrolledCourses
    );
    const isEnrolled = enrolledCourses.some(course => course._id === foundCourse?._id);
    const filteredCreatorsWork: courseSchema[] = creatorsWork.filter((work: courseSchema) => work._id !== courseId)

    const likedMap = useAppSelector(state => state.likedState.likedMap);
    const isLike = likedMap[courseId] ?? foundCourse?.likedByCurrentUser ?? false;
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!open || !foundCourse) return;
        setLoadingCreatorsWork(true);
        axios
            .get(`/api/creators-work/${foundCourse.creator.fullName}`)
            .then((res) => {
                setCreatorsWork(res.data.data);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error occurred in getting creator's work");
            })
            .finally(() => {
                setLoadingCreatorsWork(false);
            });
    }, [open, courseId, foundCourse]);

    const enroll = (id: string) => {

        setEnrollLoading(true);
        axios.post("/api/enroll", { courseId: id }, { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } }).then((res) => {
            setEnrollLoading(false);
            router.push(`/client/dashboard?tab=my-courses&courseId=${id}`);
            toast.success(res.data.msg);
            setOpen(false);
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

    const [loadingAnim, setloadingAnim] = useState(false);
    const currentUserId = useAppSelector(state => state.usersInformation._id)
    const isCreator = currentUserId === foundCourse?.creator._id;
    const totalSkills = foundCourse?.topics.map((skill) => skill.skills).map((skill) => skill.length).reduce((acc, num) => acc + num, 0)



    const toggleLike = async () => {
        if (loadingAnim) return;

        setloadingAnim(true);

        try {
            const token = localStorage.getItem("bytelearn_token");
            const endpoint = isLike ? "/api/unlike-course" : "/api/like-course";

            await axios.post(endpoint, { courseId: foundCourse?._id }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update UI state
            dispatch(changeState({ courseId: foundCourse!._id, isLiked: !isLike }));
        } catch (err) {
            console.error(err);
            toast.error("A server error occurred, please try again.");
        } finally {
            setloadingAnim(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop - invisible click target */}
                        <motion.div
                            className="fixed inset-0 z-40 w-full h-full rounded-2xl bg-black"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}

                        />

                        {/* Your original modal design with fixes */}
                        <motion.div
                            className="fixed inset-0 z-50 flex flex-col w-screen h-screen rounded-2xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}

                        >
                            {/* Top bar */}
                            <div className="h-20 w-full bg-black bg-opacity-40 flex items-center justify-end px-4">
                                <XIcon
                                    className="text-white w-6 h-6 hover:text-gray-300 transition-colors cursor-pointer"
                                    onClick={handleClose}
                                />
                            </div>


                            <motion.div
                                initial={{ y: 140, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 140, opacity: 1 }}
                                transition={{ duration: 0.6, type: "spring" }}
                                className="bg-white rounded-2xl overflow-hidden flex flex-col lg:flex-row lg:space-x-2 gap-10 "
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Main content container - will be scroll parent on mobile */}
                                <div className="flex-1 overflow-y-auto max-lg:h-[calc(100vh-200px)] lg:overflow-y-auto lg:h-full lg:ml-2
                                ">

                                    {/* Content area - scrollable only on desktop */}
                                    <div className="w-full  min-h-fit p-6">
                                        <div className="w-full h-fit py-10 flex flex-col gap-6">

                                            <div className="w-full">
                                                <h1 className="text-lg max-lg:text-xl lg:text-3xl font-extrabold">{foundCourse?.title || "React Typescript"}</h1>
                                            </div>

                                            <div className="w-full flex items-center justify-between h-fit">
                                                <div className="flex items-center iphone:gap-2 sm:gap-4 iphone:flex-col sm:flex-row">
                                                    <Image
                                                        src={foundCourse?.creator.profilePicture || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww"}
                                                        alt={`${foundCourse?.creator.fullName}'s avatar`}
                                                        width={0}
                                                        height={0}
                                                        className="rounded-full h-14 w-14 object-cover mx-auto sm:m-0"
                                                        unoptimized={true}
                                                    />
                                                    <p className="">{foundCourse?.creator.fullName}</p>
                                                </div>

                                                <div className="w-fit flex space-x-4 items-center">
                                                    {isCreator ? (

                                                        <div className="relative group">
                                                            {/* Main Badge */}
                                                            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1.5 rounded-full shadow-lg">
                                                                <svg
                                                                    className="w-4 h-4 text-white"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                                                    />
                                                                </svg>
                                                                <span className="text-xs font-semibold text-white tracking-wide">CREATOR</span>
                                                            </div>

                                                        </div>


                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={toggleLike}
                                                                className="bg-white rounded-full p-2 hover:cursor-pointer border border-gray-300 w-8 h-8 centered-flex"
                                                            >
                                                                {loadingAnim ? (
                                                                    <BasicSpinner />
                                                                ) : (
                                                                    <FontAwesomeIcon
                                                                        icon={faHeart}
                                                                        className={`w-4 h-4 ${isLike && "text-red-600"}`}
                                                                    />
                                                                )}

                                                            </button>

                                                            {isEnrolled ? (
                                                                <button
                                                                    className={`bg-gray-300 text-gray-400 font-extrabold px-8 py-3 rounded-full cursor-not-allowed
            ${enrollLoading && "centered-flex space-x-4"}`}
                                                                >
                                                                    <p>Enrolled</p>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => enroll(foundCourse?._id ? foundCourse._id : "")}
                                                                    className={`bg-black text-white font-extrabold px-8 py-3 hover:cursor-pointer rounded-full hover:bg-black/90
            ${enrollLoading && "centered-flex space-x-4"}`}
                                                                >
                                                                    <p>Enroll</p>
                                                                    {enrollLoading && <WhiteSpinner />}
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="w-full flex items-center space-x-10">
                                                <p className="text-gray-400 text-xs">Skills: {totalSkills}</p>
                                                <p className="text-gray-400 text-xs">Category: {foundCourse?.category}</p>
                                            </div>

                                            <div className="w-full flex items-ceter">
                                                <p className="text-gray-400 text-xs">{foundCourse?.description}</p>
                                            </div>

                                            <div className="">
                                                <div
                                                    style={{
                                                        backgroundImage: `url(${foundCourse?.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/TC-TLE_LLBG_08-08-2014b.jpg/250px-TC-TLE_LLBG_08-08-2014b.jpg"})`,
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center",
                                                        backgroundRepeat: "no-repeat",
                                                    }}
                                                    className="w-full h-[40vh] border md:h-[60vh] max-lg:h-[70vh] lg:h-[80vh] rounded-2xl"
                                                ></div>
                                            </div>

                                            <div className="w-full flex flex-col gap-4 mt-2">
                                                <div className="w-full">Topics</div>
                                                {foundCourse?.topics.map((topic: topicSchema, index: number) => (
                                                    <ol key={topic._id} className="list-decimal
                                                    max-lg:m-0">
                                                        {index + 1}. {topic.title}
                                                    </ol>
                                                ))}
                                            </div>

                                            <div className="w-full h-fit flex flex-col gap-8 mt-20">
                                                <div className="w-full">
                                                    <h1 className="font-extrabold text-xl">More from {foundCourse?.creator.fullName}</h1>
                                                </div>

                                                <div className="flex flex-wrap w-full gap-10 ">
                                                    {loadingCreatorsWork ? (
                                                        Array.from({ length: 3 }).map((_, idx) => (
                                                            <div key={idx} className="w-full md:max-w-[20rem] rounded-lg overflow-hidden animate-pulse space-y-2">
                                                                <div className="w-full h-90 md:h-64 bg-gray-200 rounded-lg" />
                                                                <div className="flex items-center justify-between px-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                                                        <div className="w-24 h-4 bg-gray-200 rounded" />
                                                                    </div>
                                                                    <div className="w-6 h-4 bg-gray-200 rounded" />
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : filteredCreatorsWork.length <= 0 ? (
                                                        <div className="w-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="40"
                                                                    height="40"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="text-gray-400"
                                                                >
                                                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                                                    <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                                                </svg>
                                                            </div>
                                                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                                                No Other Courses Yet
                                                            </h3>
                                                            <p className="text-gray-500 text-center max-w-md">
                                                                {foundCourse?.creator.fullName} hasn't published additional courses yet.
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        filteredCreatorsWork.map((work: courseSchema) => (
                                                            <div
                                                                onClick={() => {
                                                                    setClickedWork(work._id);
                                                                    setOpen(false);
                                                                    setClickedWorkModal(true);
                                                                }}
                                                                key={work._id}
                                                                className="w-full md:max-w-[20rem] max-lg:w-[18rem] lg:max-w-[20rem] overflow-hidden rounded-lg transition-all duration-300 flex flex-col hover:cursor-pointer"
                                                            >
                                                                <div>
                                                                    <div className="relative w-full h-90 md:h-64 group">
                                                                        <Image
                                                                            src={work?.imageUrl || "https://craftsnippets.com/articles_images/placeholder/placeholder.jpg"}
                                                                            alt={`${work?.title}'s Image URL`}
                                                                            className="w-full h-full object-cover rounded-lg"
                                                                            width={0}
                                                                            height={0}
                                                                            unoptimized={true}
                                                                        />
                                                                        <div className="absolute bottom-0 left-0 w-full h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-b-lg flex justify-between px-4 items-center">
                                                                            <h1 className="text-sm text-white font-bold">{work?.title}</h1>
                                                                        </div>
                                                                    </div>

                                                                    <div className="py-2 flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            <Image
                                                                                unoptimized={true}
                                                                                src={work?.creator.profilePicture}
                                                                                alt="Instructor"
                                                                                width={30}
                                                                                height={30}
                                                                                className="rounded-full"
                                                                            />
                                                                            <p className="text-sm">{work.creator.fullName}</p>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <FontAwesomeIcon icon={faHeart} className="text-gray-300 w-4 h-4" />
                                                                            <p className="text-gray-400 text-xs">{work.likes}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feedback sidebar - appears below content on mobile */}
                                    <div className="w-full lg:hidden">
                                        <FeedBackSidebar courseId={foundCourse?._id} />
                                    </div>
                                </div>

                                {/* Feedback sidebar - appears on right on desktop */}
                                <div className="hidden lg:block w-full max-w-md  overflow-y-auto h-full py-6 border border-gray-300">
                                    <FeedBackSidebar courseId={foundCourse?._id} />
                                </div>

                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <OtherWork
                openClickedWork={clickedWorkModal}
                setOpenClickedWork={setClickedWorkModal}
                courseId={clickedWork}
            />
        </>
    );
};

export default CardInfoDisplayModal;