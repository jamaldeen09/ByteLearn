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
import { Heart, Trash, XCircleIcon } from "lucide-react";
import { Pencil2Icon } from "@radix-ui/react-icons";
import BasicSpinner from "./BasicSpinner";


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
    const userId = useAppSelector(state => state.usersInformation._id)
    const usersFullname = useAppSelector(state => state.usersInformation.fullName)
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [likedMessages, setLikedMessages] = useState<Record<string, boolean>>({});
    const [messageLikes, setMessageLikes] = useState<Record<string, number>>({});


    const [triggerMessageDeletion, setTriggerMessageDeletion] = useState<boolean>(false);
    const [handleMsgEditing, setHandleMsgEditing] = useState<boolean>(false);
    const [clickedMsg, setClickedMsg] = useState<{
        msgId?: string,
        msgContent: string,
    } | null>(null);

    const [getDeleted, setGetDeleted] = useState<string>("")

    const handleLike = (messageId: string) => {
        if (!userId) {
            toast.error("Please login to like messages");
            return;
        }

        // const isLiked = likedMessages[messageId];
        // const newLikeStatus = !isLiked;
        // const likeCount = messageLikes[messageId] || 0;

        // // Optimistic UI update

        // setLikedMessages(prev => ({ ...prev, [messageId]: newLikeStatus }));
        // setMessageLikes(prev => ({
        //     ...prev,
        //     [messageId]: newLikeStatus ? (prev[messageId] || 0) + 1 : Math.max(0, (prev[messageId] || 1) - 1)
        // }));

        // // Emit socket event
        // socket.emit(events.LIKE_FEEDBACK_MESSAGE, {
        //     messageId,
        //     courseId,
        //     userId,
        //     like: newLikeStatus
        // });
        const currentLikeStatus = likedMessages[messageId];
        const newLikeStatus = !currentLikeStatus;

        // Optimistic UI update
        setLikedMessages(prev => ({ ...prev, [messageId]: newLikeStatus }));
        setMessageLikes(prev => ({
            ...prev,
            [messageId]: newLikeStatus
                ? (prev[messageId] || 0) + 1
                : Math.max(0, (prev[messageId] || 1) - 1)
        }));

        // Emit socket event
        socket.emit(events.LIKE_FEEDBACK_MESSAGE, {
            messageId,
            courseId,
            userId,
            like: newLikeStatus // false when unliking
        });
    };


    // Send Feedback
    const sendFeedback = () => {
        if (!feedback || !existingCourseData?._id) return;
        setLoading(true);
        socket.emit(events.SEND_FEEDBACK, {
            courseId: existingCourseData._id,
            msg: feedback,
        });
    };
    const isCreator = existingCourseData?.creator._id === userId;

    // Listen for feedback response
    useEffect(() => {
        const handleFeedbackSent = (payload: feedBackMsgSchema) => {
            ;
            setLocalMessages((prev) => [payload, ...prev]);
            setFeedback("");
            setDisableButton(true);
            setLoading(false);
            setTimeout(() => toast.success("Feedback sent!"), 1000)

            socket.emit(events.GET_FEEDBACK_HISTORY, { courseId }, (payload: feedBackMsgSchema[]) => {
                setLocalMessages(payload);
            });
        };

        socket.on(events.FEEDBACK_SENT, handleFeedbackSent);

        return () => {
            socket.off(events.FEEDBACK_SENT);
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
            // setLocalMessages(payload);
            // setLoadingMessages(false);
            const initialLikes: Record<string, number> = {};
            const initialLikedStatus: Record<string, boolean> = {};

            payload.forEach((msg: feedBackMsgSchema) => {
                initialLikes[msg._id] = msg.likes;
                initialLikedStatus[msg._id] = msg.likedBy?.includes(userId) || false;
            });

            setMessageLikes(initialLikes);
            setLikedMessages(initialLikedStatus);
            setLocalMessages(payload);
            setLoadingMessages(false);
        };

        socket.on(events.FEEDBACK_HISTORY_SENT, handleHistory);
        return () => {
            socket.off(events.FEEDBACK_HISTORY_SENT);
            socket.off(events.JOIN_ROOM)
            socket.off(events.GET_FEEDBACK_HISTORY)
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


    useEffect(() => {
        if (!triggerMessageDeletion) return;

        const dataEmitted = { courseId };
        setIsDeleting(true);
        socket.emit(events.DELETE_FEEDBACK_MESSAGE, dataEmitted);

        // Handle successful deletion
        const handleDeleted = ({ msg }: { msg: string }) => {
            setIsDeleting(false);
            setTriggerMessageDeletion(false);
            toast.success(msg);

            // Directly fetch new messages without intermediate loading state
            socket.emit(events.GET_FEEDBACK_HISTORY, { courseId }, (payload: feedBackMsgSchema[]) => {
                setLocalMessages(payload);
            });
        };

        // Handle error case
        const handleError = () => {
            setIsDeleting(false);
            setTriggerMessageDeletion(false);
        };

        socket.on(events.DELETED_FEEDBACK_MESSAGE, handleDeleted);
        socket.on(events.ERROR_OCCURED, handleError);

        return () => {
            socket.off(events.DELETED_FEEDBACK_MESSAGE, handleDeleted);
            socket.off(events.ERROR_OCCURED, handleError);
        };
    }, [triggerMessageDeletion, courseId]);

    useEffect(() => {
        if (!handleMsgEditing || clickedMsg?.msgContent.trim() === "" || clickedMsg?.msgId?.trim() === "") return;
        const data = { msgToEdit: clickedMsg?.msgId, courseId, newContent: clickedMsg?.msgContent }
        setLoading(true)
        socket.emit(events.EDIT_MESSAGE, data);

        socket.on(events.MESSAGE_EDITED, ({ msg }) => {
            setLoading(false)
            setLoadingMessages(true);
            setIsEditing(false);
            setClickedMsg(null)

            toast.success(msg);
            const data = { room: courseId };
            socket.emit(events.JOIN_ROOM, data);
            socket.emit(events.GET_FEEDBACK_HISTORY, { courseId });

            const handleHistory = (payload: feedBackMsgSchema[]) => {
                setLocalMessages(payload);
                setLoadingMessages(false);
            };
            socket.on(events.FEEDBACK_HISTORY_SENT, handleHistory);
            return;
        })

        return () => {
            socket.off(events.EDIT_MESSAGE)
            socket.off(events.MESSAGE_EDITED)
            socket.off(events.JOIN_ROOM);
            socket.off(events.GET_FEEDBACK_HISTORY);
            socket.off(events.FEEDBACK_HISTORY_SENT);
        }
    }, [handleMsgEditing])

    useEffect(() => {
        const handleFeedbackLiked = ({ messageId, likes, liked }: { messageId: string, likes: number, liked: boolean }) => {
            setMessageLikes(prev => ({ ...prev, [messageId]: likes }));
            setLikedMessages(prev => ({ ...prev, [messageId]: liked }));
        };

        socket.on(events.FEEDBACK_MESSAGE_LIKED, handleFeedbackLiked);

        return () => {
            socket.off(events.FEEDBACK_MESSAGE_LIKED, handleFeedbackLiked);
        };
    }, []);

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
            className="w-full z-50 bg-white 
        flex flex-col gap-6 py-6 px-4 mb-4 lg:rounded-3xl min-h-full "
            onClick={(e) => e.stopPropagation()}
        >
            {/* Input Section */}
            <div className="w-full flex flex-col gap-4 h-full">
                {isCreator ? <div
                    className="w-full h-full centered-flex"
                >
                    <p className="text-gray-400 text-xs">As the creator, you can't review your own course</p>
                </div> : <>
                    <h1 className="font-extrabold text-xl">Write a Feedback</h1>
                    <div className="flex flex-col gap-2">

                        {isEditing ? (
                            <Textarea
                                value={clickedMsg?.msgContent || ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setClickedMsg(prev => prev ? { ...prev, msgContent: value } : null);
                                    setDisableButton(value.length < 10 || value.length > 80);
                                }}
                                placeholder="Edit Feedback"
                                className="h-20"
                            />
                        ) : (
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
                        )}

                    </div>
                    <button
                        onClick={isEditing ? () => setHandleMsgEditing(true) : sendFeedback}
                        disabled={disableButton || loading}
                        className={`px-6 py-3 rounded-full hover:cursor-pointer transition-all duration-300 flex items-center justify-center ${disableButton || loading
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800"
                            }`}
                    >
                        {loading ? <WhiteSpinner /> : <p>{isEditing ? "Edit" : "Send"}</p>}
                    </button>

                </>}


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
                ) : sortedMessages.length <= 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                        <div className="w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-gray-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No messages yet</h3>
                        <p className="text-sm text-gray-500 max-w-xs">
                            Be the first to share your thoughts about this course
                        </p>

                    </div>
                ) : sortedMessages.length <= 0 ? (

                    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                        <div className="w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-gray-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No messages yet</h3>
                        <p className="text-sm text-gray-500 max-w-xs">
                            Be the first to share your thoughts about this course
                        </p>
                    </div>)
                    : (
                        sortedMessages.map((msg: feedBackMsgSchema) => {
                            const canEdit = msg.editWindow && new Date() < new Date(msg.editWindow);
                            const isOwnMessage = usersFullname === msg.sender.fullName;
                            const likeCount = messageLikes[msg._id] || 0;
                            const isLiked = likedMessages[msg._id] || false;

                            return (
                                <div
                                    key={msg._id}
                                    className="group flex flex-col gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between w-full">
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0">
                                                <Image
                                                    src={msg.sender.profilePicture || "/default-avatar.png"}
                                                    alt={`${msg.sender.fullName}'s profile`}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover rounded-full w-10 h-10 border border-gray-200"
                                                    unoptimized
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <h1 className="font-semibold text-sm text-gray-900">
                                                        {msg.sender.fullName}
                                                    </h1>
                                                    {msg.isEdited && (
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Pencil2Icon className="w-3 h-3" />
                                                            Edited
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-700 mt-1">{msg.text}</p>
                                                <div className="flex items-center gap-3 mt-2 justify-between">
                                                    {/* Like Button - Hidden for own messages */}

                                                    <span className={`text-xs ${isLiked ? "text-gray-600 font-medium" : "text-gray-400"}`}>
                                                        {likeCount} {likeCount === 1 ? "like" : "likes"}
                                                    </span>
                                                    {!isOwnMessage && existingCourseData?.creator._id !== userId && (
                                                       
                                                        <button
                                                            onClick={() => handleLike(msg._id)}
                                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                                            aria-label={isLiked ? "Unlike" : "Like"}
                                                        >
                                                            <Heart
                                                                className={`w-4 h-4 transition-colors ${isLiked ? "text-red-600 fill-red-600" : "text-gray-400 hover:text-gray-500"} hover:cursor-pointer.`}
                                                            />
                                                        </button>
                                                    )}

                                                    <span className="text-xs text-gray-400  bordr-4 border-green-500 flex items-center justify-end">
                                                        {getTimeAgo(new Date(msg.createdAt))}
                                                        {msg.editedAt && (
                                                            <span className="ml-1.5">
                                                                • edited {getTimeAgo(new Date(msg.editedAt))}
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Edit/Delete - Only shown for own messages */}
                                        {isOwnMessage && (
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setTriggerMessageDeletion(true);
                                                        setGetDeleted(msg._id);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors  hover:cursor-pointer"
                                                    aria-label="Delete message"
                                                >
                                                    {isDeleting && getDeleted === msg._id ? (
                                                        <BasicSpinner />
                                                    ) : (
                                                        <Trash className="w-4 h-4" />
                                                    )}
                                                </button>
                                                {canEdit ? (
                                                    <button
                                                        onClick={() => {
                                                            setIsEditing(true);
                                                            setClickedMsg({ msgId: msg._id, msgContent: msg.text });
                                                        }}
                                                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors hover:cursor-pointer"
                                                        aria-label="Edit message"
                                                    >
                                                        <Pencil2Icon className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <div className="p-1 text-gray-400 mt-[1.4rem] cursor-not-allowed">
                                                        <XCircleIcon className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {canEdit && isOwnMessage && msg.editWindow && (
                                        <div className="text-xs text-gray-400 mt-1">
                                            Edit window: {Math.floor((new Date(msg.editWindow).getTime() - Date.now()) / 60000)}m left
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
            </div>
        </motion.div>
    );
};

export default FeedBackSidebar;


