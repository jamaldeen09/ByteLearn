"use client"
import { useAppSelector } from "@/app/redux/essentials/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, XIcon } from "lucide-react";
import Image from "next/image";
import { courseSchema, topicSchema } from "../../types/types";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import axios from "@/app/client/utils/config/axios"
import toast from "react-hot-toast";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import WhiteSpinner from "./WhiteSpinner";
import FeedBackSidebar from "./FeedBackSidebar";
import CardInfoDisplayModal from "./CardInfoDisplayModal";

type cardInfoDisplayProps = {
    openClickedWork: boolean;
    setOpenClickedWork: React.Dispatch<React.SetStateAction<boolean>>;
    courseId: string;
};

const OtherWork = ({ openClickedWork, setOpenClickedWork, courseId }: cardInfoDisplayProps) => {
    const courses = useAppSelector(state => state.coursesSlice.courses);
    const foundCourse = courses.find((course: courseSchema) => course._id === courseId);
    const [creatorsWork, setCreatorsWork] = useState<courseSchema[]>([]);
    const [enrollLoading, setEnrollLoading] = useState<boolean>(false);
    const [loadingCreatorsWork, setLoadingCreatorsWork] = useState<boolean>(true);
    const enrolledCoursesData = useAppSelector(state => state.usersInformation.enrolledCourses);
    const enrolledCourses = new Set(enrolledCoursesData.map(course => course._id));
    const router = useRouter()

    const filteredCreatorsWork: courseSchema[] = creatorsWork.filter((work: courseSchema) => work._id !== courseId)

    const [open, setOpen] = useState<boolean>(false);
    const [clicked, setClicked] = useState<string>("")

    useEffect(() => {
        if (!openClickedWork || !foundCourse) return;
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
    }, [openClickedWork, courseId, foundCourse]);

    const handleClose = () => setOpenClickedWork(false);
    const enroll = (id: string) => {
        console.log("Enrolling in course with id:", id);
        setEnrollLoading(true);
        axios.post("/api/enroll", { courseId: id }, { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } }).then((res) => {
            setEnrollLoading(false);
            router.push(`/client/dashboard?tab=my-courses&courseId=${id}`);
            toast.success(res.data.msg);
            setOpenClickedWork(false);
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

    if (!foundCourse) return null;

    return (
        <>
            <AnimatePresence>
                {openClickedWork && (
                    <>
                        {/* Backdrop - invisible click target */}
                        <motion.div
                            className="fixed inset-0 z-40 w-full h-full rounded-2xl"
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
                            <div className="h-16 w-full bg-black bg-opacity-40 flex items-center justify-end px-4">
                                <XIcon
                                    className="text-white w-6 h-6 hover:text-gray-300 transition-colors cursor-pointer"
                                    onClick={handleClose}
                                />
                            </div>

                            {/* Content area */}
                            <motion.div
                                initial={{ y: 140, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 140, opacity: 1 }}
                                transition={{ duration: 0.6, type: "spring" }}
                                className="flex-1 bg-white rounded-2xl overflow-y-auto flex justify-center space-x-14
                                max-lg:px-6 lg:px-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="w-full max-w-6xl overflow-y-auto h-full p-6">
                                    <div className="w-full max-w-6xl min-h-fit overflow-y-auto">
                                        {/* Rest of your original content remains exactly the same */}
                                        <div className="w-full max-w-6xl h-fit py-10 flex flex-col gap-6">
                                            <div className="w-full">
                                                <h1 className="text-3xl font-extrabold">{foundCourse?.title || "React Typescript"}</h1>
                                            </div>

                                            <div className="w-full flex items-center justify-between h-fit">
                                                <div className="flex items-center space-x-6">
                                                    <Image
                                                        src={foundCourse?.creator.profilePicture || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww"}
                                                        alt={`${foundCourse?.creator.fullName}'s avatar`}
                                                        width={0}
                                                        height={0}
                                                        className="rounded-full h-14 w-14 object-cover"
                                                        unoptimized={true}
                                                    />
                                                    <p className="">{foundCourse?.creator.fullName || "Olatunji Labubu"}</p>
                                                </div>

                                                <div className="w-fit flex space-x-4 items-center">
                                                    <button
                                                        className="bg-white rounded-full p-2 hover:cursor-pointer border border-gray-300"
                                                    >
                                                        <Heart className="w-4 h-4" />
                                                    </button>

                                                    {enrolledCourses.has(foundCourse?._id ? foundCourse?._id : "") ? <button
                                                        className={`bg-gray-300 text-gray-400 font-extrabold px-8 py-3 rounded-full cursor-not-allowed
                                    ${enrollLoading && "centered-flex space-x-4"}`}>
                                                        <p>Enrolled</p>

                                                    </button> : <button onClick={() => enroll(foundCourse?._id ? foundCourse._id : "")}
                                                        className={`bg-black text-white font-extrabold px-8 py-3 hover:cursor-pointer rounded-full hover:bg-black/90
                                    ${enrollLoading && "centered-flex space-x-4"}`}>
                                                        <p>Enroll</p>
                                                        {enrollLoading && <WhiteSpinner />}
                                                    </button>}
                                                </div>
                                            </div>

                                            <div className="w-full flex items-center space-x-10">
                                                <p className="text-gray-400 text-xs">Skills: {foundCourse?.topics.map((topic) => topic.skills.length)}</p>
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
                                                    className="w-full h-[80vh] rounded-2xl"
                                                ></div>
                                            </div>

                                            <div className="w-full flex flex-col gap-4 mt-2">
                                                <div className="w-full">Topics</div>
                                                {foundCourse?.topics.map((topic: topicSchema) => (
                                                    <li key={topic._id} className="list-decimal">
                                                        {topic.title}
                                                    </li>
                                                ))}
                                            </div>

                                            <div className="w-full h-fit flex flex-col gap-8 mt-20">
                                                <div className="w-full">
                                                    <h1 className="font-extrabold text-xl">More from {foundCourse?.creator.fullName}</h1>
                                                </div>

                                                <div className="flex flex-wrap w-full gap-6">
                                                    {loadingCreatorsWork ? (
                                                        // Show 3 skeleton cards while loading
                                                        Array.from({ length: 3 }).map((_, idx) => (
                                                            <div key={idx} className="w-full max-w-[20rem] rounded-lg overflow-hidden animate-pulse space-y-2">
                                                                <div className="w-full h-64 bg-gray-200 rounded-lg" />
                                                                <div className="flex items-center justify-between px-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                                                        <div className="w-24 h-4 bg-gray-200 rounded" />
                                                                    </div>
                                                                    <div className="w-6 h-4 bg-gray-200 rounded" />
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : filteredCreatorsWork.map((work: courseSchema) => {
                                                        return (
                                                            <div
                                                                onClick={() => {
                                                                    setClicked(work._id)
                                                                    setOpenClickedWork(false)
                                                                    setOpen(true)
                                                                }}
                                                                key={work._id} className="w-full max-w-[20rem] overflow-hidden rounded-lg transition-all duration-300 flex flex-col hover:cursor-pointer">
                                                                {/* Card content */}
                                                                <div>
                                                                    {/* Top: Image + Gradient Overlay */}
                                                                    <div className="relative w-full h-64 group">
                                                                        <Image
                                                                            src={work?.imageUrl || "https://craftsnippets.com/articles_images/placeholder/placeholder.jpg"}
                                                                            alt={`${work?.title}'s Image URL`}
                                                                            className="w-full h-full object-cover rounded-lg"
                                                                            width={0}
                                                                            height={0}
                                                                            unoptimized={true}
                                                                        />
                                                                        {/* Gradient Overlay */}
                                                                        <div className="absolute bottom-0 left-0 w-full h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-b-lg flex justify-between px-4 items-center">
                                                                            <h1 className="text-sm text-white font-bold">{work?.title}</h1>
                                                                        </div>
                                                                    </div>

                                                                    {/* Bottom: Text or Details */}
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
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full max-w-sm h-full overflow-y-auto py-6">
                                    <FeedBackSidebar courseId={foundCourse?._id}/>
                                </div>

                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <CardInfoDisplayModal
                open={open}
                setOpen={setOpen}
                courseId={clicked}
            />
        </>
    );
};

export default OtherWork;