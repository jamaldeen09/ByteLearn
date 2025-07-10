// import { useState, useCallback } from "react";
// import { useAppSelector } from "@/app/redux/essentials/hooks";
// import QuizComponentItem from "@/app/client/components/reusableComponents/QuizComponentItem";
// import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
// import { quizComponentprops } from "@/app/client/types/types";
// import { useRouter, useSearchParams } from "next/navigation";

// const QuizComponent = ({ topicId }: quizComponentprops) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const courseId = searchParams.get("courseId");
  
//   const findTopic = useAppSelector((state) => state.singleCourse.topics).find(topic => topic._id === topicId);
//   const quiz = findTopic?.quiz || [];
  
//   // State management
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
//   const [showResults, setShowResults] = useState<Record<number, boolean>>({});
//   const [quizResults, setQuizResults] = useState<{
//     totalQuestions: number;
//     correctAnswers: number;
//     percentage: number;
//     passed: boolean;
//   } | null>(null);
  
//   // Get current question
//   const currentQuestion = quiz[currentQuestionIndex];
  
//   // Check if answer is correct
//   const isCorrect = (option: string) => {
//     return option === currentQuestion?.correctAnswer;
//   };
  
//   // Handle answer selection
//   const handleAnswerSelect = useCallback((option: string) => {
//     // Mark this question as answered
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [currentQuestionIndex]: option
//     }));
    
//     // Show results immediately
//     setShowResults(prev => ({
//       ...prev,
//       [currentQuestionIndex]: true
//     }));
//   }, [currentQuestionIndex]);
  
//   // Check if current question has been answered
//   const isQuestionAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
  
//   // Navigation functions
//  // In QuizComponent.tsx
//  const goToNextQuestion = () => {
//     if (currentQuestionIndex < quiz.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       // Calculate results
//       const correctAnswers = Object.entries(selectedAnswers).reduce(
//         (acc, [index, answer]) => 
//           acc + (answer === quiz[parseInt(index)].correctAnswer ? 1 : 0),
//         0
//       );
      
//       const percentage = Math.round((correctAnswers / quiz.length) * 100);
//       const passed = percentage >= 70;
      
//       // Store results in localStorage temporarily
//       localStorage.setItem('quizResults', JSON.stringify({
//         totalQuestions: quiz.length,
//         correctAnswers,
//         percentage,
//         passed
//       }));
      
//       // Route to results page
//       router.push(`/client/dashboard/studentDashboard?tab=my-courses&courseId=${courseId}&quizResults=true`);
//     }
//   };
  
//   const goToPrevQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };
  
//   // Check if continue should be enabled
//   const shouldEnableContinue = isQuestionAnswered && 
//     selectedAnswers[currentQuestionIndex] === currentQuestion?.correctAnswer;

//   if (!currentQuestion) {
//     return <div>No quiz questions available</div>;
//   }

//   return (
//     <div className="flex h-[90vh] col-span-14 flex-col gap-14 items-center">
//       {/* Tiny quiz text */}
//       <div className="w-full px-20">
//         <p className="text-gray-400">Quiz</p>
//       </div>

//       {/* Question area */}
//       <div className="w-full max-w-5xl min-h-[80vh] flex flex-col justify-between">
//         {/* Question */}
//         <div className="flex flex-col gap-8">
//           <div className="w-full centered-flex">
//             <h1 className="font-extrabold text-2xl">{currentQuestion.question}</h1>
//           </div>

//           {/* Progress indicator */}
//           <div className="w-full text-center">
//             Question {currentQuestionIndex + 1} of {quiz.length}
//           </div>

//           {/* options */}
//           <div className="w-full flex flex-col gap-4">
//             {currentQuestion.options.map((option, index) => (
//               <QuizComponentItem
//                 key={index}
//                 option={option}
//                 isCorrect={isCorrect(option)}
//                 clickAnswer={() => handleAnswerSelect(option)}
//                 id={index.toString()}
//                 isSelected={selectedAnswers[currentQuestionIndex] === option}
//                 showResult={showResults[currentQuestionIndex]}
//               />
//             ))}
//           </div>

//           {/* Button to navigate */}
//           <div className="w-full">
//             {shouldEnableContinue ? (
//               <button 
//                 onClick={goToNextQuestion}
//                 className="bg-green-500 text-white font-bold rounded-md px-10 py-3 hover:cursor-pointer hover:brightness-90 transition-all duration-300"
//               >
//                 {currentQuestionIndex < quiz.length - 1 ? 'Continue' : 'Finish Quiz'}
//               </button>
//             ) : (
//               <button className="bg-gray-300 text-gray-400 font-bold rounded-md px-10 py-3 cursor-not-allowed">
//                 {isQuestionAnswered ? 'Try Again' : 'Select an Answer'}
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Next clicker */}
//         <div className="w-full border-t border-gray-300 flex justify-between">
//           <div className="flex items-center space-x-6 py-6">
//             {currentQuestionIndex > 0 && (
//               <div 
//                 className="text-sm centered-flex space-x-2 hover:cursor-pointer"
//                 onClick={goToPrevQuestion}
//               >
//                 <ArrowLeftIcon className="w-4 h-4"/>
//                 <p>Previous</p>
//               </div>
//             )}
//           </div>
          
//           <div className="flex items-center space-x-6 py-6">
//             {currentQuestionIndex < quiz.length - 1 && (
//               <div 
//                 className="text-sm centered-flex space-x-2 hover:cursor-pointer"
//                 onClick={goToNextQuestion}
//               >
//                 <p>Next</p>
//                 <ArrowRightIcon className="w-4 h-4"/>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizComponent;
"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { useAppSelector } from "@/app/redux/essentials/hooks"
import { quizComponentprops } from "@/app/client/types/types"
import QuizComponentItem from "@/app/client/components/reusableComponents/QuizComponentItem"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

const QuizComponent = ({ topicId }: quizComponentprops) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams.get("courseId")
  
  const findTopic = useAppSelector((state) => state.singleCourse.topics).find(topic => topic._id === topicId)
  const quiz = findTopic?.quiz || []
  
  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState<Record<number, boolean>>({})
  const [attempts, setAttempts] = useState<Record<number, {selected: string, isCorrect: boolean}>>({})
  
  // Get current question
  const currentQuestion = quiz[currentQuestionIndex]
  
  // Check if answer is correct
  const isCorrect = (option: string) => {
    return option === currentQuestion?.correctAnswer
  }
  
  // Handle answer selection
  const handleAnswerSelect = useCallback((option: string) => {
    const correct = isCorrect(option)
    
    // Track this attempt
    setAttempts(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        selected: option,
        isCorrect: correct
      }
    }))

    // Mark this question as answered
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }))
    
    // Show results immediately
    setShowResults(prev => ({
      ...prev,
      [currentQuestionIndex]: true
    }))
  }, [currentQuestionIndex])
  
  // Check if current question has been answered
  const isQuestionAnswered = selectedAnswers[currentQuestionIndex] !== undefined
  
  // Navigation functions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Calculate final results including all attempts
      const correctAnswers = Object.values(attempts).filter(
        attempt => attempt.isCorrect
      ).length
      
      const percentage = Math.round((correctAnswers / quiz.length) * 100)
      const passed = percentage >= 70
      
      // Store results including incorrect attempts
      localStorage.setItem('quizResults', JSON.stringify({
        totalQuestions: quiz.length,
        correctAnswers,
        percentage,
        passed,
        attempts: Object.values(attempts),
        finalAnswers: selectedAnswers,
        questions: quiz // Include all questions for review
      }))
      
      router.push(`/client/dashboard/studentDashboard?tab=my-courses&courseId=${courseId}&quizResults=true`)
    }
  }
  
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  if (!currentQuestion) {
    return <div className="col-span-14 centered-flex h-[90vh]">No quiz questions available</div>
  }

  return (
    <div className="flex h-[90vh] col-span-14 flex-col gap-14 items-center  iphone:px-4 max-sm:px-2 sm:px-6
    ">
      {/* Tiny quiz text */}
      <div className="w-full md:px-20">
        <p className="text-gray-400 text-xs sm:text-md">Quiz</p>
      </div>

      {/* Question area */}
      <div className="w-full max-w-5xl min-h-[80vh] flex flex-col justify-between">
        {/* Question */}
        <div className="flex flex-col gap-8">
          <div className="w-full centered-flex">
            <h1 className="font-extrabold iphone:text-xs max-sm:text-sm sm:text-[1rem] md:text-2xl">{currentQuestion.question}</h1>
          </div>

          {/* Progress indicator */}
          <div className="w-full text-center">
            Question {currentQuestionIndex + 1} of {quiz.length}
          </div>

          {/* options */}
          <div className="w-full flex flex-col gap-4">
            {currentQuestion.options.map((option, index) => (
              <QuizComponentItem
                key={index}
                option={option}
                isCorrect={isCorrect(option)}
                clickAnswer={() => handleAnswerSelect(option)}
                id={index.toString()}
                isSelected={selectedAnswers[currentQuestionIndex] === option}
                showResult={showResults[currentQuestionIndex]}
              />
            ))}
          </div>

          {/* Button to navigate */}
          <div className="w-full">
            <button 
              onClick={goToNextQuestion}
              disabled={!isQuestionAnswered}
              className={`${
                isQuestionAnswered 
                  ? 'bg-green-500 hover:brightness-90 cursor-pointer' 
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white font-bold rounded-md px-10 py-3 transition-all duration-300 w-full`}
            >
              {currentQuestionIndex < quiz.length - 1 ? 'Continue' : 'Finish Quiz'}
            </button>
          </div>
        </div>

        {/* Navigation controls */}
        <div className="w-full border-t border-gray-300 flex justify-between">
          <div className="flex items-center space-x-6 py-6">
            {currentQuestionIndex > 0 && (
              <div 
                className="text-sm centered-flex space-x-2 hover:cursor-pointer"
                onClick={goToPrevQuestion}
              >
                <ArrowLeftIcon className="w-4 h-4"/>
                <p>Previous</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-6 py-6">
            {currentQuestionIndex < quiz.length - 1 && (
              <div 
                className="text-sm centered-flex space-x-2 hover:cursor-pointer"
                onClick={goToNextQuestion}
              >
                <p>Next</p>
                <ArrowRightIcon className="w-4 h-4"/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizComponent