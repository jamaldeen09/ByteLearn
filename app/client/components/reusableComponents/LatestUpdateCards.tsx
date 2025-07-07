"use client"

import { LatestUpdateProps } from "../../types/types"

const LatestUpdateCards = ({ updateCategory, updateDesc, updateTitle, updateUrl }: LatestUpdateProps) => {
  return (
    <div
      className="flex items-center space-x-4"
    >
        {/* Img url */}
        <img 
          src={updateUrl || "https://miro.medium.com/v2/resize:fit:1400/1*fhtqKw_QQB8o0tj2OXCjlA.png"} 
          alt={`${updateTitle}'s URL`}
          className="iphone:h-16 iphone:w-16 h-10 sm:h-16 sm:w-16 rounded-lg mt-4" 
        />

        {/* information */}
        <div className="flex flex-col min-h-fit w-full gap-1 mt-4 lg:m-0">
            {/* Title + category */}
            <div className="flex items-center justify-between  flex-wrap gap-1">
                {/* title */}
                <h1 className="text-black iphone:text-sm sm:text-xl font-bold">{updateTitle || "Photography"}</h1>

                {/* category */}
                <div className="rounded-full  bg-yellow-200">
                    <p className="px-2 py-1 rounded-ful text-yellow-500 iphone:text-[0.5rem] sm:text-[0.6rem]">{updateCategory || "Art history"}</p>
                </div>
            </div>

             {/* description */}
             <div className="h-4 text-gray-400">
                <p className="iphone:text-[0.6rem] sm:text-[0.7rem] leading-4">{updateDesc || "New web course for professional photography"}</p>
            </div>
           
        </div>
    </div>
  )
}

export default LatestUpdateCards