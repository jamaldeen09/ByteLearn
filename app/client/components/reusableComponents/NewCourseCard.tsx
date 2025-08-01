"use client"
import { NewCourseCardProps } from "../../types/types";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import CardInfoDisplayModal from "./CardInfoDisplayModal";
import { useState } from "react";

const NewCourseCard = ({ courseImg, instructorImg, instructorName, title, likes, id, getId }: NewCourseCardProps) => {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const handleCardClick = () => {
        getId(id);
        setOpenModal(true);
    };
    

    return (
        <div className="w-full md:max-w-[27rem] overflow-hidden rounded-lg transition-all duration-300 flex flex-col hover:cursor-pointer">
            {/* Card content */}
            <div onClick={handleCardClick}>
                {/* Top: Image + Gradient Overlay */}
                <div className="relative w-full h-90 md:h-76 group">
                    <Image
                        src={courseImg}
                        alt={title}
                        className="w-full h-full object-cover rounded-lg"
                        width={0}
                        height={0}
                        unoptimized={true}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute bottom-0 left-0 w-full h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-b-lg flex justify-between px-4 items-center">
                        <h1 className="text-md max-lg:text-xl text-white font-bold">{title}</h1>
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
            </div>

            {/* Modal - rendered outside the card div */}
            <CardInfoDisplayModal 
                open={openModal} 
                setOpen={setOpenModal} 
                courseId={id}
            />
        </div>
    );
};

export default NewCourseCard;