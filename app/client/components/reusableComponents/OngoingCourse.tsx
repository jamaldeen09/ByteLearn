import { heartIcon } from "@/app/icons/Icons"
import { onGoingCoursesProps } from "../../types/types"
import { cn } from "@/lib/utils"
import Image from 'next/image'
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "../../utils/config/axios"
import { useAppDispatch } from "@/app/redux/essentials/hooks"
import { setEnrolledCourses } from "@/app/redux/coursesSlices/enrolledCoursesSlice"
import { setProgress } from "@/app/redux/coursesSlices/progressSlice"
import toast from "react-hot-toast"

const OngoingCourse = ({ courseImgURL, courseName, currentTopic, progress = 0, countinueLearningLink, courseId }: onGoingCoursesProps) => {
  // Ensure progress is between 0-100
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  // Determine color based on progress (red < 40%, yellow < 70%, green >= 70%)
  const progressColor = clampedProgress >= 70 
    ? "bg-green-500" 
    : clampedProgress >= 40 
      ? "bg-yellow-500" 
      : "bg-red-500";

    
const handleDelete = async () => {
  try {
    const token = localStorage.getItem("bytelearn_token");
    await axios.delete(`/api/enrolled-courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Refetch fresh state (you could also optimistically update Redux here)
    const [coursesRes, progressRes] = await Promise.all([
      axios.get("/api/enrolled-courses", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("/api/progress", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    dispatch(setEnrolledCourses(coursesRes.data.courses));
    dispatch(setProgress(progressRes.data.progress));
    toast.success("Course deleted successfully")
  } catch (err) {
    console.error("Failed to unenroll:", err);
    toast.error("Something went wrong trying to delete the course");
  }
};


  return (
    <div className="w-full flex lg:items-center gap-4 p-2 rounded-lg transition-colors flex-col md:flex-row">
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
            <span  onClick={() => router.push(countinueLearningLink)} 
            className="bg-green-500 text-white p-2 rounded-full hover:cursor-pointer hover:scale-105 duration-300">
              <ArrowRightIcon />
            </span>
            <span   onClick={handleDelete} className="bg-red-600 text-white p-2 rounded-full hover:cursor-pointer hover:scale-105 duration-300">
              <Trash className="w-4 h-4"/>
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