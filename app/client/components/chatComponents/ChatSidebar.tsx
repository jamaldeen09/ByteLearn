"use client"
import { searchIcon } from "@/app/icons/Icons"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { PlusIcon } from "lucide-react"
import Friend from "./Friend"
import AddFriendSidebar from "./AddFriendSidebar"
import { useState, useEffect, useCallback } from "react"
import NewFriendSidebar from "./NewFriendSidebar"
import AddGroupTrigger from "./AddGroupTrigger"
import axios from "../../utils/config/axios"
import { useRedirect } from "../../utils/utils"
import toast from "react-hot-toast"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { getFriends } from "@/app/redux/informationSlices/friendInformation"
import { FriendSchema, IMessage } from "../../types/types"
import { getClickedFriendId, getClickedFriendInformation } from "@/app/redux/chatSlices/clickedFriend"
import BlackSpinner from "../reusableComponents/BlackSpinner"
import { events } from "../../utils/events"
import { socket } from "../../utils/config/io"
import { setMessages } from "@/app/redux/chatSlices/messagesSlice"
import { setIsFriendsFalse, setIsFriendsTrue } from "@/app/redux/triggers/isFriendsTrigger"
import Image from "next/image"

interface ChatroomData {
  information: {
    _id: string;
    fullName: string,
    isOnline: boolean,
    avatar: string,
    bio: string,
  };
  messages: IMessage[];
  roomId: string;
}

const ChatSidebar = (): React.ReactElement => {
  const [addfriendTrigger, setAddFriendTrigger] = useState<boolean>(false)
  const { redirectTo } = useRedirect()
  const dispatch = useAppDispatch()
  const friends = useAppSelector(state => state.friendsContainer.friends)
  const clickedFriend = useAppSelector(state => state.clickedFriend.id)
  const [roomId, setRoomId] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [isLoadingFriends, setIsLoadingFriends] = useState<boolean>(true);


  // Memoized function to generate room ID
  const generateRoomId = useCallback(() => crypto.randomUUID(), [])

  // Fetch all friends
  useEffect(() => {
    const fetchFriends = async () => {
      setIsLoadingFriends(true);
      try {
        const res = await axios.get("/api/get-friends", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bytelearn_token")}`,
          },
        });
        dispatch(getFriends(res.data.payload));
      } catch (err: any) {
        console.error(err);
        if (
          err.response?.status === 401 ||
          err.response?.status === 403 ||
          err.response?.status === 404
        ) {
          redirectTo("/client/auth/login");
        } else {
          toast.error("Server Error");
        }
      } finally {
        setIsLoadingFriends(false);
      }
    };

    fetchFriends();
  }, []);

  // Handle room creation and events
  useEffect(() => {
    if (clickedFriend && roomId) {
      socket.emit(events.MARK_MESSAGES_AS_READ, {
        roomId,
        friendId: clickedFriend
      });
    }
  }, [clickedFriend, roomId]);

  useEffect(() => {
    const handleMessagesMarkedAsRead = ({ roomId: incomingRoomId, messages }: { roomId: string, messages: IMessage[] }) => {
      if (incomingRoomId !== roomId) return;
      setUnreadMessages(messages.length);
    };

    socket.on(events.MESSAGES_MARKED_AS_READ, handleMessagesMarkedAsRead);

    return () => {
      socket.off(events.MESSAGES_MARKED_AS_READ, handleMessagesMarkedAsRead);
    };
  }, [roomId]);


  useEffect(() => {
    if (!clickedFriend) return

    const data: { roomId: string, participantId: string } = {
      roomId: generateRoomId(),
      participantId: clickedFriend,
    }

    socket.emit(events.CREATE_ROOM, data)

    const handleChatroomFound = (data: ChatroomData) => {
      if (data.information._id === clickedFriend) {
        dispatch(getClickedFriendInformation(data))
        dispatch(setMessages(data.messages))
        setRoomId(data?.roomId || null)
      }
    }

    const handleChatroomCreated = (data: ChatroomData) => {
      if (data.information._id === clickedFriend) {
        dispatch(getClickedFriendInformation(data))
        dispatch(setMessages(data.messages))
        setRoomId(data?.roomId || null)
      }
    }
    socket.on(events.NO_LONGER_FRIENDS, ({ isFriends }: { isFriends: boolean }) => {
      if (isFriends) {
        dispatch(setIsFriendsTrue())
      } else {
        dispatch(setIsFriendsFalse());
      }
      return;
    })
    socket.on(events.CHATROOM_FOUND, handleChatroomFound)
    socket.on(events.CHATROOM_CREATED, handleChatroomCreated)

    return () => {
      socket.off(events.CHATROOM_FOUND, handleChatroomFound)
      socket.off(events.CHATROOM_CREATED, handleChatroomCreated)
    }
  }, [clickedFriend, dispatch, generateRoomId])

  const [friendSearch, setFriendSearch] = useState<string>("")
  const foundFriends: FriendSchema[] = friends.filter((friend) => friend.friendName.includes(friendSearch));


  return (
    <div
      className="border border-gray-200 h-full col-span-5 overflow-hidden flex flex-col gap-6 relative basic-border"
    >

      {/* Heading */}
      <div className="w-full flex items-center justify-between mt-6 px-4">
        <h1 className="font-bold text-xl">Chats</h1>
        <motion.button
          className="rounded-full w-8 h-8 centered-flex bg-black text-white"
          whileHover={{ scale: 1.09, cursor: "pointer", filter: "brightness(90%)" }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3, type: "spring", damping: 10, stiffness: 100 }}
          onClick={() => setAddFriendTrigger(true)}
        >
          <PlusIcon />
        </motion.button>
      </div>

      {/* Input field */}
      <div className="w-full relative px-4 border-b border-gray-200 py-4">
        <Input
          placeholder="Search by name"
          type="text"
          className="h-12 rounded-full bg-gray-50 px-16"
          value={friendSearch}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFriendSearch(e.target.value)}
        />
        <span className="text-gray-400 absolute text-sm top-7 left-9">{searchIcon}</span>
      </div>

      {/* Filters */}
      <div className="w-full flex items-center space-x-3 px-4">

      </div>

      {/* Chats Area */}
      <div className="w-full flex flex-col h-full overflow-hidden overflow-y-auto px-2 gap-4 py-4">
        {isLoadingFriends ? (
          <div className="h-full w-full centered-flex">
            <BlackSpinner />
          </div>
        ) : friends.length === 0 ? (
          // Show empty state
          <div className="h-full col-centered gap-2 w-full text-center">
            <Image
              src="https://media.istockphoto.com/id/1443485971/video/animated-greeting-man-character.jpg?s=640x640&k=20&c=TiAalsG2gyOQk_XptDUocQigdIEtbYH8D1u9ReU9RaQ="
              alt="An Illustration of a 2d male character waving"
              width={400}
              height={400}
              className="w-auto h-auto"
              priority={true}
              unoptimized={true}
            />
            <p className="text-gray-400 text-xs">No friends? Click the plus button to add some friends!</p>
          </div>
        ) : foundFriends ? foundFriends?.map((friend: FriendSchema) => (
          <Friend
            key={friend._id}
            friendImageUrl={friend.friendImageUrl}
            friendName={friend.friendName}
            bio={friend.bio}
            id={friend._id}
            createRoom={() => dispatch(getClickedFriendId(friend._id))}
            isActive={clickedFriend === friend._id}
            unreadMessages={unreadMessages}
            previousMessage={friend.lastMessage?.content}
            timePreviousMsgWasSent={new Date(friend.lastMessage?.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          />
        )) : friends?.map((friend: FriendSchema) => (
          <Friend
            key={friend._id}
            friendImageUrl={friend.friendImageUrl}
            friendName={friend.friendName}
            bio={friend.bio}
            id={friend._id}
            createRoom={() => dispatch(getClickedFriendId(friend._id))}
            isActive={clickedFriend === friend._id}
            unreadMessages={unreadMessages}
            previousMessage={friend.lastMessage.content}
            timePreviousMsgWasSent={new Date(friend.lastMessage.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          />
        ))}
      </div>

      {/* Sidebar components */}
      <AddFriendSidebar
        triggerAddFriend={addfriendTrigger}
        setTriggerAddFriend={setAddFriendTrigger}
      />
      <NewFriendSidebar />
      <AddGroupTrigger />
    </div>
  )
}

export default ChatSidebar

