import { useState } from "react";
import { Check, XIcon } from "lucide-react";
import { TopicContentDisplaySchema } from "../../types/types";
import { arrowDownIcon } from "@/app/icons/Icons";

const TopicContentDisplay = ({ 
  topicTitle, 
  skillsMastered, 
  topicsSkillsTitle, 
  isCompleted,
  showSkillContent,
  id,
}: TopicContentDisplaySchema) => {
  const [isExpanded, setIsExpanded] = useState(false);


  return (
    <div 
      className={`w-full bg-gray-100 rounded-3xl overflow-hidden transition-colors border border-gray-300 hover:cursor-pointer hover:bg-black/10 hover:backdrop-blue-md hover:border-black`}
    >
      {/* Clickable header */}
      <div 
        className="h-20 flex items-center px-5 hover:cursor-pointer justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="fit">
            {isCompleted ? 
              <p className="w-8 h-8 icon centered-flex text-white bg-green-500 rounded-full"><Check /></p>
              : <p className="w-6 h-6 icon centered-flex text-white bg-red-600 rounded-full"><XIcon /></p>
            }
          </div>
          <div className="flex flex-col">
            <p className="text-[0.6rem] sm:text-sm md:text-[1rem]">{topicTitle || "Integration and version control with git"}</p>
            <p className="iphone:text-[0.5rem] text-xs text-gray-400">Skills Mastered: {skillsMastered || 0}</p>
          </div>
        </div>
        <div className="fit flex space-x-2 items-center">
          <p className="text-[0.6rem] sm:text-sm md:text-[1rem]">Details</p>
          <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            {arrowDownIcon}
          </span>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-5 pb-4 border rounded-bl-3xl rounded-br-3xl  border-gray-300 ">
          <div className="pt-2 ">
       
            <ul className="space-y-2 pl-4">
              {topicsSkillsTitle?.map((skill, index) => (
                <li onClick={() => showSkillContent(id)} key={index} className="list-disc hover:cursor-pointer hover:text-blue-500 w-fit
                text-[0.6rem] sm:text-sm md:text-[1rem]">{skill.skillTitle}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicContentDisplay;