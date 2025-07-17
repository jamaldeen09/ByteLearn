import { useState } from "react";
import { Check, XIcon } from "lucide-react";
import { TopicContentDisplaySchema } from "../../types/types";
import { arrowDownIcon } from "@/app/icons/Icons";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux/essentials/hooks";

const TopicContentDisplay = ({ 
  topicTitle, 
  topicsSkillsTitle,
  selectedSkillId
}: TopicContentDisplaySchema) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get completed skills from Redux store
  const completedSkills = useAppSelector(state => state.completedSkills.completedSkills);
  
  // Calculate how many skills are completed in this topic
  const skillsMastered = topicsSkillsTitle?.filter(skill => 
    completedSkills.some(completed => completed._id === skill._id)
  ).length || 0;
  
  // Check if all skills in this topic are completed
  const isTopicCompleted = skillsMastered === topicsSkillsTitle?.length;

  const handleSkillClick = (skillId: string) => {
    const currentTab = searchParams.get("tab") || "my-courses";
    const courseId = searchParams.get("courseId");
    router.push(`/client/dashboard?tab=${currentTab}&courseId=${courseId}&skillId=${skillId}`);
  };

  return (
    <div className={`w-full bg-gray-100 rounded-3xl overflow-hidden transition-colors border border-gray-300 hover:cursor-pointer hover:bg-black/10 hover:backdrop-blue-md hover:border-black`}>
      {/* Clickable header */}
      <div 
        className="h-16 sm:h-20 flex items-center px-3 sm:px-5 hover:cursor-pointer justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center iphone:space-x-2 sm:space-x-6">
          <div className="fit">
            {isTopicCompleted ? (
              <p className="iphone:p-[0.1rem] sm:p-1 icon centered-flex text-white bg-green-500 rounded-full">
                <Check className="w-4 h-4"/>
              </p>
            ) : (
              <p className="iphone:p-[0.1rem] sm:p-1icon centered-flex text-white bg-red-600 rounded-full">
                <XIcon  className="w-4 h-4"/>
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-[0.6rem] sm:text-sm md:text-[1rem]">
              {topicTitle}
            </p>
            <p className="iphone:text-[0.5rem] sm:text-xs text-gray-400">
              Skills Mastered: {skillsMastered} of {topicsSkillsTitle?.length}
            </p>
          </div>
        </div>
        <div className="fit flex space-x-2 items-center">
          <p className="text-[0.6rem] sm:text-sm md:text-[1rem]">Details</p>
          <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            {arrowDownIcon}
          </span>
        </div>
      </div>

      {/* Skills list */}
      {isExpanded && (
        <div className="px-5 pb-4 border rounded-bl-3xl rounded-br-3xl border-gray-300">
          <div className="pt-2">
            <ul className="space-y-2 pl-4">
              {topicsSkillsTitle?.map((skill, index) => {
                const isCompleted = completedSkills.some(
                  completed => completed._id === skill._id
                );
                
                return (
                  <li 
                    key={index} 
                    onClick={() => handleSkillClick(skill._id)} 
                    className={`list-disc hover:cursor-pointer w-fit text-[0.6rem] sm:text-sm md:text-[1rem] ${
                      isCompleted ? 'text-green-500' : 'hover:text-blue-500'
                    } ${
                      selectedSkillId === skill._id ? 'font-bold text-blue-600' : ''
                    }`}
                  >
                    {skill.skillTitle}
                    {isCompleted && (
                      <Check className="w-4 h-4 ml-2 inline" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicContentDisplay;

