import { CheckIcon, XIcon } from "lucide-react";
import { QuizItemProps } from "../../types/types";

const QuizComponentItem = ({ 
  option, 
  isCorrect, 
  clickAnswer, 
  id, 
  isSelected, 
  showResult 
}: QuizItemProps) => {
  // Determine the styling based on selection and correctness
  let bgColor = "bg-gray-100";
  let borderColor = "border-gray-300";
  const hoverStyles = "hover:bg-black/10 hover:border-black"; 
  
  if (showResult) {
    if (isCorrect) {
      bgColor = "bg-green-100";
      borderColor = "border-green-500";
    } else if (isSelected && !isCorrect) {
      bgColor = "bg-red-100";
      borderColor = "border-red-500";
    }
  } else if (isSelected) {
    bgColor = "bg-blue-100";
    borderColor = "border-blue-500";
  }

  return (
    <div
      onClick={() => !showResult && clickAnswer(id)}
      className={`${bgColor} ${borderColor} ${!showResult ? hoverStyles : ''}
        flex justify-between items-center px-4 h-20 rounded-2xl transition-colors duration-200`}
    >
      <div className="fit">
        <p>{option}</p>
      </div>

      <div className="">
        {showResult && isCorrect && (
          <span className="p-1 rounded-lg centered-flex text-white font-bold bg-green-500">
            <CheckIcon className="w-4 h-4"/>
          </span>
        )}
        {showResult && isSelected && !isCorrect && (
          <span className="p-1 rounded-lg centered-flex text-white font-bold bg-red-500">
            <XIcon className="w-4 h-4"/>
          </span>
        )}
      </div>
    </div>
  );
};

export default QuizComponentItem;