"use client"

import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaperPlaneIcon, FaceIcon } from "@radix-ui/react-icons";
import { EllipsisVerticalIcon, PaperclipIcon, XIcon } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { socket } from "../../utils/config/io";
import { events } from "../../utils/events";
import { addMessage, setMessages } from "@/app/redux/chatSlices/messagesSlice";
import { ChatDropDownData, IMessage } from "../../types/types";
import Image from "next/image";
import ProperDropdown from "../reusableComponents/ProperDropdown";
import ProfileViewSidebar from "../reusableComponents/ProfileViewSidebar";
import axios from "../../utils/config/axios"
import WhiteSpinner from "../reusableComponents/WhiteSpinner";
import ImageView from "../reusableComponents/ImageView";


const MainChatArea = () => {
  const { id: friendId, information: friendInfo } = useAppSelector(state => state.clickedFriend);
  const messages = useAppSelector(state => state.messages.messages)
  const currentUserId = useAppSelector(state => state.usersInformation._id);
  const currentUserAvatar = useAppSelector(state => state.usersInformation.avatar);
  const currentUserFullname = useAppSelector(state => state.usersInformation.fullName)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messageSendEvent, setMessageSendEvent] = useState<boolean>(false);
  const isFriends = useAppSelector(state => state.isFriends.isFriends)
  const [removeFriendEvent, setRemoveFriendEvent] = useState<boolean>(false);
  const [profileViewSidebar, setProfileViewSidebar] = useState<boolean>(false)
  const [isSending, setIsSending] = useState(false);
  const [imgViewTrigger, setImgViewTrigger] = useState<boolean>(false);


  const dropDownData: ChatDropDownData[] = [
    {
      name: "View Profile", clickFunc: () => {
        setProfileViewSidebar(true);
      }
    },
    {
      name: "Remove friend", clickFunc: () => {
        setRemoveFriendEvent(true)
      }
    }
  ]

  const dispatch = useAppDispatch()

  const handleEmojiClick = useCallback((emojiData: EmojiClickData) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file); // must match 'upload.single("image")'

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
    if (!message.trim() && !previewUrl) return;

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

    dispatch(addMessage(newMessage));

    socket.emit(events.SEND_MESSAGE, {
      receiverId: friendId,
      content: message,
      imageUrl,
    });

    setMessage("");
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [message, previewUrl, dispatch]);

  useEffect(() => {
    if (!messageSendEvent) return;
    setIsSending(true);

    const handleMessageHistory = ({ messages }: { messages: IMessage[] }) => {
      dispatch(setMessages(messages));

      setMessage("");
      setPreviewUrl(null);
      setMessageSendEvent(false);
    };

    const handleReceivedMessage = (data: { message: IMessage }) => {
      dispatch(addMessage(data.message));
      setMessageSendEvent(false);

      setMessage("");
      setPreviewUrl(null);
      try {
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsSending(false);
      }
    };

    socket.on(events.MESSAGE_HISTORY, handleMessageHistory);
    socket.on(events.RECEIVED_MESSAGE, handleReceivedMessage);

    return () => {
      socket.off(events.MESSAGE_HISTORY, handleMessageHistory);
      socket.off(events.RECEIVED_MESSAGE, handleReceivedMessage);
    };
  }, [messageSendEvent, dispatch]);


  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const data = {
      friendId
    }
    socket.emit(events.REMOVE_FRIEND, data);
    socket.on(events.REMOVED_FRIEND, () => {
      setRemoveFriendEvent(false);
      return;
    })

    return () => {
      socket.off(events.REMOVE_FRIEND)
      socket.off(events.REMOVED_FRIEND)
    }
  }, [removeFriendEvent])


  return (
    !friendInfo ? (
      <div
        className="w-full h-full border col-centered gap-4"
      >
        <Image
          src="/manSeated.jpg"
          alt="An illustration of a man seating while using his laptop"
          width={500}
          height={500}
          priority={true}
        />
        <p className="text-sm text-gray-400">Ready to chat with friends?</p>
      </div>
    ) : !isFriends ? (
      <div
        className="h-full w-full border centered-flex"
      >
        <p className="text-sm text-gray-400">
          You and this user are no longer friends
        </p>
      </div>
    ) :
      <div className="h-full w-full border px-2 flex flex-col">
        {/* header */}
        <div className="w-full bg-gray-100 h-20 rounded-lg flex items-center justify-between space-x-4 px-4">
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
              <h1 className="font-extrabold">{friendInfo?.fullName}</h1>
              <p className="text-gray-400 text-xs">{friendInfo?.isOnline ? "online" : "offline"}</p>
            </div>
          </div>

          <div className="fit">
            <ProperDropdown
              dropdownTitle={friendInfo?.fullName}
              dropdownItems={dropDownData}
            >
              <EllipsisVerticalIcon className="hover:cursor-pointer" />
            </ProperDropdown>
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
                          <p className="text-xs text-gray-500 text-right mt-1">
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
                        <div className="bg-black px-4 py-2 rounded-lg rounded-bl-none text-white">
                          {message.content && (
                            <p className="text-sm">{message.content}</p>
                          )}
                          <p className="text-xs text-gray-500 text-right mt-1">
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

            <div className="flex items-center gap-2 h-16">
              {/* Input Container */}
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <FaceIcon className="h-5 w-5" />
                </button>

                {/* Input Field */}
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="pl-10 pr-12 h-12 rounded-full"
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

              {/* Send Button (outside input) */}
              <Button
                onClick={handleSend}
                disabled={(!message.trim() && !previewUrl) || isSending}
                className="h-12 w-12 rounded-full bg-black text-white hover:bg-gray-800"
              >
                {isSending ? (
                  <WhiteSpinner />
                ) : (
                  <PaperPlaneIcon className="h-5 w-5" />
                )}
              </Button>
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
        />
      </div>
  )
}

export default MainChatArea