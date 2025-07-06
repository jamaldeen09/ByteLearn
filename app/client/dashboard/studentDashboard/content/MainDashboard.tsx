import NewCourseCard from "@/app/client/components/reusableComponents/NewCourseCard"
import OngoingCourse from "@/app/client/components/reusableComponents/OngoingCourse"
import { arrowDown } from "@/app/icons/Icons"


const MainDashboard = () => {
    return (
        <>

            {/* Main Content */}
          
            <div className="overflow-y-auto  lg:col-span-9">
                <div className="basic-border h-[91vh] overflow-hidden px-6 flex flex-col space-y-4 ">
                    {/* Page Title */}
                    <div className="">
                        <h1 className="text-xl font-extrabold">My Dashboard</h1>
                    </div>
                    {/* My courses area */}
                    <div className="bg-white h-[50vh] rounded-2xl w-full max-w-3xl px-6 py-4 overflow-hidden
                hover:shadow-lg transition-shadow duration-300">
                        <div className="">
                            <p className="text-gray-400 flex items-center gap-1 font-bold ">Ongoing Courses <span>{arrowDown}</span></p>
                        </div>

                        {/* ongoing courses display */}
                        <div className="w-full overflow-y-auto h-full py-6">
                            <div className="flex flex-col space-y-4">
                                {Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((i) => {
                                    return <OngoingCourse
                                        key={i}
                                        courseName="Advanced React Patterns"
                                        currentTopic="State Management with Zustand"
                                        progress={65}
                                    />
                                }))}
                            </div>
                        </div>
                    </div>

                    {/* New Courses Area */}
                    <div className="w-full h-fit">

                        {/* New Courses Area Title*/}
                        <div className="">
                            <h1 className="font-bold text-xl">New courses</h1>
                        </div>

                        {/* New Courses */}
                        <div className="h-fit">
                            {Array.from([1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13]).map((i) => {
                                return <NewCourseCard />
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {/* Second sidebar */}
            <div className="bg-yellow-500 centered-flex text-white font-bold text-5xl lg:col-span-5 h-full">
                SECOND SIDE BAR
            </div>
        </>
    )
}

export default MainDashboard