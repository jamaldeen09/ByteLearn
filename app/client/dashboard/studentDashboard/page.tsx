"use client"
import { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar"
import MainDashboard from "./content/MainDashboard";
import SidebarNav from "../../components/reusableComponents/SidebarNav";




const page = (): React.ReactElement => {
  const [currentRoute, setCurrentRoute] = useState('a');

  return (
    <div
      className="h-screen bg-white grid md:grid-cols-10 max-lg:grid-cols-14"
    >
      {/* Sidebar A */}
      <Sidebar 
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
      />

    
      <div
        className="md:col-span-9 max-lg:col-span-11 bg-gray-200"
      >

        <div className="h-full border-4 border-green-500">
          <SidebarNav 
            profilePic="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMfPRrW0_4u-15F-1v756VaWkys1zQ4Hzuuw&s"
            firstName="Jamaldeen"
          />

          <div className="grid lg:grid-cols-14">
            {currentRoute === "a" ? <MainDashboard /> : <div> Coming sooon </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default page