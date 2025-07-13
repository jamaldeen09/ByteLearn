"use client"
import { FriendsOnByteLearnProps } from "../../types/types"
import Image from 'next/image'

const FriendsOnByteLearn = ({ name, id, profilePicture, bio, createRoom }: FriendsOnByteLearnProps) => {
  return (
    <div
      onClick={() => createRoom(id)}
      className="flex items-center space-x-2 hover:bg-gray-100 hover:cursor-pointer transition-all duration-300 px-2 py-2 rounded-lg"
    >
      {/* Profile Picture */}
      <Image
        src={profilePicture || "https://img.freepik.com/free-photo/lifestyle-people-emotions-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-help-listening-coworkers-taking-part-conversation_1258-59335.jpg"}
        alt={`${name || "Friend"}'s profile picture`}
        className="w-14 h-14 rounded-full object-cover"
        width={56}  // w-14 = 3.5rem = 56px
        height={56} // h-14 = 3.5rem = 56px
      />
      
      <div className="w-full flex flex-col gap-1">
        <h4>{name || "Jamaldeen"}</h4>
        <p className="text-xs text-gray-400">{bio || "Welcome ByteLearn!"}</p>
      </div>
    </div>
  )
}

export default FriendsOnByteLearn