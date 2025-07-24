"use client"
import { CheckCircleIcon, XCircleIcon } from "lucide-react";


interface QuizOptionCardProps {
    option: string;
    isCorrect: boolean;
    onClick: () => void;
    isSelected: boolean;
    showResult: boolean;
    index: number;
}

const QuizOptionCard = ({ option, isCorrect, onClick, isSelected, showResult, index }: QuizOptionCardProps) => {
    const colors = ['bg-blue-100', 'bg-purple-100', 'bg-green-100', 'bg-amber-100'];
    const hoverColors = ['hover:bg-blue-200', 'hover:bg-purple-200', 'hover:bg-green-200', 'hover:bg-amber-200'];
    const borderColors = ['border-blue-300', 'border-purple-300', 'border-green-300', 'border-amber-300'];

    let stateClasses = '';
    if (showResult) {
        stateClasses = isCorrect
            ? 'bg-green-50 border-green-400 shadow-green-100'
            : isSelected
                ? 'bg-red-50 border-red-400 shadow-red-100'
                : '';
    } else if (isSelected) {
        stateClasses = 'bg-indigo-50 border-indigo-400 shadow-indigo-100';
    }

    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${colors[index % 4]} ${hoverColors[index % 4]} ${borderColors[index % 4]} ${stateClasses} ${isSelected ? '' : ''}`}
        >
            <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>
                    {String.fromCharCode(65 + index)}
                </div>
                <p className="text-gray-700">{option}</p>
            </div>
            {showResult && isCorrect && (
                <div className="mt-2 flex items-center text-green-600 text-sm">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    Correct Answer
                </div>
            )}
            {showResult && !isCorrect && isSelected && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                    <XCircleIcon className="w-4 h-4 mr-1" />
                    Incorrect
                </div>
            )}
        </div>
    );
};
export default QuizOptionCard