import { ellipseIcon, heartIcon } from "@/app/icons/Icons"
import { onGoingCoursesProps } from "../../types/types"
import { cn } from "@/lib/utils"
import Image from 'next/image'

const OngoingCourse = ({ courseImgURL, courseName, currentTopic, progress = 0 }: onGoingCoursesProps) => {
  // Ensure progress is between 0-100
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  // Determine color based on progress (red < 40%, yellow < 70%, green >= 70%)
  const progressColor = clampedProgress >= 70 
    ? "bg-green-500" 
    : clampedProgress >= 40 
      ? "bg-yellow-500" 
      : "bg-red-500";

  return (
    <div className="w-full flex lg:items-center gap-4 p-2 hover:bg-gray-100 rounded-lg transition-colors hover:cursor-pointer flex-col md:flex-row">
      <Image 
        src={courseImgURL || "https://miro.medium.com/v2/resize:fit:1400/1*fhtqKw_QQB8o0tj2OXCjlA.png"}
        alt="Course thumbnail"
        className="w-24 h-24 rounded-lg object-cover"
        width={96}
        height={96}
        unoptimized={true}
      />

      {/* Information */}
      <div className="w-full space-y-2">
        {/* Header */}
        <div className="w-full flex sm:items-center sm:flex-row justify-between iphone:flex-col iphone:gap-4 sm:gap-0">
          <h1 className="font-extrabold text-lg line-clamp-1">{courseName || "Art History"}</h1>
          <div className="flex items-center gap-2">
            <span className="hover:cursor-pointer hover:text-red-500 transition-colors">
              {heartIcon}
            </span>
            <span className="hover:cursor-pointer">
              {ellipseIcon}
            </span>
          </div>
        </div>

        {/* Current topic */}
        <p className="text-sm text-gray-500 line-clamp-1">
          {currentTopic || "Unit 1. Renaissance art in a unit"}
        </p>

        {/* Progress bar with percentage */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium">{clampedProgress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                progressColor
              )}
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OngoingCourse