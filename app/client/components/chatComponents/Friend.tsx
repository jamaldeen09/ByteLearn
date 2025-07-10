import { FriendProps } from "../../types/types"


const Friend = ({ friendImageUrl, friendName, previousMessage, timePreviousMsgWasSent, unreadMessages  }: FriendProps) => {
    return (
        <div
            className="flex items-center space-x-2 hover:bg-gray-100 hover:cursor-pointer
      transition-all duration-300 px-2 py-2 rounded-lg"
        >

            {/* Image url */}
            <img
                src={friendImageUrl || "https://img.freepik.com/free-photo/lifestyle-people-emotions-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-help-listening-coworkers-taking-part-conversation_1258-59335.jpg"}
                alt="Profile Picture of a friend"
                className="w-14 h-14 rounded-full object-cover"
            />

            {/* Important information */}
            <div className="w-full flex flex-col gap-1">

                {/* Name + date last message was sent */}
                <div className="w-full flex items-center justify-between">
                    <h4 className="font-extrabold">{friendName || "Ibrahim"}</h4>
                    <p className="text-xs">{timePreviousMsgWasSent || "10:30pm"}</p>
                </div>

                {/* Last message sent + unread messages */}
                <div className="w-full flex items-center justify-between">
                    <p className="text-xs">{previousMessage || "Hello Jamaldeen, Your Lesson Request..."}</p>
                    <p className="w-4 h-4 text-xs centered-flex text-white bg-purple-600 rounded-full">{unreadMessages || 2}</p>
                </div>
            </div>
        </div>
    )
}

export default Friend