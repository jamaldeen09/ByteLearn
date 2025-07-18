"use client"
import Sidebar from "../components/sidebar/Sidebar"
import MainDashboard from "./content/MainDashboard";
import SidebarNav from "../components/reusableComponents/SidebarNav";
import MobileSidebar from "../components/sidebar/MobileSidebar";
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks";
import { AnimatePresence, motion } from "framer-motion";
import MyCourses from "./content/MyCourses";
import Courses from "./content/Courses";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "../utils/config/axios"
import toast from "react-hot-toast";
import { getInformation } from "@/app/redux/informationSlices/usersInformationSlice";
import Chat from "./chat/Chat";
import Inbox from "./chat/Inbox";
import CourseCreation from "./courseCreation/CourseCreation";

const DashboardPageContent = (): React.ReactElement => {
  const canvas = useAppSelector((state) => state.canvasTrigger.canvas)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const courseId = searchParams.get('courseId');

  const route = tab === "my-courses" ? "b" : 
              tab === "courses" ? "c" : 
              tab === "chat" ? "d" : 
              tab === "inbox" ? "e" :
              tab === "course-creation" ? "f": "a";

  // fetch usersInformation
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("bytelearn_token")
      if (!token) {
        router.push("/client/auth/login");
        return;
      }

      setIsLoading(true)
      axios.get(`/api/get-information`, { headers: { "Authorization": `Bearer ${token}` }} )
        .then((res) => {
          dispatch(getInformation(res.data.payload))
        })
        .catch((err) => {
          console.error(err)
          if (err.response?.status === 401 || err.response?.status === 403 || err.response?.status === 404){
            router.push("/client/auth/login");
            return;
          }
          toast.error("A server error occurred. Please bear with us");
        })
        .finally(() => setIsLoading(false))
    }
  }, [dispatch, router])

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white grid grid-cols-1 sm:grid-cols-1 md:grid-cols-10 max-lg:grid-cols-14 overflow-hidden">
      {/* Desktop SideBar */}
      <div className="hidden md:block md:col-span-1 max-lg:col-span-1 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {canvas && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black inset-0 fixed top-0 z-40 md:hidden"
            />

            {/* Mobile Sidebar */}
            <MobileSidebar/>
          </>
        )}
      </AnimatePresence>

      <div className="md:col-span-9 max-lg:col-span-13 bg-white overflow-y-auto">
        <div className="min-h-fit flex flex-col gap-10">
          <SidebarNav />

          <div className="grid lg:grid-cols-14">
            {route === "a" && <MainDashboard />}
            {route === "b" && <MyCourses courseId={courseId} />}
            {route === "c" && <Courses />}
            {route === "d" && <Chat />} 
            {route === "e" && <Inbox />}
            {route === "f" && <CourseCreation />}
            {!(route === "a" || route === "b" || route === "c" || route === "d" || route === "e" || route === "f") && (
              <div>Coming soon</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPageContent