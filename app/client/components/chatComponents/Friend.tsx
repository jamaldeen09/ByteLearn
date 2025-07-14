"use client"
import { FriendProps } from "../../types/types"
import Image from 'next/image'

const Friend = ({ 
  friendImageUrl, 
  friendName, 
  previousMessage, 
  timePreviousMsgWasSent, 
  unreadMessages, 
  createRoom, 
  id, 
  isActive 
}: FriendProps) => {
  return (
    <div
      onClick={() => createRoom(id)}
      className={`${isActive ? "bg-gray-200 hover:bg-gray-200 cursor-default" : "hover:bg-gray-100 hover:cursor-pointer"} 
        flex items-center space-x-2 transition-all duration-300 px-2 py-2 rounded-lg`}
    >
      {/* Profile Picture */}
      <div className="relative">
        <Image
          src={friendImageUrl || "https://img.freepik.com/free-photo/lifestyle-people-emotions-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-help-listening-coworkers-taking-part-conversation_1258-59335.jpg"}
          alt={`${friendName || "Friend"}'s profile picture`}
          className="rounded-full object-cover"
          width={56}  
          height={56}
          unoptimized={true}
        />
      </div>

      {/* Information */}
      <div className="w-full flex flex-col gap-1">
        {/* Name + timestamp */}
        <div className="w-full flex items-center justify-between">
          <h4 className="font-extrabold">{friendName || "Ibrahim"}</h4>
          <p className="text-xs">{timePreviousMsgWasSent || "10:30pm"}</p>
        </div>

        {/* Last message + unread count */}
        <div className="w-full flex items-center justify-between">
          <p className="text-xs truncate max-w-[180px]">
            {previousMessage || "Hello Jamaldeen, Your Lesson Request..."}
          </p>
          {unreadMessages ? (
            <span className="w-4 h-4 text-xs centered-flex text-white bg-purple-600 rounded-full">
              {unreadMessages}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Friend