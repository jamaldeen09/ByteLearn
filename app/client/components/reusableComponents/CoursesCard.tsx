"use client"
import { CourseCard } from "@/app/client/types/types";

import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, User, X } from "lucide-react";
import { useState } from "react";

const CourseCardComponent = ({ imageUrl,
    title,
    description,
    creator,
    topics }: CourseCard) => {

    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <motion.div
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3, type: "spring", damping: 10, stiffness: 100 }}
            layout
            className="rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow 
            w-full max-w-xl max-lg:w-full"
        >
            {/* Course Image */}
            <div className="h-64 bg-gray-200 relative">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Course Content */}
            <div className="p-4">

                <div className="rounded-full bg-orange-200 text-orange-500 px-2 text-[0.8rem] py-1 max-w-fit mb-4">
                    <p>Technology</p>
                </div>
                {/* Title and Description */}
                <div>
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{description}</p>
                </div>

                {/* Creator Info */}
                <div className="flex items-center mt-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden mr-2">
                        {creator.imageUrl ? (
                            <img
                                src={creator.imageUrl}
                                alt={creator.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-5 h-5 text-gray-500 m-1.5" />
                        )}
                    </div>
                    <span className="text-sm text-gray-700">{creator.name}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-4">
                    <button className="px-4 py-2 bg-black rounded-full text-sm font-extrabold text-white hover:bg-black/90 hover:cursor-pointer transition-colors">
                        Enroll Now
                    </button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-1 text-sm text-black hover:cursor-pointer"
                    >
                        {isExpanded ? (
                            <>
                                <X size={16} /> Close
                            </>
                        ) : (
                            <>
                                <ChevronDown size={16} /> View Topics
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Topics Section - Animated */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50 border-t"
                    >
                        <div className="p-4">
                            <h4 className="font-medium mb-2">Course Topics:</h4>
                            <ul className="space-y-2">
                                {topics.map((topic, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        <span className="text-gray-700">{topic}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>

    )
}

export default CourseCardComponent