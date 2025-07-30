"use client"
import { useAppDispatch, useAppSelector } from '@/app/redux/essentials/hooks'
import { Input } from '@/components/ui/input'
import React, { useState, useEffect, useCallback } from 'react'
import axios from "../../utils/config/axios"
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { NotificationSchema, NotifSenderInformationSchema } from '@/app/client/types/types'
import { getNotifications } from '@/app/redux/chatSlices/notificationSlice'
import { getTimeAgo } from '@/app/client/utils/utils'
import { socket } from "../../utils/config/io"
import { events } from '@/app/client/utils/events'
import { ArrowLeftIcon, Trash2Icon } from 'lucide-react'
import { generateFriendRequest } from '../../utils/utils'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import NotificationViewSkeleton from '../../components/reusableComponents/NotificationViewSkeleton'
import { AxiosError } from 'axios'
import { Button } from '@/components/ui/button'
import DeepseekSpinner from '../../components/reusableComponents/DeepseekSpinner'

const Inbox = () => {
  const notifications = useAppSelector(state => state.notificationContainer.notifications)
  const [isNotifClicked, setIsNotifClicked] = useState<string | null>("")
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [clearingNotifications, setClearingNotifications] = useState<boolean>(false);
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [fireEvent, setFireEvent] = useState<boolean>(false)
  const [notifSender, setNotifSender] = useState<NotifSenderInformationSchema>()

  const fetchNotifs = useCallback(() => {
    setLoadingNotifs(true)
    axios.get("/api/get-notifications", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } }).then((res) => {
      dispatch(getNotifications(res.data.notifications))
      setLoadingNotifs(false)
    }).catch((err) => {
      console.error(err)
      setLoadingNotifs(false)
      if (err.response.status === 401 || err.response.status === 403) {
        router.push("/client/auth/login")
        return
      }
      toast.error("A server error occurred. Please bare with us")
    })
  }, [dispatch, router])

  useEffect(() => {
    if (!isNotifClicked) return

    const data = {
      notifId: isNotifClicked
    }

    socket.off(events.CHANGED_TO_SEEN)
    socket.off(events.NOT_ALLOWED)

    socket.emit(events.SEEN_NOTIFICATION, data)

    const handleChangedToSeen = ({ notifSender }: { notifSender: NotifSenderInformationSchema }) => {
      setFireEvent(false)
      fetchNotifs()
      setNotifSender(notifSender)
    }

    const handleNotAllowed = ({ notifSender }: { notifSender: NotifSenderInformationSchema }) => {
      setNotifSender(notifSender)
    }

    socket.on(events.CHANGED_TO_SEEN, handleChangedToSeen)
    socket.on(events.NOT_ALLOWED, handleNotAllowed)

    return () => {
      socket.off(events.CHANGED_TO_SEEN, handleChangedToSeen)
      socket.off(events.NOT_ALLOWED, handleNotAllowed)
    }
  }, [fireEvent, isNotifClicked, fetchNotifs])

  useEffect(() => {
    const handleFriendRequestAccepted = ({ notification }: { notification: NotificationSchema }) => {
      const updatedNotifications = notifications.map(notif =>
        notif._id === notification._id ? notification : notif
      )
      dispatch(getNotifications(updatedNotifications))

      if (isNotifClicked === notification._id) {
        setNotifSender({
          fullName: notification.sender.fullName,
          avatar: notification.sender.avatar,
          email: notification.sender.email,
          content: notification.content
        })
      }
      toast.success("Friend request accepted!")
    }

    const handleFriendRequestRejected = ({ notification }: { notification: NotificationSchema }) => {
      const updatedNotifications = notifications.map(notif =>
        notif._id === notification._id ? notification : notif
      )
      dispatch(getNotifications(updatedNotifications))

      if (isNotifClicked === notification._id) {
        setNotifSender({
          fullName: notification.sender.fullName,
          avatar: notification.sender.avatar,
          email: notification.sender.email,
          content: notification.content
        })
      }
    }

    const handleFriendRequestRejectedNotification = ({ message }: { message: string }) => {
      toast.error(message)
      fetchNotifs()
    }

    socket.on(events.FRIEND_REQUEST_ACCEPTED, handleFriendRequestAccepted)
    socket.on(events.FRIEND_REQUEST_REJECTED, handleFriendRequestRejected)
    socket.on(events.FRIEND_REQUEST_REJECTED_NOTIFICATION, handleFriendRequestRejectedNotification)

    return () => {
      socket.off(events.FRIEND_REQUEST_ACCEPTED, handleFriendRequestAccepted)
      socket.off(events.FRIEND_REQUEST_REJECTED, handleFriendRequestRejected)
      socket.off(events.FRIEND_REQUEST_REJECTED_NOTIFICATION, handleFriendRequestRejectedNotification)
    }
  }, [notifications, isNotifClicked, dispatch, fetchNotifs])

  const [loadingNotifs, setLoadingNotifs] = useState<boolean>(false)

  useEffect(() => {
    fetchNotifs()
  }, [fetchNotifs])

  const handleNotificationAction = (action: string, senderId: string, notificationId: string) => {
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
        }
      }
      return notif
    })

    dispatch(getNotifications(updatedNotifications))

    if (isNotifClicked === notificationId) {
      const updatedNotif = updatedNotifications.find(n => n._id === notificationId)
      if (updatedNotif) {
        setNotifSender({
          fullName: updatedNotif.sender.fullName,
          avatar: updatedNotif.sender.avatar,
          email: updatedNotif.sender.email,
          content: updatedNotif.content
        })
      }
    }

    socket.emit(
      action === "accept" ? events.ACCEPT_FRIEND_REQUEST : events.REJECT_FRIEND_REQUEST,
      { senderId, notificationId }
    )
  }

  const deleteNotification = (notificationId: string | null) => {
    axios.delete(`/api/delete-notification/${notificationId}`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }
    })
      .then(() => {
        toast.success("Deleted Successfully")
        fetchNotifs()
      }).catch((err) => {
        console.error(err)
        if (err.response.status === 401 || err.response.status === 404) {
          toast.error(err.response.data.msg)
          return
        }
      })
  }

  const [filter, setFilter] = useState<string>("")
  const [showContent, setShowContent] = useState(false)


  const filterNotifications = notifications.filter((notification) =>
    notification.sender.fullName.includes(filter) ||
    notification.briefContent.includes(filter)
  )

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


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const clearNotifications = async () => {
    if (notifications.length <= 0) return;

    setClearingNotifications(true)
    try {
      const res = await axios.delete("/api/clear-notifications", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}`
        }
      })
      setClearingNotifications(false)
      fetchNotifs();
      setIsNotifClicked("");
      toast.success(res.data.msg)
      return;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setClearingNotifications(false)
        console.error(err)
        if (err.response?.status === 401 || err.response?.status === 404) {
          router.push("/client/auth/login");
          return;
        } else {
          toast.error(err.response?.data.msg)
          return;
        }
      }
    }
  }
  return (
    <div className="col-span-14 h-[90vh] grid grid-cols-1 md:grid-cols-16 gap-1  relative overflow-hidden">
      <AnimatePresence>
        {(!isMobile || !isNotifClicked) && (
          <motion.div
            className={`h-full py-4 rounded-xl overflow-hidden md:col-span-7 lg:col-span-6 bg-gray-50 flex flex-col gap-4 border border-gray-200`}
            initial={{ x: isMobile ? -300 : 0 }}
            animate={{ x: isMobile ? (isNotifClicked ? -300 : 0) : 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            key="sidebar"

          >
            {/* Search Header */}
            <div className="px-4 flex flex-col space-y-2">
              <div className="relative">
                <Input
                  value={filter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
                  type="text"
                  placeholder="Search notifications..."
                  className="pl-10 pr-6 rounded-full bg-white h-12 text-sm border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
              </div>

              <div onClick={clearNotifications}
                className="w-full">
                {clearingNotifications ? (

                  <Button
                    className="hover:cursor-pointer text-xs bg-red-200 text-red-600 hover:bg-red-200 hover:text-red-500 hover:brightness-95 rounded-full"
                    disabled={clearingNotifications}>

                    <div className="flex flex-auto flex-col justify-center items-center">
                      <div className="flex justify-center">
                        <div className={`animate-spin inline-block size-4 border-3 border-current border-t-transparent text-red-600 rounded-full dark:text-red-500" role="status" aria-label="loading`}>
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    </div>
                    clearing...
                  </Button>

                ) : (
                  <Button className="hover:cursor-pointer text-xs bg-red-200 text-red-600 hover:bg-red-200 hover:text-red-500 hover:brightness-95 rounded-full">
                    <span className="text-red-600">
                      <Trash2Icon />
                    </span>
                    Clear Notifications
                  </Button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="h-full overflow-y-auto px-2">
              {loadingNotifs ? (
                <div className="space-y-3 px-3">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-white border border-gray-100"
                    >
                      <div className="flex gap-3">
                        {/* Avatar Skeleton */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                        </div>

                        {/* Content Skeleton */}
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between">
                            <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse"></div>
                            <div className="h-3 w-1/4 rounded bg-gray-100 animate-pulse"></div>
                          </div>

                          <div className="space-y-1">
                            <div className="h-3 w-full rounded bg-gray-100 animate-pulse"></div>
                            <div className="h-3 w-5/6 rounded bg-gray-100 animate-pulse"></div>
                          </div>

                          {/* Status Skeleton */}
                          <div className="flex justify-end">
                            <div className="h-4 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length <= 0 ? (
                <motion.div
                  className="h-full w-full flex flex-col items-center justify-center p-8 space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative w-24 h-24">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gray-200"
                      animate={{ opacity: [0.1, 0.2, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative flex items-center justify-center w-full h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-16 h-16 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                    <p className="text-sm text-gray-500 max-w-md">
                      All caught up! Check back later for updates.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {(filterNotifications || notifications)?.map((notification: NotificationSchema) => {
                    const isClicked = isNotifClicked === notification._id;
                    const isUnread = !notification.isSeen;

                    return (
                      <motion.div
                        key={notification._id}
                        onClick={() => {
                          setFireEvent(true);
                          setIsNotifClicked(notification._id);
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`
                            relative overflow-hidden
                            ${isClicked ? 'bg-gray-900 text-white' : 'bg-white'}
                            ${isUnread ? 'border-l-4 border-gray-900' : ''}
                            rounded-lg shadow-sm
                            transition-all duration-200
                            cursor-pointer
                          `}
                      >
                        <div className="p-4 flex gap-3">
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <Image
                                src={notification.sender.avatar}
                                alt={`${notification.sender.fullName}'s profile picture`}
                                className="w-10 h-10 rounded-full object-cover"
                                width={40}
                                height={40}
                                unoptimized={true}
                              />
                              {isUnread && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className={`text-sm font-semibold truncate ${isClicked ? 'text-white' : 'text-gray-900'}`}>
                                {notification.sender.fullName}
                              </h3>
                              <span className={`text-[0.6rem] max-lg:text-xs ${isClicked ? 'text-gray-300' : 'text-gray-500'}`}>
                                {getTimeAgo(notification.sentAt)}
                              </span>
                            </div>

                            <p className={`text-xs truncate lg:text-sm mt-1 ${isClicked ? 'text-gray-200' : 'text-gray-600'}`}>
                              {notification.briefContent}
                            </p>

                            {isUnread && !isClicked && (
                              <motion.div
                                className="absolute top-0 right-0 w-2 h-2 bg-gray-900 rounded-full m-2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 500 }}
                              />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Content Area */}
      <AnimatePresence>
        <motion.div
          className={`h-full md:col-span-9 lg:col-span-10 bg-white ${isMobile ? 'absolute inset-0 z-10' : ''
            }`}
          initial={{ x: isMobile ? '100%' : 0 }}
          animate={{ x: isMobile ? (isNotifClicked ? 0 : '100%') : 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          key="content"
        >
          {!isNotifClicked ? (
      
            <div className="hidden max-lg:flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notification selected</h3>
              <p className="text-gray-500 max-w-md text-sm">
                Select a notification from the sidebar to view its contents
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Back Button */}
              {isMobile && (
                <button
                  onClick={() => setIsNotifClicked("")}
                  className="flex items-center gap-2 p-4 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span>Back</span>
                </button>
              )}

              {/* Notification Header */}
              <div className="w-full flex items-center justify-between border-b py-4 px-6">
                <div className="w-fit flex items-center space-x-2">
                  <Image
                    src={notifSender?.avatar || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
                    className="w-14 h-14 rounded-full object-cover"
                    width={56}
                    height={56}
                    alt="Sender avatar"
                    unoptimized={true}
                  />
                  <div className="flex flex-col">
                    <h1 className="font-extrabold text-xl">{notifSender?.fullName}</h1>
                    <p className="text-gray-400 text-xs">{notifSender?.email}</p>
                  </div>
                </div>
                <Trash2Icon
                  className="w-6 h-6 text-red-600 cursor-pointer"
                  onClick={() => {
                    deleteNotification(isNotifClicked)
                    setIsNotifClicked("")
                  }}
                />
              </div>

              {/* Notification Content */}
              {!showContent ? (
                <NotificationViewSkeleton />
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: notifSender?.content || '' }}
                  className="w-full py-10 min-h-80 px-4"
                  onClick={(e) => {
                    const target = e.target as HTMLElement

                    if (target.classList.contains("accept-btn") || target.closest(".accept-btn")) {
                      e.preventDefault()
                      const btn = target.classList.contains("accept-btn")
                        ? target
                        : target.closest(".accept-btn")
                      const senderId = btn?.getAttribute("data-sender")
                      if (senderId && isNotifClicked) {
                        handleNotificationAction("accept", senderId, isNotifClicked)
                      }
                    }

                    if (target.classList.contains("reject-btn") || target.closest(".reject-btn")) {
                      e.preventDefault()
                      const btn = target.classList.contains("reject-btn")
                        ? target
                        : target.closest(".reject-btn")
                      const senderId = btn?.getAttribute("data-sender")
                      if (senderId && isNotifClicked) {
                        handleNotificationAction("reject", senderId, isNotifClicked)
                      }
                    }
                  }}
                />
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>

  )
}

export default Inbox

