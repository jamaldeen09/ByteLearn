"use client"
import { searchIcon } from "@/app/icons/Icons"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { PlusIcon } from "lucide-react"
import Friend from "./Friend"
import AddFriendSidebar from "./AddFriendSidebar"
import { useState, useEffect, useCallback } from "react"
import NewFriendSidebar from "./NewFriendSidebar"
import axios from "../../utils/config/axios"
import toast from "react-hot-toast"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { getFriends } from "@/app/redux/informationSlices/friendInformation"
import { FriendSchema, IMessage } from "../../types/types"
import { getClickedFriendId, getClickedFriendInformation } from "@/app/redux/chatSlices/clickedFriend"
import { events } from "../../utils/events"
import { socket } from "../../utils/config/io"
import { setMessages } from "@/app/redux/chatSlices/messagesSlice"
import { setIsFriendsFalse, setIsFriendsTrue } from "@/app/redux/triggers/isFriendsTrigger"
import { useRouter } from "next/navigation"
import { useUnread } from "../../utils/context"
import { AxiosError } from "axios"


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

const formatTime = (date?: Date | string) => {
  if (!date) return "";
  const d = new Date(date);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};


const ChatSidebar = (): React.ReactElement => {
  const [addfriendTrigger, setAddFriendTrigger] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const friends = useAppSelector(state => state.friendsContainer.friends)

  const { setTotalUnread } = useUnread();


  const clickedFriend = useAppSelector(state => state.clickedFriend.id)
  const [roomId, setRoomId] = useState<string | null>(null);

  const [unreadMessages, setUnreadMessages] = useState<Record<string, number>>({});

  const [isLoadingFriends, setIsLoadingFriends] = useState<boolean>(true);
  const [showFriends, setShowFriends] = useState<boolean>(true);
  const router = useRouter()



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
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof AxiosError) {
          if (
            err.response?.status === 401 ||
            err.response?.status === 403 ||
            err.response?.status === 404
          ) {
            router.push("/client/auth/login");
          } else {
            toast.error("Server Error");
          }
        } else {
          console.error('Unexpected error', err);
        }
      } finally {
        setIsLoadingFriends(false);
      }
    };

    fetchFriends();
  }, [dispatch, router]);

  const fetchChatNotifications = useCallback(() => {
    axios.get("/api/unread-messages", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }
    }).then((res) => {
      // Directly use the unreadCounts from backend

      if (res.data && res.data.success && res.data.unreadCounts) {
        setUnreadMessages(prev => {
          return { ...prev, ...res.data.unreadCounts };
        });
      } else {
        setUnreadMessages({});
      }
    }).catch((err) => {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.push("/client/auth/login");
      }
      toast.error("A server error occurred. Please bare with us");
    });
  }, [router]);

  useEffect(() => {
    // Initial fetch
    fetchChatNotifications();

    // Refresh every 30 seconds
    const interval = setInterval(fetchChatNotifications, 30000);

    return () => clearInterval(interval);
  }, [fetchChatNotifications]);


  const handleCreateRoom = useCallback((id: string) => {
    dispatch(getClickedFriendId(id));

    // Optimistically clear unread messages for that friend
    setUnreadMessages(prev => {
      const newUnreads = { ...prev };
      delete newUnreads[id];
      return newUnreads;
    });
  }, [dispatch]);



  useEffect(() => {
    if (clickedFriend && roomId) {
      socket.emit(events.MARK_MESSAGES_AS_READ, {
        roomId,
        friendId: clickedFriend
      });
    }
  }, [clickedFriend, roomId]);

  useEffect(() => {
    const handleMessagesMarkedAsRead = ({ friendId }: { friendId: string }) => {
      setUnreadMessages(prev => {
        const newUnreads = { ...prev };
        const removedCount = newUnreads[friendId] || 0;

        if (removedCount) {
          delete newUnreads[friendId];


          setTimeout(() => {
            setTotalUnread(prevTotal => Math.max(prevTotal - removedCount, 0));
          }, 0);
        }

        return newUnreads;
      });
    };

    socket.on(events.MESSAGES_MARKED_AS_READ, handleMessagesMarkedAsRead);

    return () => {
      socket.off(events.MESSAGES_MARKED_AS_READ, handleMessagesMarkedAsRead);
    };
  }, [setTotalUnread]);

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
  }, [clickedFriend, dispatch, generateRoomId, setTotalUnread])

  const [friendSearch, setFriendSearch] = useState<string>("")
  const foundFriends: FriendSchema[] = friends.filter((friend) => friend.friendName.includes(friendSearch));

  return (
    <div
      className="lg:rounded-tr-2xl lg:rounded-br-2xl h-full col-span-5 overflow-hidden flex flex-col gap-6 relative border-t border-r border-b  border-gray-200
      "
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
      {/* Modern Filter Buttons with Active States */}
      <div className="w-full flex items-center space-x-2 px-4 pb-2 py-3">
        <button
          onClick={() => {
            setShowFriends(true);

          }}
          className={`text-sm font-medium rounded-full px-4 py-1.5 transition-all duration-200 whitespace-nowrap ${showFriends
            ? 'bg-black dark:bg-white text-white dark:text-black'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white'
            }`}
        >
          Friends
        </button>

      </div>

      {/* Chats Area */}
      <div className="w-full flex flex-col h-full overflow-hidden overflow-y-auto px-2 gap-4 py-4">
        {isLoadingFriends ? (
          <div className="h-full w-full">
            <div className="flex items-center space-x-2 animate-pulse px-4 py-4 rounded-3xl bg-gray-100 dark:bg-gray-800">
              {/* Profile Picture Skeleton */}
              <div className="w-16 h-14 rounded-full bg-gray-300 dark:bg-gray-700" />

              {/* Info Skeleton */}
              <div className="flex flex-col justify-between w-full gap-2">
                {/* Name + Time */}
                <div className="flex justify-between items-center">
                  <div className="w-32 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="w-10 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
                {/* Message + Count */}
                <div className="flex justify-between items-center">
                  <div className="w-40 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="w-7 h-7 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        ) : friends.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full"></div>
              <div className="relative flex items-center justify-center w-full h-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-700">No friends yet</h3>
              <p className="text-gray-500 max-w-md">
                Start building your network by adding friends
              </p>
            </div>

            <button
              onClick={() => setAddFriendTrigger(true)}
              className="mt-4 px-6 py-2 bg-white text-gray-800 border border-gray-300 hover:cursor-pointer rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 shadow-sm"
            >
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
                className="text-gray-600"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Friends
            </button>
          </div>
        ) : (
          <>
            {foundFriends
              ? foundFriends.map((friend: FriendSchema) => (
                <Friend
                  key={friend._id}
                  friendImageUrl={friend.friendImageUrl}
                  friendName={friend.friendName}
                  bio={friend.bio}
                  id={friend._id}
                  createRoom={() => handleCreateRoom(friend._id)}
                  isActive={clickedFriend === friend._id}
                  unreadMessages={unreadMessages[friend._id] || 0}
                  previousMessage={friend.lastMessage?.content}
                  timePreviousMsgWasSent={formatTime(friend.lastMessage?.sentAt)}
                />
              ))
              : friends.map((friend: FriendSchema) => (
                <Friend
                  key={friend._id}
                  friendImageUrl={friend.friendImageUrl}
                  friendName={friend.friendName}
                  bio={friend.bio}
                  id={friend._id}
                  createRoom={() => handleCreateRoom(friend._id)}
                  isActive={clickedFriend === friend._id}
                  unreadMessages={unreadMessages[friend._id] || 0}
                  previousMessage={friend.lastMessage.content ? friend.lastMessage.content : ""}
                  timePreviousMsgWasSent={formatTime(friend.lastMessage?.sentAt)}
                />
              ))}

          </>
        )}
      </div>

      {/* Sidebar components */}
      <AddFriendSidebar
        triggerAddFriend={addfriendTrigger}
        setTriggerAddFriend={setAddFriendTrigger}
      />
      <NewFriendSidebar />

    </div>
  )
}

export default ChatSidebar
