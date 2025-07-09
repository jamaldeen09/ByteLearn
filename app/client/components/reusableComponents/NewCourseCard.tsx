"use client"
import { motion } from "framer-motion"
import { NewCourseCardProps } from "../../types/types"


const NewCourseCard = ({ courseImg, instructorImg, instructorName, dateOfCreation, description, title, category }: NewCourseCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.3, type: "spring", damping: 10, stiffness:100 }}
      className="rounded-xl sm:w-[80vw] md:w-[60vw] max-lg:w-full mb-6 hover:cursor-pointer border border-gray-300"
    >
      {/* Image Area*/}
      <div
        style={{
          backgroundImage: `url(${courseImg})`,
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
          <div className="bg-blue-300 h-5 rounded-full min-w-16 iphone:text-[0.5rem] sm:text-xs centered-flex px-2 py-3 text-blue-800">
            <p>{category || "space and science"}</p>
          </div>
        </div>

        {/* Title */}
        <div className="">
          <h1 className="font-extrabold text-md sm:text-xl">{title || "What's Up . April 2020"}</h1>
        </div>

        {/* Description */}
        <div className="">
          <p className="text-gray-400 iphone:text-[0.5rem]  sm:text-xs">
            {description || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus recusandae vitae placeat blanditiis quaerat eligendi non nam fugit ducimus nostrum quia hic modi vel esse id numquam, veritatis consectetur. Libero. Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat inventore dicta quisquam. Ipsa praesentium unde est qui impedit, odio aspernatur natus eligendi"}
          </p>
        </div>

        {/* Instructor Info */}
        <div className="flex items-start space-x-3 flex-col gap-4 lg:flex-row lg:items-center lg:gap-0">
          <img
            src={instructorImg || "https://media.istockphoto.com/id/515264642/photo/happy-teacher-at-desk-talking-to-adult-education-students.jpg?s=612x612&w=0&k=20&c=cpcqqIE9WgVgirdpelsjl2GqwhPFMu5UajW2QG-MOrM="}
            alt={`The avator of ${title}'s instructor`}
            className="w-10 h-10 rounded-full"
          />

          <div className="flex items-center justify-between w-full">
            {/* Name */}
            <div className="flex flex-col">
            <h1 className="font-bold iphone:text-md sm:text-lg">
              {instructorName || "Eric Michell"}
            </h1>
            <p className="iphone:text-[0.5rem] sm:text-xs text-gray-400">Topics: 3</p>
            </div>

            <div className="iphone:text-[0.5rem] sm:text-xs bg-orange-300 text-orange-600 p-2 rounded-r-sm rounded-tl-lg relative">
              {dateOfCreation || "Published at 19 March"}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default NewCourseCard
