import { useAppDispatch, useAppSelector } from '@/app/redux/essentials/hooks'
import { Input } from '@/components/ui/input'
import React, { useState, useEffect } from 'react'
import axios from "../../../utils/config/axios"
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { NotificationSchema } from '@/app/client/types/types'
import { getNotifications } from '@/app/redux/chatSlices/notificationSlice'
import BlackSpinner from '@/app/client/components/reusableComponents/BlackSpinner'
import { getTimeAgo } from '@/app/client/utils/utils'
import { socket } from "../../../utils/config/io"
import { events } from '@/app/client/utils/events'

const Inbox = (): React.ReactElement => {
  const notifications = useAppSelector(state => state.notificationContainer.notifications)
  const [isNotifClicked, setIsNotifClicked] = useState<string | null>("");
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [fireEvent, setFireEvent] = useState<boolean>(false);
  
  useEffect (() => {
    if (!isNotifClicked) return;
    const data = {
      notifId: isNotifClicked
    }
    socket.emit(events.SEEN_NOTIFICATION, data)
    socket.on(events.CHANGED_TO_SEEN, ({ msg }) => {
      setFireEvent(false);
      fetchNotifs();
      toast.success(msg)
    })

    return () => {
      socket.off(events.SEEN_NOTIFICATION)
      socket.off(events.CHANGED_TO_SEEN)
    }
  }, [fireEvent])

  // make request to fetch all notifications
  const [loadingNotifs, setLoadingNotifs] = useState<boolean>(false);

  const fetchNotifs = () => {
    setLoadingNotifs(true)
    axios.get("/api/get-notifications", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } }).then((res) => {
      dispatch(getNotifications(res.data.notifications))
      console.log(res.data.notifications)
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
  return (
    <div
      className="col-span-14 h-[90vh]
      grid grid-cols-16 gap-1"
    >
      {/* Inbox Sidebar */}
      <div className="h-full py-2 rounded-xl overflow-hidden col-span-16 lg:col-span-6 px-1 bg-gray-100 flex flex-col gap-6">
        <div className="w-full">
          <Input
            type="text"
            placeholder="Search"
            className="px-6 rounded-full bg-white h-14"
          />
        </div>

        <div className="h-full overflow-y-auto">
          {loadingNotifs ? (
            <div
              className="w-full centered-flex h-full"
            >
              <BlackSpinner />
            </div>
          ) : notifications?.map((notification: NotificationSchema) => {
            const isClicked =  isNotifClicked === notification._id;
            return (
              <div
                onClick={() => {
                  setFireEvent(true)
                  setIsNotifClicked(notification._id)
                }}
                key={notification._id}

                className={`border-b border-gray-200 flex flex-col py-4 hover:cursor-pointer
              ${!isClicked ? "hover:bg-black hover:text-white bg-white" : "bg-black text-white cursor-pointer"} transition-all duration-200 px-4 notifCon`}
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
      </div>
      {/* Inbox Message View */}
      <div className="w-full basic-border h-full hidden lg:block lg:col-span-10">

      </div>
    </div>
  )
}

export default Inbox