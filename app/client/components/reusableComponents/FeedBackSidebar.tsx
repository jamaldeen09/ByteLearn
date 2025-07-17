"use client";
import { useAppSelector } from "@/app/redux/essentials/hooks";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { courseSchema, feedBackMsgSchema } from "../../types/types";
import { socket } from "../../utils/config/io";
import { events } from "../../utils/events";
import WhiteSpinner from "./WhiteSpinner";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { getTimeAgo } from "../../utils/utils";

const FeedBackSidebar = ({ courseId }: { courseId: string | undefined }) => {
    const courses = useAppSelector((state) => state.coursesSlice.courses);
    const existingCourseData: courseSchema | undefined = courses.find(
        (course: courseSchema) => course._id === courseId
    );
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [feedback, setFeedback] = useState<string>("");
    const [disableButton, setDisableButton] = useState(true);
    const [loading, setLoading] = useState(false);
    const [localMessages, setLocalMessages] = useState<feedBackMsgSchema[]>([]);
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");


    // Send Feedback
    const sendFeedback = () => {
        if (!feedback || !existingCourseData?._id) return;
        setLoading(true);
        socket.emit(events.SEND_FEEDBACK, {
            courseId: existingCourseData._id,
            msg: feedback,
        });
    };

    // Listen for feedback response
    useEffect(() => {
        const handleFeedbackSent = (payload: feedBackMsgSchema) => {
            setLocalMessages((prev) => [payload, ...prev]);
            setFeedback("");
            setDisableButton(true);
            setLoading(false);
            toast.success("Feedback sent!");
        };

        socket.on(events.FEEDBACK_SENT, handleFeedbackSent);
        return () => {
            socket.off(events.FEEDBACK_SENT, handleFeedbackSent);
        };
    }, []);

    // Load Feedback History
    useEffect(() => {
        if (!courseId) return;
        setLoadingMessages(true);
        const data = { room: courseId };
        socket.emit(events.JOIN_ROOM, data);
        socket.emit(events.GET_FEEDBACK_HISTORY, { courseId });

        const handleHistory = (payload: feedBackMsgSchema[]) => {
            setLocalMessages(payload);
            setLoadingMessages(false);
        };

        socket.on(events.FEEDBACK_HISTORY_SENT, handleHistory);
        return () => {
            socket.off(events.FEEDBACK_HISTORY_SENT, handleHistory);
        };
    }, [courseId]);
    useEffect(() => {
        if (!courseId) return;

        const room = `feedback-${courseId}`;
        socket.emit(events.JOIN_COURSE_ROOM, { room });
        console.log("✅ Joined feedback room:", room);

        return () => {
            socket.emit(events.LEAVE_COURSE_ROOM, { room });
            console.log("👋 Left feedback room:", room);
        };
    }, [courseId]);

    const sortedMessages = [...localMessages].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        return sortOrder === "newest"
            ? dateB.getTime() - dateA.getTime()
            : dateA.getTime() - dateB.getTime();
    });

    return (
        <motion.div
            key="feedback-sidebar"
            initial={{ x: 200 }}
            animate={{ x: 0 }}
            exit={{ x: 200 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="w-full lg:max-w-sm z-50 bg-white border border-gray-300
        flex flex-col gap-6 py-6 px-4 mb-4 lg:rounded-3xl min-h-full"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Input Section */}
            <div className="w-full flex flex-col gap-4 h-full">
                <h1 className="font-extrabold text-xl">Write a Feedback</h1>
                <div className="flex flex-col gap-2">
                    <Textarea
                        value={feedback}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFeedback(value);
                            setDisableButton(value.length < 10 || value.length > 80);
                        }}
                        placeholder="Feedback"
                        className="h-20"
                    />
                </div>

                <button
                    onClick={sendFeedback}
                    disabled={disableButton || loading}
                    className={`px-6 py-3 rounded-full hover:cursor-pointer transition-all duration-300 flex items-center justify-center ${disableButton || loading
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800"
                        }`}
                >
                    {loading ? <WhiteSpinner /> : <p>Send</p>}
                </button>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Sort by
                        </span>
                    </div>
                </div>

                {/* Sort Buttons */}
                <div className="w-full centered-flex space-x-6">
                    <button onClick={() => setSortOrder("newest")}
                        className={`rounded-full px-3 py-1 text-xs border transition-all duration-300
          ${sortOrder === "newest" ? "bg-black text-white border-black" : "hover:bg-black hover:text-white border-gray-300 hover:border-black bg-white hover:cursor-pointer"}`}>
                        Newest
                    </button>
                    <button onClick={() => setSortOrder("oldest")}
                        className={`rounded-full px-3 py-1 text-xs border transition-all duration-300
          ${sortOrder === "oldest" ? "bg-black text-white border-black" : "hover:bg-black hover:text-white border-gray-300 hover:border-black bg-white hover:cursor-pointer"}`}>
                        Oldest
                    </button>
                </div>
            </div>

            {/* Feedback Messages */}
            <div className="w-full h-full flex flex-col gap-7">
                {loadingMessages ? (
                    // Skeletons
                    Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex gap-4 animate-pulse">
                            <div className="rounded-full bg-gray-200 w-10 h-10" />
                            <div className="flex flex-col gap-2 w-full">
                                <div className="w-2/3 h-3 bg-gray-200 rounded" />
                                <div className="w-1/2 h-3 bg-gray-200 rounded" />
                                <div className="w-1/3 h-2 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))
                ) : sortedMessages?.map((msg) => (
                    <div key={msg._id} className="w-full flex gap-4 ">
                        <div className="flex gap-4">
                            <Image
                                src={
                                    msg.sender.profilePicture ||
                                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLat8bZvhXD3ChSXyzGsFVh6qgplm1KhYPKA&s"
                                }
                                alt={`${msg.sender.fullName}'s profile picture`}
                                width={40}
                                height={40}
                                unoptimized
                                className="object-cover rounded-full w-10 h-10"
                            />
                            <div className="flex flex-col">
                                <h1 className="font-bold text-md">{msg.sender.fullName}</h1>
                                <p className="text-xs">{msg.text}</p>
                                <p className="text-xs text-gray-500">{getTimeAgo(new Date(msg.createdAt))}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default FeedBackSidebar;
