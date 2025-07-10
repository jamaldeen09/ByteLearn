"use client"
import Sidebar from "../../components/sidebar/Sidebar"
import MainDashboard from "./content/MainDashboard";
import SidebarNav from "../../components/reusableComponents/SidebarNav";
import MobileSidebar from "../../components/sidebar/MobileSidebar";
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks";
import { AnimatePresence, motion } from "framer-motion";
import MyCourses from "./content/MyCourses";
import Courses from "./content/Courses";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import axios from "../../utils/config/axios"
import toast from "react-hot-toast";
import { getInformation } from "@/app/redux/informationSlices/usersInformationSlice";
import Chat from "./chat/Chat";




const page = (): React.ReactElement => {
  const canvas = useAppSelector((state) => state.canvasTrigger.canvas)
  
  const dispatch = useAppDispatch()
  const router = useRouter()


  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const courseId = searchParams.get('courseId');

  // const route = tab === "my-courses" ? "b" : tab === "courses" ? "c" : "a";
  const route = tab === "my-courses" ? "b" : tab === "courses" ? "c" : tab === "chat" ? "d" : "a";

  // fetch usersInformation
  useEffect(() => {
    axios.get(`/api/get-information`, { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }} )
      .then((res) => {
        dispatch(getInformation(res.data.payload))
      }).catch((err) => {
      console.error(err)
      if (err.response.status === 401 || err.response.status === 403 || err.response.status === 404){
        router.push("/client/auth/login");
        return;
      }
      toast.error("A server error occured. Please bare with us");
    })
  }, [dispatch])

  return (
    <div
      className="h-screen bg-white grid grid-cols-1 sm:grid-cols-1 md:grid-cols-10 max-lg:grid-cols-14 overflow-hidden"
    >
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

      <div
        className="md:col-span-9 max-lg:col-span-13 bg-white overflow-y-auto"
      >

        <div className="min-h-fit flex flex-col gap-10">
          <SidebarNav
            profilePic="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMfPRrW0_4u-15F-1v756VaWkys1zQ4Hzuuw&s"
            firstName="Jamaldeen"
          />

          <div className="grid lg:grid-cols-14">
            {route === "a" && <MainDashboard />}
            {route === "b" && <MyCourses courseId={courseId} />}
            {route === "c" && <Courses />}
            {route === "d" && <Chat />} 
            {!(route === "a" || route === "b" || route === "c" || route === "d") && (
              <div>Coming soon</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default page