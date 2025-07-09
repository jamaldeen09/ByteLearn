"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
    <div className="col-span-14 min-h-[90vh] centered-flex">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6">Quiz Results</h2>
        
        <div className="space-y-4">
          <p className="text-lg">
            You scored: {quizResults.correctAnswers} out of {quizResults.totalQuestions}
          </p>
          <p className="text-lg">
            Percentage: {quizResults.percentage}%
          </p>
          <p className={`text-lg font-bold ${
            quizResults.passed ? 'text-green-500' : 'text-red-500'
          }`}>
            {quizResults.passed ? 'Congratulations! You passed!' : 'You need more practice.'}
          </p>
          
          <button 
            onClick={() => router.push(`/client/dashboard/studentDashboard?tab=my-courses&courseId=${courseId}`)}
            className="mt-6 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;