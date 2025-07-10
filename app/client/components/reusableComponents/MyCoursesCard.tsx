"use client"
import { motion } from "framer-motion"
import { MyCoursesCardProps } from "../../types/types"
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/app/redux/essentials/hooks";
import { useRouter } from "next/navigation";

const MyCoursesCard = ({ 
    imgUrl, 
    instructorImg, 
    title, 
    desc, 
    progress,
    instructorsName,
    courseId,
    category
  }: MyCoursesCardProps & { courseId: string }) => {  
  
    const router = useRouter();
    // const progressData = useAppSelector(state => 
    //   state.progress.find(p => p.course === courseId)
    // );
  
    // Ensure progress is between 0-100
    const clampedProgress = Math.min(100, Math.max(0, progress));
  
    // Determine color based on progress
    const progressColor = clampedProgress >= 70
      ? "bg-green-500"
      : clampedProgress >= 40
        ? "bg-yellow-500"
        : "bg-red-500";

        const progressData = useAppSelector(state => 
            state.progress.find(p => p.course === courseId)
          );
          const course = useAppSelector(state => 
            state.coursesSlice.courses.find(c => c.id === courseId)
          );
        
          // Find the last visited topic
          const getLastVisitedTopic = () => {
            if (!progressData?.lastVisitedSkill || !course) return "Start Learning";
            
            for (const topic of course.topics) {
              const skill = topic.skills.find(s => s._id === progressData.lastVisitedSkill);
              if (skill) return topic.title;
            }
            return "Continue Learning";
          };
        
          const lastTopic = getLastVisitedTopic();
    const handleContinueCourse = async () => {
      try {
        // 1. Check if we have a last visited skill
        if (progressData?.lastVisitedSkill) {
          router.push(
            `/client/dashboard/studentDashboard?tab=my-courses&courseId=${courseId}&skillId=${progressData.lastVisitedSkill}`
          );
          return;
        }
  
        // 2. If no last visited skill, go to course overview
        router.push(
          `/client/dashboard/studentDashboard?tab=my-courses&courseId=${courseId}`
        );
        
      } catch (err) {
        console.error("Failed to navigate to continue learning:", err);
      }
    };

    return (
        <motion.div
            whileHover={{ y: -5}}
            className="rounded-xl w-full sm:mx-auto max-lg:mx-0 sm:max-w-lg md:max-w-xl max-lg:max-w-lg mb-6 hover:cursor-pointer border border-gray-300"
        >
            {/* Image Area */}
            <div
                style={{
                    backgroundImage: `url(${imgUrl})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover"
                }}
                className="h-56 rounded-t-xl">
            </div>
            {/* Body */}
            <div className="bg-white px-4 flex flex-col gap-3 py-4 rounded-b-xl">

                {/* category */}
                <div className="flex items-start">
                    <div className="bg-black h-5 rounded-full min-w-16 iphone:text-[0.5rem] sm:text-xs centered-flex px-2 py-3 text-white">
                        <p>{category}</p>
                    </div>
                </div>

                {/* Title */}
                <div className="flex flex-col gap-2">
                    <h1 className="font-extrabold text-md sm:text-xl">{title || "What's Up . April 2020"}</h1>
                    <p className="text-gray-400 iphone:text-[0.7rem] text-xs">Last Topic: {lastTopic}</p>
                </div>

                {/* Description */}
                <div className="">
                    <p className="text-gray-400 text-sm ">
                        {desc}
                    </p>
                </div>

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

                {/* Instructor Info */}
                <div className="flex items-center space-x-3 ">
                    <img
                        src={instructorImg || "https://media.istockphoto.com/id/515264642/photo/happy-teacher-at-desk-talking-to-adult-education-students.jpg?s=612x612&w=0&k=20&c=cpcqqIE9WgVgirdpelsjl2GqwhPFMu5UajW2QG-MOrM="}
                        alt={`The avator of ${title}'s instructor`}
                        className="w-10 h-10 rounded-full"
                    />

                    <div className="flex items-center justify-between w-full">
                        {/* Name */}
                        <div className="centered-flex">
                            <h1 className="font-bold iphone:text-md sm:text-lg">
                                {instructorsName || "Eric Michell"}
                            </h1>
                        </div>

                        {/* continue */}
                        <div className="">
                            <p onClick={handleContinueCourse}
                            className="underline text-sm font-extrabold hover:cursor-pointer hover:brightness-90 transition-all duration-300">Continue</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default MyCoursesCard