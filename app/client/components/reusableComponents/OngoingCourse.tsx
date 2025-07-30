import { onGoingCoursesProps } from "../../types/types"
import { ArrowRight, Heart, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { setEnrolledCourses } from "@/app/redux/coursesSlices/enrolledCoursesSlice"
import { getCourses } from "@/app/redux/coursesSlices/courseSlice"
import axios from "../../utils/config/axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { changeState } from "@/app/redux/coursesSlices/likedStateSlice"


const OngoingCourse = ({
  courseImgURL,
  courseName,
  currentTopic,
  progress = 0,
  countinueLearningLink,
  courseId,
}: onGoingCoursesProps) => {
  const dispatch = useAppDispatch()
  const courses = useAppSelector(state => state.coursesSlice.courses)
  const foundCourse = courses.find(course => course?._id === courseId)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [loadingAnim, setloadingAnim] = useState(false);

  const likedMap = useAppSelector(state => state.likedState.likedMap);
  const isLike = likedMap[courseId] ?? foundCourse?.likedByCurrentUser ?? false;


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
      dispatch(changeState({ courseId, isLiked: !isLike }));
    } catch (err) {
      console.error(err);
      toast.error("A server error occurred, please try again.");
    } finally {
      setloadingAnim(false);
    }
  };


  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleting(true)

    try {
      const token = localStorage.getItem("bytelearn_token")
      await axios.delete(`/api/enrolled-courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Update both enrolled courses AND main courses list
      const [enrolledRes, coursesRes] = await Promise.all([
        axios.get("/api/enrolled-courses", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("/api/courses", {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ])

      dispatch(setEnrolledCourses(enrolledRes.data.courses))
      dispatch(getCourses(coursesRes.data.courses))
      toast.success("Successfully unenrolled from course")
    } catch (err) {
      console.error("Failed to unenroll:", err)
      toast.error("Failed to unenroll from course")
    } finally {
      setIsDeleting(false)
    }
  }

  // Ensure progress is between 0-100
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <motion.div>
      <div className="group hover:shadow-md transition-shadow duration-200 border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-5 flex items-start gap-4 flex-col sm:flex-row">
          <div className="flex-shrink-0 relative">
            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={courseImgURL || "/placeholder-course.jpg"}
                alt={courseName}
                width={80}
                height={80}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors
              text-xs sm:text-sm">
                {courseName}
              </h3>
              {/* Like Button - Only shown if published */}
              {foundCourse?.isPublished && (
                <button
                  className="text-gray-400 hover:text-red-500 transition-colors hover:cursor-pointer"
                  onClick={toggleLike}
                  disabled={loadingAnim}
                >

                  {loadingAnim ? <div className="flex flex-auto flex-col justify-center items-center">
                    <div className="flex justify-center">
                      <div className={`animate-spin inline-block size-6 border-3 border-current border-t-transparent text-red-600 rounded-full dark:text-red-500" role="status" aria-label="loading`}>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div> : (
                    <Heart
                      className={`w-5 sh-5 ${isLike ? 'fill-red-500 text-red-500' : ''}`}
                    />
                  )}
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Currently on: {currentTopic}
            </p>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-700">
                  Progress: {clampedProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${clampedProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 hover:cursor-pointer"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="flex justify-center">
                  <div className={`animate-spin inline-block size-4 mr-2 border-3 border-current border-t-transparent text-red-600 rounded-full dark:text-red-500" role="status" aria-label="loading`}>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
                Processing...
              </>
            ) : (
              <>
                <Trash2 className="w-3 h-3" />
                Unenroll
              </>
            )}
          </button>
          <Link
            href={countinueLearningLink}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            {clampedProgress > 0 ? "Continue" : "Start"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default OngoingCourse