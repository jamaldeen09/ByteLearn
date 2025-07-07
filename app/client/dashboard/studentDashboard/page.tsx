"use client"
import { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar"
import MainDashboard from "./content/MainDashboard";
import SidebarNav from "../../components/reusableComponents/SidebarNav";
import MobileSidebar from "../../components/sidebar/MobileSidebar";
import { useAppSelector } from "@/app/redux/essentials/hooks";
import { AnimatePresence, motion } from "framer-motion";
import MyCourses from "./content/MyCourses";
import Courses from "./content/Courses";





const page = (): React.ReactElement => {
  const [currentRoute, setCurrentRoute] = useState('a');
  const canvas = useAppSelector((state) => state.canvasTrigger.canvas)

  return (
    <div
      className="h-screen bg-white grid grid-cols-1 sm:grid-cols-1 md:grid-cols-10 max-lg:grid-cols-14 overflow-hidden"
    >
      {/* Desktop SideBar */}
      <div className="hidden md:block md:col-span-1 max-lg:col-span-3 h-screen sticky top-0 overflow-y-auto">
        <Sidebar
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
        />
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
            <MobileSidebar 
             currentRoute={currentRoute}
             setCurrentRoute={setCurrentRoute}
            />
          </>
        )}
      </AnimatePresence>

      <div
        className="md:col-span-9 max-lg:col-span-11 bg-gray-200 overflow-y-auto"
      >

        <div className="min-h-fit flex flex-col gap-10">
          <SidebarNav
            profilePic="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMfPRrW0_4u-15F-1v756VaWkys1zQ4Hzuuw&s"
            firstName="Jamaldeen"
          />

          <div className="grid lg:grid-cols-14">
            {
              currentRoute === "a" ? <MainDashboard /> : 
              currentRoute === "b" ? <MyCourses /> : 
              currentRoute === "c" ? <Courses /> : <div> Coming sooon </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default page