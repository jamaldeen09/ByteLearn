import { useAppDispatch, useAppSelector } from '@/app/redux/essentials/hooks'
import { Input } from '@/components/ui/input'
import React, { useState, useEffect } from 'react'
import axios from "../../../utils/config/axios"
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { NotificationSchema, NotifSenderInformationSchema } from '@/app/client/types/types'
import { getNotifications } from '@/app/redux/chatSlices/notificationSlice'
import BlackSpinner from '@/app/client/components/reusableComponents/BlackSpinner'
import { getTimeAgo } from '@/app/client/utils/utils'
import { socket } from "../../../utils/config/io"
import { events } from '@/app/client/utils/events'
import { Trash2Icon } from 'lucide-react'
import { generateFriendRequest } from '@/app/server/utils/utils'
import { AnimatePresence, motion } from 'framer-motion'


const Inbox = () => {
  const notifications = useAppSelector(state => state.notificationContainer.notifications)
  const [isNotifClicked, setIsNotifClicked] = useState<string | null>("");
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [fireEvent, setFireEvent] = useState<boolean>(false);
  const [notifSender, setNotifSender] = useState<NotifSenderInformationSchema>();

  useEffect(() => {
    if (!isNotifClicked) return;

    const data = {
      notifId: isNotifClicked
    };

    // Clean up any previous listeners first
    socket.off(events.CHANGED_TO_SEEN);
    socket.off(events.NOT_ALLOWED);

    socket.emit(events.SEEN_NOTIFICATION, data);

    const handleChangedToSeen = ({ notifSender }: any) => {
      setFireEvent(false);
      fetchNotifs();
      setNotifSender(notifSender);
    };

    const handleNotAllowed = ({ notifSender }: any) => {
      setNotifSender(notifSender);
    };

    socket.on(events.CHANGED_TO_SEEN, handleChangedToSeen);
    socket.on(events.NOT_ALLOWED, handleNotAllowed);

    return () => {
      socket.off(events.CHANGED_TO_SEEN, handleChangedToSeen);
      socket.off(events.NOT_ALLOWED, handleNotAllowed);
    };
  }, [fireEvent, isNotifClicked]);
  useEffect(() => {
    socket.on(events.FRIEND_REQUEST_ACCEPTED, ({ notification }) => {
      // Update the specific notification in your state
      const updatedNotifications = notifications.map(notif =>
        notif._id === notification._id ? notification : notif
      );

      dispatch(getNotifications(updatedNotifications));

      // Update the currently viewed notification if it's the one being accepted
      if (isNotifClicked === notification._id) {
        setNotifSender({
          fullName: notification.sender.fullName,
          avatar: notification.sender.avatar,
          email: notification.sender.email,
          content: notification.content
        });
      }

      toast.success("Friend request accepted!");
    });
    // For rejections
    socket.on(events.FRIEND_REQUEST_REJECTED, ({ notification }) => {
      const updatedNotifications = notifications.map(notif =>
        notif._id === notification._id ? notification : notif
      );

      dispatch(getNotifications(updatedNotifications));

      if (isNotifClicked === notification._id) {
        setNotifSender({
          fullName: notification.sender.fullName,
          avatar: notification.sender.avatar,
          email: notification.sender.email,
          content: notification.content
        });
      }
    });

    socket.on(events.FRIEND_REQUEST_REJECTED_NOTIFICATION, ({ message }) => {
      toast.error(message);
      fetchNotifs();
    });
    return () => {
      socket.off(events.FRIEND_REQUEST_ACCEPTED);
      socket.off(events.FRIEND_REQUEST_REJECTED);
      socket.off(events.FRIEND_REQUEST_REJECTED_NOTIFICATION);
    };
  }, [notifications, isNotifClicked]);


  // make request to fetch all notifications
  const [loadingNotifs, setLoadingNotifs] = useState<boolean>(false);

  const [showMessageArea, setShowMessageArea] = useState<boolean>(false);

  const fetchNotifs = () => {
    setLoadingNotifs(true)
    axios.get("/api/get-notifications", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } }).then((res) => {
      dispatch(getNotifications(res.data.notifications))

      setLoadingNotifs(false);
    }).catch((err) => {
      console.error(err)
      setLoadingNotifs(false);
      if (err.response.status === 401 || err.response.status === 403) {
        router.push("/client/auth/login")
        return;
      }
      toast.error("A server error occurred. Please bare with us");
    })
  }
  useEffect(() => {
    fetchNotifs()
  }, [])


  const handleNotificationAction = (action: string, senderId: string, notificationId: string,) => {
    const updatedNotifications = notifications.map(notif => {
      if (notif._id === notificationId) {
        return {
          ...notif,
          requestStatus: action,
          isSeen: true,
          content: generateFriendRequest(
            notif.sender.fullName,
            senderId,
            action
          )
        };
      }
      return notif;
    });

    dispatch(getNotifications(updatedNotifications));

    // Update currently viewed notification if needed
    if (isNotifClicked === notificationId) {
      const updatedNotif = updatedNotifications.find(n => n._id === notificationId);
      if (updatedNotif) {
        setNotifSender({
          fullName: updatedNotif.sender.fullName,
          avatar: updatedNotif.sender.avatar,
          email: updatedNotif.sender.email,
          content: updatedNotif.content
        });
      }
    }

    socket.emit(
      action === "accept" ? events.ACCEPT_FRIEND_REQUEST : events.REJECT_FRIEND_REQUEST,
      { senderId, notificationId }
    );
  };

  const deleteNotification = (notificationId: string | null) => {
    axios.delete(`/api/delete-notification/${notificationId}`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }
    })
      .then((res) => {
        toast.success("Deleted Successfully")
        fetchNotifs();
      }).catch((err) => {
        console.error(err)
        if (err.response.status === 401 || err.response.status === 404) {
          toast.error(err.response.data.msg);
          return;
        }

      })
  }


  // filtering
  const [filter, setFilter] = useState<string>("");

  const filterNotifications = notifications.filter((notification) => notification.sender.fullName.includes(filter) ||
    notification.briefContent.includes(filter))

    const [showContent, setShowContent] = useState(false);
    const [showMobileContent, setShowMobileContent] = useState(false);

  useEffect(() => {
    if (isNotifClicked) {
      setTimeout(() => {
        setShowContent(true)
      }, 2000)
    }

    return () => {
      setShowContent(false)
    }
  }, [isNotifClicked])
  return (
    <div
      className="col-span-14 h-[90vh]
      grid grid-cols-16 gap-1"
    >
      {/* Inbox Sidebar */}
      <motion.div 
          className={`h-full py-2 rounded-xl overflow-hidden col-span-16 lg:col-span-6 px-1 bg-gray-100 flex flex-col gap-6 ${
            showMobileContent ? 'hidden lg:flex' : 'flex'
          }`}
          initial={false}
          animate={{ 
            x: showMobileContent ? '-100%' : 0,
            opacity: showMobileContent ? 0 : 1
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        // className="h-full py-2 rounded-xl overflow-hidden col-span-16 lg:col-span-6 px-1 bg-gray-100 flex flex-col gap-6"
      >
        <div className="w-full">
          <Input
            value={filter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
            type="text"
            placeholder="Search"
            className="px-6 rounded-full bg-white h-12 max-sm:text-xs sm:text-sm"
          />
        </div>

        <div className="h-full overflow-y-auto">
          {loadingNotifs ? (
            <div
              className="w-full centered-flex h-full"
            >
              <BlackSpinner />
            </div>
          ) : notifications.length <= 0 ? <div className="h-full w-full centered-flex">
            <img
              src="/empty-inbox.png"
              alt="An Illustration of an empty inbox"
              className="rounded-full w-full max-w-[10rem]" />
          </div> : filterNotifications ? filterNotifications.map((notification: NotificationSchema) => {
            const isClicked = isNotifClicked === notification._id;
            return (
              <div
                onClick={() => {
                  setFireEvent(true)
                  setIsNotifClicked(notification._id)
                }}
                key={notification._id}

                className={`border-b border-gray-200 flex flex-col py-4 hover:cursor-pointer
              ${!isClicked ? "hover:bg-black hover:text-white bg-white" : "bg-black text-white cursor-pointer"} transition-all duration-200 px-4 notifCon
              rounded-lg`}
              >
                {/* heading */}
                <div className="flex items-center space-x-2">
                  <div className="">
                    <img src={notification.sender.avatar} alt={`${notification.sender.fullName}'s profile picture`} className="w-10 h-10 rounded-full" />
                  </div>
                  <div className="w-full flex flex-col ">
                    <div className="flex justify-between">
                      <h1 className="font-extrabold">{notification.sender.fullName}</h1>
                      <p className="text-sm text-gray-400">{getTimeAgo(notification.sentAt)}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-xs">{notification.briefContent}</p>
                      <div className={`px-2 py-1 text-white text-[0.6rem] rounded-full ${!notification.isSeen ? "notifStatus bg-black" : "bg-green-500"}`}>{notification.isSeen ? "seen" : "unread"}</div>
                    </div>
                  </div>
                </div>

              </div>
            )
          }) : notifications?.map((notification: NotificationSchema) => {
            const isClicked = isNotifClicked === notification._id;
            return (
              <div
                onClick={() => {
                  setFireEvent(true)
                  setIsNotifClicked(notification._id)
                }}
                key={notification._id}

                className={`border-b border-gray-200 flex flex-col py-4 hover:cursor-pointer
              ${!isClicked ? "hover:bg-black hover:text-white bg-white" : "bg-black text-white cursor-pointer"} transition-all duration-200 px-4 notifCon
              rounded-lg`}
              >
                {/* heading */}
                <div className="flex items-center space-x-2">
                  <div className="">
                    <img src={notification.sender.avatar} alt={`${notification.sender.fullName}'s profile picture`} className="w-10 h-10 rounded-full" />
                  </div>
                  <div className="w-full flex flex-col ">
                    <div className="flex justify-between">
                      <h1 className="font-extrabold">{notification.sender.fullName}</h1>
                      <p className="text-sm text-gray-400">{getTimeAgo(notification.sentAt)}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-xs">{notification.briefContent}</p>
                      <div className={`px-2 py-1 text-white text-[0.6rem] rounded-full ${!notification.isSeen ? "notifStatus bg-black" : "bg-green-500"}`}>{notification.isSeen ? "seen" : "unread"}</div>
                    </div>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      </motion.div>


      {/* Inbox Message View  (desktop)*/}

      <AnimatePresence mode="wait">
        <motion.div 
          
          className="w-full h-full lg:col-span-10">
          {!isNotifClicked ? (
            <div
              className="mx-auto h-full centered-flex"
            >
              <h1 className="text-gray-400">Nothing to see here</h1>
            </div>
          ) : !showContent ? (
            <div
              className="w-full centered-flex h-full"
            >
              <BlackSpinner />
            </div>
          ) :
            isNotifClicked && showContent && <>
              <div className="w-full flex items-center justify-between px-6 border-b py-4">
                <div className="w-fit flex items-center space-x-2">
                  <img src={notifSender?.avatar} alt={`${notifSender?.fullName}'s avatar`}
                    className="w-14 h-14 object-contain" />
                  <div className="flex flex-col">
                    <h1 className="font-extrabold text-xl">{notifSender?.fullName}</h1>
                    <p className="text-gray-400 text-xs">{notifSender?.email}</p>
                  </div>
                </div>

                <div className="fit" onClick={() => {
                  setIsNotifClicked("")
                  deleteNotification(isNotifClicked)
                }}>
                  <Trash2Icon className="w-6 h-6 text-red-600 cursor-pointer hover:scale-110 transition-all duration-300 active:scale-90" />
                </div>
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: notifSender?.content || '' }}
                onClick={(e) => {
                  const target = e.target as HTMLElement;

                  // Handle accept button clicks
                  if (target.classList.contains("accept-btn") || target.closest(".accept-btn")) {
                    e.preventDefault();
                    const btn = target.classList.contains("accept-btn")
                      ? target
                      : target.closest(".accept-btn");
                    const senderId = btn?.getAttribute("data-sender");
                    if (senderId && isNotifClicked) {
                      handleNotificationAction("accept", senderId, isNotifClicked);
                    }
                  }

                  // Handle reject button clicks
                  if (target.classList.contains("reject-btn") || target.closest(".reject-btn")) {
                    e.preventDefault();
                    const btn = target.classList.contains("reject-btn")
                      ? target
                      : target.closest(".reject-btn");
                    const senderId = btn?.getAttribute("data-sender");
                    if (senderId && isNotifClicked) {
                      handleNotificationAction("reject", senderId, isNotifClicked);
                    }
                  }
                }}
                className="w-full py-10 min-h-80 px-4"
              />
            </>
          }
        </motion.div>
      </AnimatePresence>
    </div>

  )
}

export default Inbox