"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QuestionMarkIcon } from "@radix-ui/react-icons"
import { CheckCheckIcon, CheckIcon, X } from "lucide-react";

interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  passed: boolean;
}

const QuizResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);



  useEffect(() => {
    // Get results from localStorage
    const results = localStorage.getItem('quizResults');
    if (results) {
      setQuizResults(JSON.parse(results));
      localStorage.removeItem('quizResults'); // Clean up
    } else {
      // Redirect if no results found

    }
  }, []);

  if (!quizResults) {
    return (
      <div className="col-span-14 min-h-[90vh] centered-flex">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-14 min-h-screen flex justify-center py-2 overflow-x-hidden">
      <div className="w-full max-w-6xl bg-gray-50 min-h-full rounded-2xl flex flex-col items-center py-20
      gap-20 px-6 sm:px-10 md:px-6 lg:px-0">
        {/* Header */}
        <div className="w-fit flex items-center space-x-4 flex-wrap  gap-6 lg:gap-0">

          {/* total questions */}
          <div className="h-32 rounded-2xl bg-white w-48 shadow-lg px-6 py-4 flex flex-col justify-between">
            {/*  */}
            <div className="w-full flex justify-between items-center">
              <p className="font-bold text-xl">{quizResults.totalQuestions}</p>
              <span className="bg-gray-400 text-white centered-flex w-6 h-6
               rounded-full"><QuestionMarkIcon /></span>
            </div>

            <div className="w-full text-gray-500">
              <p>Total Questions</p>
            </div>
          </div>

          {/* correct answer */}
          <div className="h-32 rounded-2xl bg-white w-48 shadow-lg px-6 py-4 flex flex-col justify-between">
            {/*  */}
            <div className="w-full flex justify-between items-center">
              <p className="font-bold text-xl">{quizResults.correctAnswers}</p>
              <span className="bg-gray-400 text-white centered-flex w-6 h-6
               rounded-full">{<CheckIcon className="w-4 h-4" />}</span>
            </div>

            <div className="w-full text-gray-500">
              <p>Correct Ansers</p>
            </div>
          </div>

          {/* Wrong answers */}
          <div className="h-32 rounded-2xl bg-white w-48 shadow-lg px-6 py-4 flex flex-col justify-between">
            {/*  */}
            <div className="w-full flex justify-between items-center">
              <p className="font-bold text-xl">{
               quizResults.totalQuestions - quizResults.correctAnswers
              }</p>
              <span className="bg-gray-400 text-white centered-flex w-6 h-6
               rounded-full">{<X className="w-4 h-4" />}</span>
            </div>

            <div className="w-full text-gray-500">
              <p>Wrong answers</p>
            </div>
          </div>

          {/* Total Percentage */}
          <div
            className={`${quizResults.passed ? "bg-green-500" : "bg-red-600"}
            text-white font-bold w-80 sm:w-96 h-40 rounded-2xl centered-flex`}
          >

            <div className="w-fit flex flex-col px-10">
              <h1 className="text-5xl mb-2 sm:m-0">{quizResults.percentage}%</h1>
              {quizResults.passed ? `You passed the quiz with a score of` : "You failed the quiz with a score of"}
            </div>
          </div>
        </div>


        {/* General Feedback */} 
        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-lg flex flex-col px-10 py-10 max-w-5xl">

          <div className="w-full flex flex-col gap-4">
            <h1 className="text-xl font-bold">General Feedback</h1>

            {quizResults.passed ?
              <p className="text-sm">Excellent job! You have demonstrated a strong understanding of the material. Keep up the great work, and you'll continue to excel in your learning journey. This level of performance shows your hard work and dedication paying off.</p>
              : <p className="text-xs sm:text-sm">Don't be discouraged by this score. Everyone starts somewhere, and this is just the beginning of your learning journey. Take this as an opportunity to review the material and strengthen your understanding. With perseverance and practice, you'll get better!</p>
            }

            <div className="w-full">
              <button
                onClick={() => router.push(`/client/dashboard/studentDashboard?tab=my-courses&courseId=${courseId}`)}
                className="mt-6 bg-black text-white hover:cursor-pointer px-6 py-3 rounded-md hover:bg-gray-800 transition-colors
                text-xs sm:text-[1rem]"
              >
                Back to Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;