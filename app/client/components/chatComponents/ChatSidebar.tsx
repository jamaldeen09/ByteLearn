"use client"
import { searchIcon } from "@/app/icons/Icons"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { PlusIcon } from "lucide-react"
import FriendFilters from "./FriendFilters"
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
import { FriendSchema } from "../../types/types"
import { getClickedFriendId, getClickedFriendInformation } from "@/app/redux/chatSlices/clickedFriend"
import BlackSpinner from "../reusableComponents/BlackSpinner"
import { events } from "../../utils/events"
import { socket } from "../../utils/config/io"
import { setMessages } from "@/app/redux/chatSlices/messagesSlice"

const ChatSidebar = (): React.ReactElement => {
  const [addfriendTrigger, setAddFriendTrigger] = useState<boolean>(false)
  const { redirectTo } = useRedirect()
  const dispatch = useAppDispatch()
  const friends = useAppSelector(state => state.friendsContainer.friends)
  const [fetchingFriends, setFetchingFriends] = useState<boolean>(false)
  const clickedFriend = useAppSelector(state => state.clickedFriend.id)

  // Memoized function to generate room ID
  const generateRoomId = useCallback(() => crypto.randomUUID(), [])

  // Fetch all friends
  useEffect(() => {
    setFetchingFriends(true);
    axios.get("/api/get-friends", { 
      headers: {"Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}`} 
    })
    .then((res) => {
      dispatch(getFriends(res.data.payload));
    })
    .catch((err: { response?: { status: number } }) => {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403 || err.response?.status === 404) {
        redirectTo("/client/auth/login");
        return;
      }
      toast.error('Server Error');
    })
    .finally(() => {
      setFetchingFriends(false);
    });
  }, [dispatch, redirectTo]);

  // Handle room creation and events
  useEffect(() => {
    if (!clickedFriend) return

    const data = {
      roomId: generateRoomId(),
      participantId: clickedFriend,
    }
    
    socket.emit(events.CREATE_ROOM, data)

    const handleChatroomFound = (data: any) => {
      if (data.information._id === clickedFriend) {
        dispatch(getClickedFriendInformation(data))
        dispatch(setMessages(data.messages))
      }
    }

    const handleChatroomCreated = (data: any) => {
      if (data.information._id === clickedFriend) {
        dispatch(getClickedFriendInformation(data))
        dispatch(setMessages(data.messages))
      }
    }

    socket.on(events.CHATROOM_FOUND, handleChatroomFound)
    socket.on(events.CHATROOM_CREATED, handleChatroomCreated)

    return () => {
      socket.off(events.CHATROOM_FOUND, handleChatroomFound)
      socket.off(events.CHATROOM_CREATED, handleChatroomCreated)
    }
  }, [clickedFriend, dispatch, generateRoomId])

  return (
    <div className="border border-gray-200 h-full col-span-5 overflow-hidden flex flex-col gap-6 relative basic-border">
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
        />
        <span className="text-gray-400 absolute text-sm top-7 left-9">{searchIcon}</span>
      </div>

      {/* Filters */}
      <div className="w-full flex items-center space-x-3 px-4">
        <FriendFilters />
        <FriendFilters />
        <FriendFilters />
        <FriendFilters />
      </div>

      {/* Chats Area */}
      <div className="w-full flex flex-col h-full overflow-hidden overflow-y-auto px-2 gap-4 py-4">
        {!friends ? (
          <div className="h-full centered-flex w-full"> 
            <BlackSpinner />
          </div>
        ) : friends?.map((friend: FriendSchema) => (
          <Friend 
            key={friend._id}
            friendImageUrl={friend.friendImageUrl}
            friendName={friend.friendName}
            bio={friend.bio}
            id={friend._id}
            createRoom={() => dispatch(getClickedFriendId(friend._id))}
            isActive={clickedFriend === friend._id}
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