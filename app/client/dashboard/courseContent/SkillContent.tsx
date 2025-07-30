import { useSearchParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/redux/essentials/hooks';
import { ArrowLeft, ArrowRight, Check, Bookmark, Trophy, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import axios from "../../utils/config/axios"
import QuizComponent from './QuizComponent';
import { AxiosError } from 'axios';
import { markSkillAsCompleted, unmarkSkillCompleted } from '@/app/redux/coursesSlices/completedSkillsSlice';



const SkillContent = ({ skillId }: { skillId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');


  const currentTab = searchParams.get('tab') || 'my-courses';
  const showQuiz = searchParams.get('quiz');
  const [isMarkingComplete, setIsMarkingComplete] = useState<boolean>(false);


  // Get all skills from all topics
  const course = useAppSelector(state => state.singleCourse);
  const topics = course?.topics || [];
  const allSkills = topics.flatMap(topic => topic.skills || []);
  const currentIndex = allSkills.findIndex(skill => skill._id === skillId);
  const totalSkills = allSkills.length;
  const currentSkill = allSkills[currentIndex];
  const topRef = useRef<HTMLDivElement>(null);


  // Progress calculation
  const progressPercentage = Math.round(((currentIndex + 1) / totalSkills) * 100);
  const clampedProgress = Math.min(100, Math.max(0, progressPercentage));
  const dispatch = useAppDispatch()

  const [completed, setCompleted] = useState(false);



  const markSkillCompleted = async () => {

    if (!courseId) {
      toast.error("Course ID is missing");
      return;
    }
    setIsMarkingComplete(true);
    dispatch(markSkillAsCompleted({ courseId, skillId }))
  
    try {
      await axios.post("/api/mark-skill-as-completed", {
        courseId: courseId,
        skillId: skillId
      }, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }
      });
    } catch (err: unknown) {
      console.error(err);
      dispatch(unmarkSkillCompleted({ courseId, skillId }));

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast.error("Please login again");
        } else if (err.response?.status === 404) {
          toast.error(err.response.data.msg);
        } else if (err.response?.status !== 409) {
          toast.error("Couldn't mark as completed");
        }
      }
    } finally {
      setIsMarkingComplete(false);
      setCompleted(true);
    }
  };

  const goToNextSkill = () => {
    setCompleted(false);
    



    if (currentIndex < totalSkills - 1) {
      const nextSkillId = allSkills[currentIndex + 1]._id;
      router.push(`/client/dashboard?tab=${currentTab}&courseId=${courseId}&skillId=${nextSkillId}`);
    } else {
      router.push(`/client/dashboard?tab=${currentTab}&courseId=${courseId}&quiz=true`);
    }
  };

  const goToPrevSkill = () => {
    setCompleted(false);



    if (currentIndex > 0) {
      const prevSkillId = allSkills[currentIndex - 1]._id;
      router.push(`/client/dashboard?tab=${currentTab}&courseId=${courseId}&skillId=${prevSkillId}`);
    } else {
      router.push(`/client/dashboard?tab=${currentTab}&courseId=${courseId}`);
    }

  };

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [skillId]);


  if (showQuiz === "true" && courseId) {
    return <QuizComponent courseId={courseId} />
  }

  return (
    <div ref={topRef} className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 col-span-16">
      <div className="w-full mx-auto">
        {/* Header with progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => router.push(`/client/dashboard?tab=${currentTab}&courseId=${courseId}`)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to course
            </button>

            <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm">
              <Bookmark className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">
                Skill {currentIndex + 1} of {totalSkills}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6 mt-10">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{clampedProgress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${clampedProgress}%` }}
                transition={{ duration: 0.8, type: 'spring' }}
                className={`h-full rounded-full ${clampedProgress >= 70 ? 'bg-green-500' :
                  clampedProgress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
              />
            </div>
          </div>

          {/* Skill title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 mt-10"
          >
            {currentSkill?.skillTitle}
          </motion.h1>
        </div>

        {/* Content - Horizontal scroll only on mobile */}
        <div
          className="sm:overflow-x-auto md:overflow-x-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mb-8"
        >
          <div
            className="bg-white rounded-2xl  shadow-lg prose max-w-none p-6 md:p-8 sm:min-w-[calc(100vw-3rem)] md:min-w-full"
            dangerouslySetInnerHTML={{ __html: currentSkill?.content || '' }}
          />
        </div>

        {/* Navigation controls */}
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrevSkill}
            disabled={currentIndex === 0}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg  hover:cursor-pointer transition-all ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-600">Previous</span>
          </motion.button>


          <motion.button
            whileHover={{ scale: completed ? 1 : 1.05 }}
            whileTap={{ scale: completed ? 1 : 0.95 }}
            onClick={markSkillCompleted}
            disabled={isMarkingComplete}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${completed
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              } ${isMarkingComplete ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'}`}
          >
            {isMarkingComplete ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : completed ? (
              <>
                <Check className="w-5 h-5" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Mark Complete</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNextSkill}
            disabled={!completed}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${!completed
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : currentIndex === totalSkills - 1
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                : 'bg-black text-white hover:bg-gray-800  hover:cursor-pointer'
              }`}
          >
            {currentIndex === totalSkills - 1 ? (
              <>
                <span>Finish Topic</span>
                <Trophy className="w-5 h-5" />
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SkillContent;