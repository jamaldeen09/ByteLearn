"use client"

import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaperPlaneIcon, FaceIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { EllipsisVerticalIcon, PaperclipIcon, XIcon } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { socket } from "../../utils/config/io";
import { events } from "../../utils/events";
import { addMessage, replaceMessage, setMessages } from "@/app/redux/chatSlices/messagesSlice";
import { ChatDropDownData, IMessage } from "../../types/types";
import Image from "next/image";
import ProperDropdown from "../reusableComponents/ProperDropdown";
import ProfileViewSidebar from "../reusableComponents/ProfileViewSidebar";
import axios from "../../utils/config/axios"
import WhiteSpinner from "../reusableComponents/WhiteSpinner";
import ImageView from "../reusableComponents/ImageView";
import ImagePreviewComponent from "../reusableComponents/ImagePreviewComponent";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getFriends, removeFriend } from "@/app/redux/informationSlices/friendInformation";
import { getClickedFriendId, resetClickedFriend } from "@/app/redux/chatSlices/clickedFriend";
import { motion } from "framer-motion";
import BlackOrbitalLoader from "../reusableComponents/OrbitalLoader";
import { useUnread } from "../../utils/context";


const MainChatArea = () => {
  const { id: friendId, information: friendInfo } = useAppSelector(state => state.clickedFriend);
  const messages = useAppSelector(state => state.messages.messages)
  const currentUserId = useAppSelector(state => state.usersInformation._id);
  const currentUserAvatar = useAppSelector(state => state.usersInformation.avatar);
  const currentUserFullname = useAppSelector(state => state.usersInformation.fullName)
  const friends = useAppSelector(state => state.friendsContainer.friends)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter()

  const { setTotalUnread } = useUnread();

  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messageSendEvent, setMessageSendEvent] = useState<boolean>(false);
  const [profileViewSidebar, setProfileViewSidebar] = useState<boolean>(false)
  const [isSending, setIsSending] = useState(false);
  const [imgViewTrigger, setImgViewTrigger] = useState<boolean>(false);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const [renderEmptyState, setRenderEmptyState] = useState<boolean>(false)
  const [disableSendBtn, setDisabledSendBtn] = useState<boolean>(true);

  const dropDownData: ChatDropDownData[] = [
    {
      name: "View Profile", clickFunc: () => {
        setProfileViewSidebar(true);
      }
    },
    {
      name: "Remove friend", clickFunc: () => {
        handleRemoveFriend(friendInfo._id)
      }
    }
  ]

  const dispatch = useAppDispatch()
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleTyping = (text: string) => {
    setMessage(text);

    socket.emit(events.TYPING, { receiverId: friendId });

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      socket.emit(events.STOP_TYPING, { receiverId: friendId });
    }, 2000)

    setTypingTimeout(timeout);
  };


  const handleEmojiClick = useCallback((emojiData: EmojiClickData) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  }, []);

  // const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file && file.type.startsWith('image/')) {
  //     setPreviewUrl(URL.createObjectURL(file));
  //     setDisabledSendBtn(false);
  //   }
  // }, []);
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    return axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log('Upload success:', response.data);
        return response.data.url;
      })
      .catch((error) => {
        console.error('Upload failed:', error.response?.data || error.message);
        throw error;
      });

  };


  const removePreview = useCallback(() => {
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleSend = useCallback(async () => {
    if (!message.trim() && !previewUrl) {
      return;
    };

    setIsSending(true);

    let imageUrl = null;
    if (fileInputRef.current?.files?.[0]) {
      imageUrl = await handleFileUpload(fileInputRef.current.files[0]);
    }
    const tempId = Date.now().toString();
    const now = new Date().toISOString();

    const newMessage: IMessage = {
      _id: tempId,
      sender: { _id: currentUserId, avatar: currentUserAvatar, fullName: currentUserFullname },
      receiver: { _id: friendInfo?._id!, avatar: friendInfo?.avatar, fullName: friendInfo?.fullName! },
      content: message,
      imageUrl,
      sentAt: now,
      status: "sent",
      roomId: "",
    };
    setIsSending(false);
    dispatch(addMessage(newMessage));

    socket.emit(events.SEND_MESSAGE, {
      receiverId: friendId,
      content: message,
      imageUrl,
    });

    setMessage("");
    setPreviewUrl(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
    return () => {
      socket.off(events.SEND_MESSAGE)
    }
  }, [
    message,
    previewUrl,
    dispatch,
    fileInputRef,
    currentUserId,
    currentUserAvatar,
    currentUserFullname,
    friendInfo,
    friendId
  ]);

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const token = localStorage.getItem("bytelearn_token");
      const response = await axios.delete(`/api/friends/${friendId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Friend removed successfully");


        dispatch(removeFriend(friendId));
        dispatch(setMessages([]));
        dispatch(getClickedFriendId(""));
        fetchFriends();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove friend");
    }
  };



  const fetchFriends = () => {
    axios.get("/api/get-friends", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }
    }).then((res) => {
      dispatch(getFriends(res.data.payload));
    }).catch((err) => {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403 || err.response?.status === 404) {
        router.push("/client/auth/login");
        return;
      }
      toast.error('Server Error');
    })
  };
  useEffect(() => {
    const handleTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === friendId) {
        setIsFriendTyping(true);

        setTimeout(() => {
          setIsFriendTyping(false);
        }, 2500);
      }
    };

    const handleStopTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === friendId) {
        setIsFriendTyping(false);
      }
    };

    socket.on(events.TYPING, handleTyping);
    socket.on(events.STOP_TYPING, handleStopTyping);

    return () => {
      socket.off(events.TYPING, handleTyping);
      socket.off(events.STOP_TYPING, handleStopTyping);
    };
  }, [friendId]);

  useEffect(() => {
    if (!messageSendEvent) return;
    setLoadingMessages(true);

    const handleMessageHistory = ({ messages }: { messages: IMessage[] }) => {
      dispatch(setMessages(messages));
      setMessage("");
      setPreviewUrl(null);
      setMessageSendEvent(false);
      setLoadingMessages(false);
    };

    socket.on(events.MESSAGE_HISTORY, handleMessageHistory);

    return () => {
      socket.off(events.MESSAGE_HISTORY, handleMessageHistory);
    };
  }, [messageSendEvent, dispatch]);

  const messagesRef = useRef<IMessage[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    let gotMessages: IMessage[] = []
    const handleReceivedMessage = (data: { message: IMessage }) => {
      const incoming = data.message;
      gotMessages.push(data.message);


      // Ignore if from current user
      if (String(incoming.sender._id) === String(currentUserId)) return;

      setTotalUnread((prev) => prev + 1);
      // Replace temp message if it matches content + time + sender
      const matchIndex = messagesRef.current.findIndex(msg =>
        msg.content === incoming.content &&
        new Date(msg.sentAt).getTime() === new Date(incoming.sentAt).getTime() &&
        msg.sender._id === incoming.sender._id &&
        msg.receiver._id === incoming.receiver._id
      );

      if (matchIndex !== -1) {
        dispatch(replaceMessage({ index: matchIndex, newMessage: incoming }));
      } else {
        dispatch(addMessage(incoming));
      }
    };
    socket.on(events.RECEIVED_MESSAGE, handleReceivedMessage);

    return () => {
      socket.off(events.RECEIVED_MESSAGE);
    };
  }, [currentUserId]);


  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, dispatch]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && messages.length > 0) {

      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [messages]);




  useEffect(() => {
    const shouldEnable = message.trim() !== "" || previewUrl !== null;
    setDisabledSendBtn(!shouldEnable);
  }, [message, previewUrl]);

  useEffect(() => {
    if (friendId) {
      setLoadingMessages(true);

      setTimeout(() => {
        setLoadingMessages(false)
        setRenderEmptyState(false)
      }, 2000)
    } else {
      setRenderEmptyState(true)
    }
  }, [friendId])

  return (
    loadingMessages ? (
      <div
        className="centered-flex h-screen w-full border lg:rounded-2xl border-gray-300"
      >
        <BlackOrbitalLoader />
      </div>
    ) : renderEmptyState ? (
      <div className="w-full h-screen lg:rounded-2xl bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="relative w-64 h-64 mb-6">
          <div className="absolute inset-0 bg-white rounded-full shadow-sm"></div>
          <div className="relative flex items-center justify-center w-full h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="96"
              height="96"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-300"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <circle cx="9" cy="9" r="1" fill="currentColor"></circle>
              <circle cx="15" cy="9" r="1" fill="currentColor"></circle>
            </svg>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-medium text-gray-700">No conversation selected</h3>
          <p className="text-gray-400 max-w-md">
            Choose a friend from your list to start messaging
          </p>
        </div>

        <div className="mt-8 w-full max-w-xs border-t border-gray-200 pt-6 flex justify-center">
          <div className="flex items-center space-x-1 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span className="text-sm">Add new friend</span>
          </div>
        </div>
      </div>
    ) :
      <div className="w-full border px-2 py-2 flex flex-col h-full lg:rounded-2xl">
        {/* header */}
        <div className="w-full bg-gradient-to-br from-black to-black/70 text-white h-20 rounded-3xl flex items-center justify-between space-x-4 px-4
        shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center space-x-2">
            <Image
              src={friendInfo?.avatar || "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"}
              alt={`${friendInfo?.fullName}'s profile picture`}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
              unoptimized={true}
            />

            <div className="flex flex-col">
              <h1 className="font-extrabold text-[0.8rem] sm:text-[1rem]">{friendInfo?.fullName}</h1>
              <p className="text-gray-400 text-xs">{isFriendTyping
                ? "typing..."
                : friendInfo?.isOnline
                  ? "online"
                  : "offline"}</p>
            </div>
          </div>

          <div className="fit flex items-center space-x-4">
            <ProperDropdown
              dropdownTitle={friendInfo?.fullName}
              dropdownItems={dropDownData}
            >
              <EllipsisVerticalIcon className="hover:cursor-pointer" />
            </ProperDropdown>
            <button
              className="bg-white text-back rounded-full w-5 h-5 justify-center items-center hover:scale-105 active:scale-90 duration-300 hover:cursor-pointer flex lg:hidden"
            >
              <ArrowLeftIcon onClick={() => {
                dispatch(resetClickedFriend());
              }} className="text-black" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="overflow-hidden h-[70vh]">
          <div ref={scrollContainerRef} className="h-full overflow-y-auto p-4 space-y-4">
            {messages.map((message: IMessage) => {
              const isCurrentUser = message.sender?._id === currentUserId;

              return (
                <div
                  key={message._id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Friend's message (left side) */}
                  {!isCurrentUser && (
                    <div className="flex flex-col items-start space-y-1 max-w-[80%]">
                      {/* Message image (if exists) */}
                      {message?.imageUrl && (
                        <Image
                          src={message?.imageUrl}
                          alt="Message image"
                          width={200}
                          height={200}
                          className="rounded-lg object-cover border border-gray-200"
                          unoptimized={true}
                        />
                      )}

                      {/* Message row with avatar and content */}
                      <div className="flex items-end space-x-2">
                        <Image
                          src={message.sender?.avatar || "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"}
                          alt={message.sender?.fullName}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                          unoptimized={true}
                        />
                        <div className="bg-gray-100 px-4 py-2 rounded-lg rounded-bl-none">
                          {message.content && (
                            <p className="text-sm">{message.content}</p>
                          )}
                          <p className="text-xs text-black text-right mt-1">
                            {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>)}


                  {/* Your message (right side) */}
                  {isCurrentUser && (
                    <div className="flex flex-col items-start space-y-1 max-w-[80%]">
                      {/* Message image (if exists) */}
                      {message?.imageUrl && (
                        <Image
                          src={message.imageUrl}
                          alt="Message image"
                          width={200}
                          height={200}
                          className="rounded-lg object-cover border border-gray-200"
                          unoptimized={true}
                        />
                      )}

                      {/* Message row with avatar and content */}
                      <div className="flex items-end space-x-2">
                        <Image
                          src={message.sender?.avatar || "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"}
                          alt={message.sender?.fullName}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                          unoptimized={true}
                        />
                        <div className="bg-gradient-to-br from-black to-black/70 px-4 py-2 rounded-lg rounded-bl-none text-white">
                          {message.content && (
                            <p className="text-sm">{message.content}</p>
                          )}
                          <p className="text-xs text-white text-right mt-1">
                            {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>)}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="relative p-4">
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-20 left-4 z-10">
                <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={350} />
              </div>
            )}

            <div className="flex items-center gap-2 iphone:h-18 sm:h-16">
              {/* Input Container */}
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute left-3 top-6 sm:top-6 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <FaceIcon className="h-5 w-5" />
                </button>


                {/* Desktop Input */}
                <Input
                  value={message}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (!disableSendBtn || previewUrl)) {
                      handleSend();
                    }
                  }}
                  placeholder="Type a message..."
                  className="pl-10 pr-12 h-12 rounded-full hidden sm:block"
                />

                {/* Mobile Input */}
                <Input
                  value={message}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (!disableSendBtn || previewUrl)) {
                      handleSend();
                    }
                  }}
                  placeholder="message..."
                  className="pl-10 pr-12 h-12 rounded-full block sm:hidden"
                />

                {/* File Preview (inside input, right side) */}
                {previewUrl && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-md object-cover border border-gray-200"
                      unoptimized={true}
                    />
                    <button
                      onClick={removePreview}
                      className="ml-1 text-red-500 hover:text-red-700 text-sm hover:cursor-pointer"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}

              </div>

              {/* File Upload Button (outside input) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="h-12 w-12 rounded-full"
              >
                <PaperclipIcon className="h-5 w-5" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </Button>



              {isSending ? (
                <button className={`bg-gray-300 h-12 w-12 rounded-full text-white cursor-not-allowed centered-flex`}>
                  <WhiteSpinner />
                </button>
              ) : (
                <motion.button
                  onClick={handleSend}
                  disabled={disableSendBtn}
                  whileHover={!disableSendBtn ? {
                    scale: 1.1,
                    filter: "brightness(80%)"
                  } : {}}
                  whileTap={!disableSendBtn ? { scale: 0.9 } : {}}
                  transition={{ duration: 0.3, type: "spring", damping: 10, stiffness: 100 }}
                  className={`h-12 w-12 rounded-full ${disableSendBtn
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-br from-black to-black/70 hover:cursor-pointer"
                    } text-white centered-flex`}
                >
                  <PaperPlaneIcon className="h-5 w-5" />
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Profile view sidebar */}
        <ProfileViewSidebar
          fullName={friendInfo?.fullName}
          bio={friendInfo?.bio}
          trigger={profileViewSidebar}
          setTrigger={setProfileViewSidebar}
          avatar={friendInfo?.avatar}
          imgView={imgViewTrigger}
          triggerImgView={setImgViewTrigger}
        />

        {/* Image gallery sidebar */}
        <ImageView
          trigger={imgViewTrigger}
          setTrigger={setImgViewTrigger}
          galleryTrigger={imgViewTrigger}
          setGalleryTrigger={setImgViewTrigger}
          profileView={profileViewSidebar}
          setProfileView={setProfileViewSidebar}
        />

        {/* Image Preview */}
        <ImagePreviewComponent />
      </div>
  )
}
export default MainChatArea