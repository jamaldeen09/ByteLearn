import { ChatFilterProps } from "../../types/types"


const FriendFilters = ({ filterName, isActive }: ChatFilterProps) => {
  return (
    <div
      className={`border border-gray-300 centered-flex text-xs rounded-full
        hover:bg-black hover:text-white hover:cursor-pointer transition-all duration-200
       px-3 py-2 ${isActive && "bg-black text-white"}`}
    >
        <p>{filterName || "Unread"}</p>
    </div>
  )
}

export default FriendFilters