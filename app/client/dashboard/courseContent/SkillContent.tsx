// import { useSearchParams, useRouter } from 'next/navigation';
// import { useAppSelector } from '@/app/redux/essentials/hooks';
// import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@radix-ui/react-icons';
// import { cn } from '@/lib/utils';
// import { useEffect, useRef, useState } from 'react';
// import toast from 'react-hot-toast';
// import axios from "../../utils/config/axios"
// import QuizComponent from './QuizComponent';

// const SkillContent = ({ skillId }: { skillId: string }) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const courseId = searchParams.get('courseId');

//   const currentTab = searchParams.get('tab') || 'my-courses';

//   const quiz = searchParams.get('quiz');
//   const topicId = searchParams.get('topicId');
//   const questionContainerRef = useRef<HTMLDivElement | null>(null)
//   const [activateRef, setActivateRef] = useState<boolean>(false);


//   // Get all skills from all topics
//   const topics = useAppSelector(state => state.singleCourse.topics) || [];
//   const allSkills = topics.flatMap(topic => topic.skills || []);

//   // Find current skill index and total count
//   const currentIndex = allSkills.findIndex(skill => skill._id === skillId);
//   const totalSkills = allSkills.length;
//   const currentSkill = allSkills[currentIndex];

//   // Progress calculation
//   const progressPercentage = Math.round(((currentIndex + 1) / totalSkills) * 100);
//   const clampedProgress = Math.min(100, Math.max(0, progressPercentage));

//   // Progress bar color logic
//   const progressColor = clampedProgress >= 70
//     ? "bg-green-500"
//     : clampedProgress >= 40
//       ? "bg-yellow-500"
//       : "bg-red-500";

//   // Navigation handlers
//   const goToNextSkill = () => {
//     setCompleted(false);
//     setActivateRef(true);

//     window.scrollTo({ top: 0, behavior: 'instant' });
//     if (currentIndex < totalSkills - 1) {
//       const nextSkillId = allSkills[currentIndex + 1]._id;
//       router.push(`/client/dashboard?tab=${currentTab}&courseId=${courseId}&skillId=${nextSkillId}`);
//     } else {

//       const parentTopic = topics.find(topic =>
//         topic.skills.some(skill => skill._id === skillId)
//       );
//       const topicId = parentTopic?._id;
      
//       if (topicId) {
//         router.push(`/client/dashboard?tab=${currentTab}&courseId=${courseId}&topicId=${topicId}&quiz=true`);
//       } else {
//         toast.error("Topic not found for quiz routing");
//       }
//     }
//   };

//   const goToPrevSkill = () => {
//     setCompleted(false);
//     setActivateRef(true);
//     if (currentIndex > 0) {
//       const prevSkillId = allSkills[currentIndex - 1]._id;
//       router.push(`/client/dashboard?tab=${currentTab}&courseId=${courseId}&skillId=${prevSkillId}`);
//     } else {
//       // If on first skill, go back to course overview
//       router.push(`/client/dashboard?tab=${currentTab}&courseId=${courseId}`);
//     }
//   };

//   const [completed, setCompleted] = useState(false);

//   // make api fetch request to the endpoint
//   const markSkillCompleted = async () => {
//     axios.post("/api/mark-skill-as-completed", {
//       courseId: courseId,
//       skillId: skillId
//     }, { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } })
//       .then(() => {
//         setCompleted(true);
//       }).catch((err) => {
//         console.error(err)
//         if (err.response.status === 401) {
//           toast.error("Unauthorized")
//           return;
//         } else if (err.response.status === 404) {
//           toast.error(err.response.data.msg)
//           return;
//         } else if (err.response.status === 409) {
//           return;
//         } else {
//           toast.error("Network error")
//           return;
//         }
//       })
//   };

//   const handleComplete = async () => {
//     await markSkillCompleted();
//     setCompleted(true);
//   };

//   useEffect(() => {
//     // Scroll to top on initial load or when skill changes
//     window.scrollTo({ top: 0, behavior: 'smooth' });
    
    
//     if (questionContainerRef.current && activateRef) {
//       questionContainerRef.current.scrollIntoView({ 
//         behavior: "smooth",
//         block: "start"
//       });
//       setActivateRef(false);
//     }
//   }, [skillId, activateRef]);

//   if (quiz === "true" && topicId) {
//     return <QuizComponent topicId={topicId} />
//   }

 
//   return (
//     <div  ref={questionContainerRef}  className="col-span-14 min-h-[90vh] flex md:justify-center py-6 
//     overflow-x-hidden sm:px-0 md:px-6 lg:px-0">
//       <div className="w-full max-w-5xl flex flex-col gap-10">
//         {/* Header with progress */}
//         <div className="flex flex-col space-y-2 px-4 sm:px-4 md:px-0 ">
//           <div className="w-full flex justify-between items-center">
//             <h1 className="max-sm:text-lg sm:text-2xl font-bold">{currentSkill?.skillTitle}</h1>
//             <p className="text-lg">{currentIndex + 1}/{totalSkills}</p>
//           </div>

//           {/* Progress bar */}
//           <div className="space-y-1">
//             <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//               <div
//                 className={cn(
//                   "h-full rounded-full transition-all duration-700",
//                   progressColor
//                 )}
//                 style={{ width: `${clampedProgress}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Content renderer */}
//         <div className="w-full py-4 flex flex-col items-center justify-between space-y-10">
//           <div
           
//             className="prose w-full iphone:px-4 sm:px-4 md:max-w-none md:px-0"
//             dangerouslySetInnerHTML={{ __html: currentSkill?.content || '' }}
//           />

//           <div className="flex justify-between items-center w-full px-4">
//             <button
//               onClick={goToPrevSkill}
//               className={`hover:cursor-pointer w-10 h-10 sm:w-10 sm:h-10 md:w-16 md:h-14 rounded-lg border-black text-black centered-flex border backdrop-blur-md transition-all ${currentIndex === 0
//                 ? 'opacity-50 cursor-not-allowed'
//                 : 'bg-black/10 hover:bg-black/20'
//                 }`}
//               disabled={currentIndex === 0}
//             >
//               <ArrowLeftIcon className="w-6 h-6" />
//             </button>

//             <button
//               onClick={handleComplete}
//               className={`${completed ? "bg-green-500" : "bg-green-100"
//                 } iphone:px-4 max-sm:px-6 sm:px-8 py-3 rounded-lg hover:cursor-pointer centered-flex space-x-4`}
//             >
//               <span className={`border-2 h-4 w-4 ${completed ? "border-white text-white" : "border-green-400 text-green-400"
//                 } centered-flex`}>
//                 {completed && <CheckIcon className="w-6 h-6" />}
//               </span>
//               <p className={`${completed ? "text-white" : "text-green-400"}`}>
//                 Mark as completed
//               </p>
//             </button>

//             <button
//               onClick={goToNextSkill}
//               className={`w-10 h-10 sm:w-10 sm:h-10 md:w-16 md:h-14 rounded-lg border-black centered-flex border backdrop-blur-md transition-all ${!completed
//                 ? 'bg-gray-300 border-gray-500 text-gray-400'
//                 : currentIndex === totalSkills - 1
//                   ? 'bg-black text-white hover:bg-black  hover:cursor-pointer w-10 h-10'
//                   : 'bg-black/10 text-black hover:bg-black/20'
//                 }`}
//               disabled={!completed}
//             >
//               {currentIndex === totalSkills - 1 ? (
//                 <span className="text-xs sm:text-sm">Finish</span>
//               ) : (
//                 <ArrowRightIcon className="w-6 h-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SkillContent
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/redux/essentials/hooks';
import { ArrowLeft, ArrowRight, Check, Bookmark, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import axios from "../../utils/config/axios"
import QuizComponent from './QuizComponent';

const SkillContent = ({ skillId }: { skillId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const currentTab = searchParams.get('tab') || 'my-courses';
  const quiz = searchParams.get('quiz');
  const topicId = searchParams.get('topicId');
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [activateRef, setActivateRef] = useState<boolean>(false);

  // Get all skills from all topics
  const topics = useAppSelector(state => state.singleCourse.topics) || [];
  const allSkills = topics.flatMap(topic => topic.skills || []);
  const currentIndex = allSkills.findIndex(skill => skill._id === skillId);
  const totalSkills = allSkills.length;
  const currentSkill = allSkills[currentIndex];

  // Progress calculation
  const progressPercentage = Math.round(((currentIndex + 1) / totalSkills) * 100);
  const clampedProgress = Math.min(100, Math.max(0, progressPercentage));

  const [completed, setCompleted] = useState(false);

  const markSkillCompleted = async () => {
    try {
      await axios.post("/api/mark-skill-as-completed", {
        courseId: courseId,
        skillId: skillId
      }, { 
        headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } 
      });
      setCompleted(true);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Please login again");
      } else if (err.response?.status === 404) {
        toast.error(err.response.data.msg);
      } else if (err.response?.status !== 409) {
        toast.error("Couldn't mark as completed");
      }
    }
  };

  const goToNextSkill = () => {
    setCompleted(false);
    setActivateRef(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    if (currentIndex < totalSkills - 1) {
      const nextSkillId = allSkills[currentIndex + 1]._id;
      router.push(`/client/dashboard?tab=${currentTab}&courseId=${courseId}&skillId=${nextSkillId}`);
    } else {
      const parentTopic = topics.find(topic => topic.skills.some(skill => skill._id === skillId));
      if (parentTopic?._id) {
        router.push(`/client/dashboard?tab=${currentTab}&courseId=${courseId}&topicId=${parentTopic._id}&quiz=true`);
      } else {
        toast.error("Couldn't find topic for quiz");
      }
    }
  };

  const goToPrevSkill = () => {
    setCompleted(false);
    setActivateRef(true);
    if (currentIndex > 0) {
      const prevSkillId = allSkills[currentIndex - 1]._id;
      router.push(`/client/dashboard?tab=${currentTab}&courseId=${courseId}&skillId=${prevSkillId}`);
    } else {
      router.push(`/client/dashboard?tab=${currentTab}&courseId=${courseId}`);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (contentContainerRef.current && activateRef) {
      contentContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      setActivateRef(false);
    }
  }, [skillId, activateRef]);

  if (quiz === "true" && topicId) {
    return <QuizComponent topicId={topicId} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 col-span-16">
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
                className={`h-full rounded-full ${
                  clampedProgress >= 70 ? 'bg-green-500' :
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
          ref={contentContainerRef}
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
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-600">Previous</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={markSkillCompleted}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              completed 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            {completed ? (
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
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
              !completed 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : currentIndex === totalSkills - 1 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                  : 'bg-black text-white hover:bg-gray-800'
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