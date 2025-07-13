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
import { IMessage } from "../../types/types";
import Image from "next/image";

const MainChatArea = () => {
  const { id: friendId, information: friendInfo } = useAppSelector(state => state.clickedFriend);
  const messages = useAppSelector(state => state.messages.messages)
  const currentUserId = useAppSelector(state => state.usersInformation._id);
  const currentUserAvatar = useAppSelector(state => state.usersInformation.avatar);
 
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messageSendEvent, setMessageSendEvent] = useState<boolean>(false);
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

  const removePreview = useCallback(() => {
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleSend = useCallback(() => {
    if (message.trim() || previewUrl) {
      setMessageSendEvent(true);
    }
  }, [message, previewUrl]);

  useEffect(() => {
    if (!messageSendEvent) return;
    
    const messageData = {  
      receiverId: friendId,
      content: message,
    }
    socket.emit(events.SEND_MESSAGE, messageData)

    const handleMessageHistory = ({ messages }: { messages: IMessage[] }) => {
      dispatch(setMessages(messages));
      setMessage("");
      setPreviewUrl(null);
      setMessageSendEvent(false)
    }

    const handleReceivedMessage = (data: { message: IMessage }) => {
      dispatch(addMessage(data.message));
      setMessage("");
      setPreviewUrl(null);
      setMessageSendEvent(false)
    }
    
    socket.on(events.MESSAGE_HISTORY, handleMessageHistory)
    socket.on(events.RECEIVED_MESSAGE, handleReceivedMessage)
    
    return () => {
      socket.off(events.SEND_MESSAGE)
      socket.off(events.MESSAGE_HISTORY, handleMessageHistory)
      socket.off(events.RECEIVED_MESSAGE, handleReceivedMessage)
    }
  }, [messageSendEvent, dispatch, friendId, message])

  return (
    <div className="h-full w-full border p-2 flex justify-between flex-col">
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
          <EllipsisVerticalIcon className="hover:cursor-pointer" />
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-full overflow-y-auto p-4 space-y-4">
        {messages.map((message: IMessage) => {
          const isCurrentUser = message.sender._id === currentUserId;
          
          return (
            <div 
              key={message._id} 
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Friend's message (left side) */}
              {!isCurrentUser && (
                <div className="flex items-end justify-end space-x-2 max-w-[80%]">
                  <Image
                    src={message.sender.avatar || "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"}
                    alt={message.sender.fullName}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                    unoptimized={true}
                  />
                  <div className="bg-gray-100 px-4 py-2 rounded-lg rounded-bl-none">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-gray-500 text-right mt-1">
                      {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )}

              {/* Your message (right side) */}
              {isCurrentUser && (
                <div className="flex items-end justify-end space-x-2 max-w-[80%] basic-border">
                  <div className="bg-black text-white px-4 py-2 rounded-lg rounded-br-none">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-blue-100 text-right mt-1">
                      {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <Image
                    src={currentUserAvatar || "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"}
                    alt="You"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                    unoptimized={true}
                  />
                </div>
              )}
            </div>
          );
        })}
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
                    <XIcon className="w-4 h-4"/>
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
              disabled={!message.trim() && !previewUrl}
              className="h-12 w-12 rounded-full bg-black text-white hover:bg-gray-800"
            >
              <PaperPlaneIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainChatArea