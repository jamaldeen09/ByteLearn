"use client"

import { NotificationCardProps } from "../../types/types"

const NotficationCard = ({ senderURL, sendersName, descriptionOfWhatWasSent, dateSent }: NotificationCardProps) => {
  return (
    <div
      className="flex flex-col gap-4 border-b border-gray-400 py-4"
    >
        {/* Name + date sent */}
        <div className="flex items-center gap-4">

            <img 
              src={senderURL || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPGV977QixrPUWXtCJ6_-0qabYVXFPeKtTFw&s"} 
              alt={`${sendersName}'s avatar`}
              className="rounded-full w-10 h-10"
            />
            <div className="flex flex-col gap-1">
                <p className="text-black text-sm">{sendersName || "Jamaldeen Olatunji"}</p>
                <p className="text-gray-400 text-xs">{dateSent || "10 mins ago"}</p>
            </div>
        </div>

        {/* description of what was sent */}
        <div className="w-full max-w-lg">
            <p className="text-gray-400 text-sm">{descriptionOfWhatWasSent || "Hey whastsup dude how are you doing?"}</p>
        </div>
    </div>
  )
}

export default NotficationCard