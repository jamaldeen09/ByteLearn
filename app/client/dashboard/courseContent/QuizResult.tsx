"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Trophy, BookOpen, AlertCircle, ArrowLeft, Check, X } from "lucide-react";
import { motion } from "framer-motion";

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
    const results = localStorage.getItem('quizResults');
    if (results) {
      setQuizResults(JSON.parse(results));
      localStorage.removeItem('quizResults');
    }
  }, []);

  if (!quizResults) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 col-span-16">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <button 
          onClick={() => router.push(`/client/dashboard?tab=my-courses&courseId=${courseId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to course
        </button>

        {/* Main result card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`bg-white rounded-3xl shadow-xl overflow-hidden ${quizResults.passed ? 'border-t-4 border-green-500' : 'border-t-4 border-red-500'}`}
        >
          {/* Result banner */}
          <div className={`${quizResults.passed ? 'bg-green-50' : 'bg-red-50'} p-6 text-center`}>
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full ${quizResults.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {quizResults.passed ? (
                  <Trophy className="w-10 h-10" strokeWidth={1.5} />
                ) : (
                  <AlertCircle className="w-10 h-10" strokeWidth={1.5} />
                )}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {quizResults.passed ? 'Quiz Passed!' : 'Quiz Failed'}
            </h1>
            <div className="text-5xl font-extrabold mb-4">
              <span className={quizResults.passed ? 'text-green-600' : 'text-red-600'}>
                {quizResults.percentage}%
              </span>
            </div>
            <p className="text-gray-600">
              {quizResults.correctAnswers} out of {quizResults.totalQuestions} correct answers
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="bg-gray-50 rounded-xl p-5 text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {quizResults.totalQuestions}
              </h3>
              <p className="text-gray-500">Total Questions</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                  <Check className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {quizResults.correctAnswers}
              </h3>
              <p className="text-gray-500">Correct Answers</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-red-100 text-red-600 p-3 rounded-full">
                  <X className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {quizResults.totalQuestions - quizResults.correctAnswers}
              </h3>
              <p className="text-gray-500">Wrong Answers</p>
            </div>
          </div>

          {/* Feedback section */}
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Feedback</h2>
            {quizResults.passed ? (
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <p className="text-green-800">
                  <span className="font-medium">Congratulations!</span> You've demonstrated excellent 
                  understanding of the material. This performance shows your dedication 
                  to learning. Keep up the great work!
                </p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                <p className="text-red-800">
                  <span className="font-medium">Don't worry!</span> This is just a learning opportunity. 
                  Review the material and try again. Every expert was once a beginner - 
                  persistence is key to mastery.
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => router.push(`/client/dashboard?tab=my-courses&courseId=${courseId}`)}
                className="px-8 py-3 hover:cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium hover:shadow-lg transition-all hover:scale-105"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizResult;