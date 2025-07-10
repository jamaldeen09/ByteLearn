import { FriendsOnByteLearnProps } from "../../types/types"


const FriendsOnByteLearn = ({ name, id, profilePicture, bio, createRoom }: FriendsOnByteLearnProps) => {
  return (
    <div
      onClick={() => createRoom(id)}
      className="flex items-center space-x-2 hover:bg-gray-100 hover:cursor-pointer
      transition-all duration-300 px-2 py-2 rounded-lg"
    >
      {/* Imageurl */}
      <img
        src={profilePicture || "https://img.freepik.com/free-photo/lifestyle-people-emotions-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-help-listening-coworkers-taking-part-conversation_1258-59335.jpg"}
        alt="Profile Picture of a friend"
        className="w-14 h-14 rounded-full object-cover"
      />
      <div className="w-full flex flex-col gap-1">
        <h4>{name || "Jamaldeen" }</h4>
        <p className="text-xs text-gray-400">{bio  || "Welcome ByteLearn!"}</p>
      </div>
    </div>
  )
}

export default FriendsOnByteLearn