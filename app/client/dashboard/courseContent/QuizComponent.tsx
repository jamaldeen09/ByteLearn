"use client"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useAppDispatch } from "@/app/redux/essentials/hooks"
import { ArrowLeftIcon, ArrowRightIcon, BookmarkIcon, TrophyIcon } from "lucide-react"
import QuizOptionCard from "../../components/reusableComponents/QuizOptionCard"
import axios from "../../utils/config/axios"
import toast from "react-hot-toast"
import { singleCourseSchema } from "../../types/types"
import QuizLoader from "../../components/reusableComponents/QuizLoader"

const QuizComponent = ({ courseId }: { courseId: string }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()


  // Get course quiz instead of topic quiz
  const [course, setCourse] = useState<singleCourseSchema | null>(null)
  const [loadingCourse, setLoadingCourse] = useState<boolean>(false);

  useEffect(() => {
    setLoadingCourse(true)
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/single-course/${courseId}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }
        });
        setCourse(response.data.courseDetails)
        setLoadingCourse(false)
      } catch (err: unknown) {
        setLoadingCourse(false)
        if (err instanceof Error && 'response' in err && typeof err.response === 'object' && err.response !== null) {
          const response = err.response as { status?: number, data?: { msg?: string } };
          if (response.status === 401 || response.status === 403) {
            router.push("/client/auth/login");
          } else if (response.status === 404) {
            toast.error(response.data?.msg || "Not found");
          } else {
            console.error(err);
            toast.error("A server error occurred. Please bear with us");
          }
        } else {
          console.error(err);
          toast.error("An unexpected error occurred");
        }
      }
    };

    fetchCourse();
  }, [courseId, dispatch, router]);



  const quiz = course?.quiz || []

  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState<Record<number, boolean>>({})
  const [attempts, setAttempts] = useState<Record<number, { selected: string, isCorrect: boolean }>>({})

  // Get current question
  const currentQuestion = quiz[currentQuestionIndex]

  // Check if answer is correct
  const isCorrect = useCallback((option: string) => {
    return option === currentQuestion?.correctAnswer
  }, [currentQuestion?.correctAnswer])

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
  }, [currentQuestionIndex, isCorrect])

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
        questions: quiz
      }))

      router.push(`/client/dashboard?tab=my-courses&courseId=${courseId}&quizResults=true`)
    }
  }

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }


  return (
    loadingCourse ? <QuizLoader /> : !currentQuestion ? (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 col-span-16">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            </svg>
          </div>

          <h3 className="text-2xl font-medium text-gray-900 mb-2">No Quiz Available</h3>
          <p className="text-gray-600 mb-6">
            This course doesn&apos;t have any quiz questions yet. Check back later or continue learning.
          </p>

          <button
            onClick={() => router.push("")}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    ) : <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 col-span-16 centered-flex">
      {/* Quiz Header */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg sm:text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Knowledge Check
          </h1>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
              <BookmarkIcon className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-500">
              Question {currentQuestionIndex + 1}/{quiz.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 transition-all duration-300 hover:shadow-2xl">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
              {currentQuestion.question}
            </h2>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <QuizOptionCard
                  key={index}
                  option={option}
                  isCorrect={isCorrect(option)}
                  onClick={() => handleAnswerSelect(option)}
                  isSelected={selectedAnswers[currentQuestionIndex] === option}
                  showResult={showResults[currentQuestionIndex]}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={goToPrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center space-x-2 px-6 py-3  hover:cursor-pointer rounded-lg transition-all ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-600">Previous</span>
          </button>

          <button
            onClick={goToNextQuestion}
            disabled={!isQuestionAnswered}
            className={`px-8 py-3 rounded-lg hover:cursor-pointer font-medium text-white transition-all transform hover:scale-105 ${!isQuestionAnswered ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg'}`}
          >
            {currentQuestionIndex < quiz.length - 1 ? (
              <div className="flex items-center space-x-2">
                <span>Next Question</span>
                <ArrowRightIcon className="w-5 h-5" />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Finish Quiz</span>
                <TrophyIcon className="w-5 h-5" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizComponent