"use client"
import { NewCourseCardProps } from "../../types/types"
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Heart } from "lucide-react";
import CardInfoDisplayModal from "./CardInfoDisplayModal";
import { useState } from "react";


const NewCourseCard = ({ courseImg, instructorImg, instructorName, title, likes, id, getId }: NewCourseCardProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <div onClick={() => {
      getId(id)
      setOpenModal(true)
    }}
      className="w-full max-w-[27rem] overflow-hidden rounded-lg transition-all duration-300 flex flex-col
    hover:cursor-pointer">
      {/* Top: Image + Gradient Overlay */}
      <div className="relative w-full h-72 group">
        <Image
          src={courseImg}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
          width={0}
          height={0}
          unoptimized={true}
        />

        {/* Gradient Overlay at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
      bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-b-lg flex justify-between px-4 items-center">
          {/* Hover content later */}
          <h1 className="text-xl text-white font-bold">{title}</h1>

          <button onClick={(e) => {
            e.stopPropagation();
          }}
            className="bg-white rounded-full p-3 text-black hover:cursor-pointer hover:brigtness-75 duration-300 centered-flex">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom: Text or Details */}
      <div className="py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            unoptimized={true}
            src={instructorImg}
            alt="Instructor"
            width={30}
            height={30}
            className="rounded-full"
          />
          <p className="text-sm">{instructorName}</p>
        </div>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faHeart} className="text-gray-300 w-4 h-4" />
          <p className="text-gray-400 text-xs">{likes}</p>
        </div>
      </div>
      <CardInfoDisplayModal open={openModal} setOpen={setOpenModal} courseId={id}/>
    </div>

  )
}

export default NewCourseCard