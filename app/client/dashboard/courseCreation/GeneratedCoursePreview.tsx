
"use client"
import { courseSchema } from "../../types/types";

type generatedCoursePreview = {
  course: courseSchema,
  onPublish: (id: string) => void;
  onDraft: (id: string) => void;
}

const GeneratedCoursePreview = ({ course, onPublish, onDraft }: generatedCoursePreview) => {
    // Mock data in case no course is provided (for design purposes)
  
    return (
      <div className="flex-1">
        <div className="h-full bg-white rounded-xl md:rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
          {/* Course Header - Mobile Optimized */}
          <div className="relative h-36  bg-gray-900 overflow-hidden">
            <div className="absolute inset-0 bg-gray-900  p-4 sm:p-6 flex flex-col justify-end
              h-fit">
              <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                  {course?.category}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{course.title}</h2>
            </div>
          </div>
  
          {/* Course Body - Mobile Optimized */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <p className="text-gray-700 text-sm sm:text-base">{course?.description}</p>
            
            <div className="border-t border-gray-100 pt-3 sm:pt-4">
              <h3 className="font-medium text-base sm:text-lg mb-3 sm:mb-4">Course Content</h3>
              
              <div className="space-y-4 sm:space-y-6">
                {course?.topics.map((topic, index) => (
                  <div key={index} className="border-l-2 border-gray-800 pl-3 sm:pl-4">
                    <h4 className="font-medium flex items-center text-sm sm:text-base">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-800 text-white rounded-full flex items-center justify-center mr-2 text-xs sm:text-sm">
                        {index + 1}
                      </span>
                      {topic.title}
                    </h4>
                    
                    <ul className="mt-2 sm:mt-3 space-y-2 sm:space-y-3 ml-6 sm:ml-8">
                      {topic.skills.map((skill, skillIndex) => (
                        <li key={skillIndex} className="flex items-start">
                          <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 mr-2 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <div>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">{skill.skillTitle}</p>
            
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Action Buttons - Stacked on Mobile */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4">
              <button onClick={() => onPublish(course?._id)}
              className={`w-full sm:flex-1 bg-gray-900 text-white py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base`}>
                <p>Publish Course</p>
              </button>
              <button 
              onClick={() => onDraft(course?._id)}
              className="w-full sm:flex-1 border border-gray-300 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base">
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default GeneratedCoursePreview;