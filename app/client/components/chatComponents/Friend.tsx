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
      className={`${isActive ? "bg-gradient-to-br from-black to-black/70 text-white cursor-default" : "bg-gradient-to-br hover:from-black hover:to-black/70 hover:text-white hover:cursor-pointer"} 
        flex items-center space-x-2 transition-all duration-300 px-4 py-4 rounded-3xl group`}
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
          <h4 className="font-extrabold text-[0.8rem] sm:text-[1rem]">{friendName}</h4>
          <p className="text-xs">{timePreviousMsgWasSent}</p>
        </div>

        {/* Last message + unread count */}
        <div className="w-full flex items-center justify-between">
          <p className="text-xs truncate max-w-[180px]">
            {previousMessage}
          </p>
          {unreadMessages ? (
            <span className={`${isActive ? "bg-white text-black" : "group-hover:bg-white group-hover:text-black text-white bg-black" } w-7 h-7 text-xs centered-flex rounded-full`}>
              {unreadMessages > 9 ? "9+" : unreadMessages}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Friend