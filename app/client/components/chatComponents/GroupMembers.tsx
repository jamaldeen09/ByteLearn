"use client"
import { PlusIcon } from "lucide-react"
import { GroupMembersProps } from "../../types/types"
import { MinusIcon } from "@radix-ui/react-icons"
import Image from 'next/image'

const GroupMembers = ({ 
  memberName, 
  setIsAdded, 
  profilePic, 
  bio, 
  isAdded 
}: Omit<GroupMembersProps, 'id'>) => {
  return (
    <div className="flex items-center space-x-2 transition-all duration-300 px-2 py-2 rounded-lg">
      {/* Profile Picture */}
      <Image
        src={profilePic || "https://img.freepik.com/free-photo/lifestyle-people-emotions-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-help-listening-coworkers-taking-part-conversation_1258-59335.jpg"}
        alt={`${memberName || "User"}'s profile picture`}
        className="w-14 h-14 rounded-full object-cover"
        width={56}
        height={56}
      />

      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h4>{memberName || "Jamaldeen"}</h4>
          <p className="text-xs text-gray-400">{bio || "Welcome ByteLearn!"}</p>
        </div>

        <div className="">
          {isAdded ? (
            <button
              onClick={() => setIsAdded(false)}
              className="rounded-full text-white w-8 h-8 text-xs centered-flex hover:cursor-pointer bg-red-600"
            >
              <MinusIcon />
            </button>
          ) : (
            <button
              onClick={() => setIsAdded(true)}
              className="text-xs rounded-full text-white w-8 h-8 centered-flex hover:cursor-pointer bg-green-500"
            >
              <PlusIcon className="size-4"/>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default GroupMembers