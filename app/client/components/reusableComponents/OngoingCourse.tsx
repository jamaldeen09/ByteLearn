import { onGoingCoursesProps } from "../../types/types"
import { cn } from "@/lib/utils"
import Image from 'next/image'
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import axios from "../../utils/config/axios"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { setEnrolledCourses } from "@/app/redux/coursesSlices/enrolledCoursesSlice"
import toast from "react-hot-toast"
import { getCourses } from "@/app/redux/coursesSlices/courseSlice"
import { useState } from "react"
import BasicSpinner from "./BasicSpinner"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from "@fortawesome/free-solid-svg-icons"


const OngoingCourse = ({ courseImgURL, courseName, currentTopic, progress = 0, countinueLearningLink, courseId }: onGoingCoursesProps
) => {
  // Ensure progress is between 0-100
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const router = useRouter()
  const dispatch = useAppDispatch()
  const courses = useAppSelector(state => state.coursesSlice.courses)
  const foundCourse = courses.find(course => course?._id === courseId)
  const [isLike, setIsLike] = useState<boolean>(foundCourse?.likedByCurrentUser || false);
  const [loadingAnim, setloadingAnim] = useState(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [itemBeingDeleted, setItemBeingDeleted] = useState<string>(courseId)

  const toggleLike = async () => {
    if (loadingAnim) return;

    setloadingAnim(true);

    try {
      const token = localStorage.getItem("bytelearn_token");
      const endpoint = isLike ? "/api/unlike-course" : "/api/like-course";


      await axios.post(endpoint, { courseId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update UI state
      setIsLike(!isLike);

      toast.success(
        `${courseName} has been ${isLike ? "unliked" : "liked"}`
      );
    } catch (err) {
      console.error(err);
      toast.error("A server error occurred, please try again.");
    } finally {
      setloadingAnim(false);
    }
  };


  const progressColor = clampedProgress >= 70
    ? "bg-green-500"
    : clampedProgress >= 40
      ? "bg-yellow-500"
      : "bg-red-500";


  const handleDelete = async () => {
    setIsDeleting(true);
    setItemBeingDeleted(courseId)
    try {
      const token = localStorage.getItem("bytelearn_token");
      await axios.delete(`/api/enrolled-courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update both enrolled courses AND main courses list
      const [enrolledRes, coursesRes] = await Promise.all([
        axios.get("/api/enrolled-courses", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("/api/courses", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")} ` } })
      ]);

      setIsDeleting(false);
      dispatch(setEnrolledCourses(enrolledRes.data.courses));
      dispatch(getCourses(coursesRes.data.courses));
      toast.success("Course deleted successfully");
    } catch (err) {
      setIsDeleting(false);
      console.error("Failed to unenroll:", err);
      toast.error("Failed to delete course");
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
            <span onClick={toggleLike}
              className="hover:cursor-pointer hover:text-red-500 transition-colors">

              {loadingAnim ? <BasicSpinner /> : <FontAwesomeIcon icon={faHeart} className={`text-xl ${isLike && "text-red-600"}`} />}
            </span>
            <span onClick={() => router.push(countinueLearningLink)}
              className="bg-green-500 text-white p-2 rounded-full hover:cursor-pointer hover:scale-105 duration-300">
              <ArrowRightIcon />
            </span>
            <span
              onClick={
                handleDelete
              }
              className="group relative p-2 rounded-full transition-all duration-200 hover:bg-red-50 active:bg-red-50/50 hover:cursor-pointer"
              aria-label="Delete"
            >
              {itemBeingDeleted === courseId && isDeleting ? (
                <div className="relative w-4 h-4">
                  {/* Smooth subtle spinner */}
                  <svg
                    className="w-4 h-4 animate-spin text-red-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeOpacity="0.25"
                      strokeWidth="4"
                    />
                    <path
                      d="M12 2C14.5013 2 16.8411 3.05357 18.5001 4.83706"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeOpacity="0.75"
                    />
                  </svg>
                </div>
              ) : (
                <svg

                  className="w-4 h-4 text-red-400 group-hover:text-red-500 transition-colors duration-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              )}
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