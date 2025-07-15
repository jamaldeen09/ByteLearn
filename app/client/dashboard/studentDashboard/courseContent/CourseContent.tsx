"use client"
import { MyCoursesProp } from "@/app/client/types/types"
import axios from "../../../utils/config/axios"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRedirect } from "@/app/client/utils/utils"
import toast from "react-hot-toast"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { getSingleCourse } from "@/app/redux/coursesSlices/singleCourseSlice"
import BlackSpinner from "@/app/client/components/reusableComponents/BlackSpinner"
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons"
import TopicContentDisplay from "@/app/client/components/reusableComponents/TopicContentDisplay"
import { useRouter, useSearchParams } from "next/navigation"
import SkillContent from "./SkillContent"
import QuizResult from "./QuizResult"
import { getCompletedSkills } from "@/app/redux/coursesSlices/completedSkillsSlice"
import { getCourses } from "@/app/redux/coursesSlices/courseSlice"
import { setProgress } from "@/app/redux/coursesSlices/progressSlice"
import Image from 'next/image';
import { singleCourseSchema, SkillsSchema, topicSchema } from "@/app/client/types/types"

const CourseContent = ({ courseId }: MyCoursesProp): React.ReactElement => {
  const searchParams = useSearchParams();
  const rawSingleCourseInformation = useAppSelector((state) => state.singleCourse);

  const singleCourseInformation = useMemo(
    () => rawSingleCourseInformation || { topics: [] },
    [rawSingleCourseInformation]
  );
  const skillId = searchParams.get("skillId");
  const quiz = searchParams.get("quiz");
  const topicId = searchParams.get("topicId");
  const quizResults = searchParams.get("quizResults");
  const router = useRouter();
  const [progressPercentage, setProgressPercentage] = useState<number>(10);
  const dispatch = useAppDispatch();


  // Ensure progress is between 0-100
  const clampedProgress = Math.min(100, Math.max(0, progressPercentage));

  const progressColor = clampedProgress >= 70
    ? "bg-green-500"
    : clampedProgress >= 40
      ? "bg-yellow-500"
      : "bg-red-500";

  const calculateCourseProgress = (course: singleCourseSchema, completedSkills: string[]) => {
    const completedSet = new Set(completedSkills);
    let totalSkills = 0;
    let completedCount = 0;

    course.topics.forEach((topic: topicSchema) => {
      topic.skills.forEach((skill: SkillsSchema) => {
        totalSkills++;
        if (completedSet.has(skill._id.toString())) {
          completedCount++;
        }
      });
    });

    return totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;
  };

  // fetch course details with courseId
  useEffect(() => {

    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/single-course/${courseId}`, { 
          headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } 
        });
        dispatch(getSingleCourse(response.data.courseDetails));
      } catch (err: unknown) {
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
  }, [courseId, dispatch]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/courses");
        dispatch(getCourses(response.data.courses));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, [dispatch]);

  const completedSkillsContainer = useAppSelector(state => state.completedSkills.completedSkills);

  useEffect(() => {
    const fetchCompletedSkills = async () => {
      try {
        const response = await axios.get(`/api/completed-skills/${courseId}`, { 
          headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } 
        });
        dispatch(getCompletedSkills(response.data.completedSkills));
      } catch (err: unknown) {
        if (err instanceof Error && 'response' in err && typeof err.response === 'object' && err.response !== null) {
          const response = err.response as { status?: number, data?: { msg?: string } };
          if (response.status === 401 || response.status === 404) {
            toast.error(response.data?.msg || "Unauthorized");
          } else {
            toast.error("Network error");
          }
        }
      }
    };
    fetchCompletedSkills();
  }, [courseId, dispatch]);

  // Calculate progress whenever course or completed skills change
  useEffect(() => {
    if (singleCourseInformation && singleCourseInformation.topics && completedSkillsContainer) {
      const calculatedProgress = calculateCourseProgress(
        singleCourseInformation,
        completedSkillsContainer.map(skill => skill._id.toString())
      );
      setProgressPercentage(calculatedProgress);
    }
  }, [singleCourseInformation, completedSkillsContainer]);

  const fetchProgressData = useCallback(async () => {
    try {
      const response = await axios.get("/api/progress", {
        headers: { Authorization: `Bearer ${localStorage.getItem("bytelearn_token")}` },
      });
      dispatch(setProgress(response.data.progress));
    } catch (err) {
      console.error("Failed to fetch progress data:", err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  const progressData = useAppSelector(state =>
    state.progress.find(p => p.course === courseId)
  );

  const handleContinueLearning = async () => {
    try {
      if (progressData?.lastVisitedSkill) {
        router.push(
          `/client/dashboard/studentDashboard?tab=my-courses&courseId=${courseId}&skillId=${progressData.lastVisitedSkill}`
        );
        return;
      }

      const allSkills = singleCourseInformation.topics.flatMap((topic: topicSchema) => ({
        ...topic.skills.map((skill: SkillsSchema) => ({
          skillId: skill._id,
          topicId: topic._id,
          isCompleted: completedSkillsContainer.some(c => c._id === skill._id)
        }))
      }));

      const nextSkill = allSkills.find(skill => !skill.isCompleted) || allSkills[0];

      if (nextSkill) {
        router.push(
          `/client/dashboard/studentDashboard?tab=my-courses&courseId=${courseId}&skillId=${nextSkill.skillId}`
        );

        await axios.post('/api/update-last-visited', {
          courseId,
          skillId: nextSkill.skillId,
          topicId: nextSkill.topicId
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("bytelearn_token")}` }
        });
      }
    } catch (err) {
      toast.error("Failed to navigate to continue learning");
      console.error(err);
    }
  };

  if (!courseId) {
    return (
      <div className="h-[90vh] centered-flex">
        <Image
          src="https://landingi.com/wp-content/uploads/2022/03/en_4041-optimized.png"
          alt="An image that tells the user the page they are trying to find does not exist"
          className="w-full max-w-lg"
          width={600}
          height={400}
        />
      </div>
    );
  }

  if (skillId || (quiz === "true" && topicId)) {
    return <SkillContent skillId={skillId ?? ""} />;
  }
  
  if (quizResults) {
    return <QuizResult />;
  }

  if (!singleCourseInformation || !singleCourseInformation.topics) {
    return <BlackSpinner />;
  }

  if (!singleCourseInformation) {
    return (
      <div className="col-span-14 min-h-[90vh] w-full">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/9772/9772025.png"
          alt="An image that illustrates or shows the users that no courses are available"
          className="w-full max-w-lg"
          width={600}
          height={600}
          unoptimized={true}
        />
      </div>
    );
  }

  return (
    <div className="col-span-14 min-h-[90vh]">
      {/* Centralized course display area */}
      <div className="h-full flex flex-col space-y-8 justify-center items-center ">
        {/* course overview text */}
        <div className="w-fit">
          <p className="text-gray-400 text-xs">{`${singleCourseInformation.title}'s overview`}</p>
        </div>

        {/* Course details + topics showcase */}
        <div className="w-full flex justify-center space-y-10 max-lg:space-x-6 px-6 lg:space-x-10
         max-lg:border-black flex-col max-lg:flex-row ">
          {/* card with details*/}
          <div className="w-full max-w-sm border border-gray-200 rounded-xl
          hover:bg-black/10 hover:backdrop-blur-md hover:border-black h-fit transition-all duration-200
          flex flex-col space-y-4 px-6 py-4">

            {/* course image url */}
            <div className="w-full centered-flex min-h-fit py-6">
              <Image
                src={singleCourseInformation.imageUrl ? singleCourseInformation.imageUrl : "https://avatars.githubusercontent.com/u/75042455?s=280&v=4"}
                alt={`${singleCourseInformation.title}'s image url`}
                className="rounded-lg"
                width={128}
                height={80}
                unoptimized={true}
              />
            </div>

            {/* course title + date made */}
            <div className="w-full flex flex-col sapce-y-3">
              <p className="text-[0.9rem]">{singleCourseInformation.title}</p>
              <p className="text-xs text-gray-400">Created: {new Date(singleCourseInformation.dateCreated).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}</p>
            </div>

            {/* Learning progress bar + percentage */}
            <div className="w-full flex flex-col space-y-1">
              <span className="font-medium text-2xl">{clampedProgress}%</span>
              <p className="text-gray-400 text-sm">Learning Progress</p>
            </div>

            {/* Progress bar */}
            <div className="space-y-1 mt-2">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    progressColor
                  )}
                  style={{ width: `${clampedProgress}%` }}
                />
              </div>
            </div>

            {/* continue Learning button */}
            <div className="w-full">
              <button onClick={handleContinueLearning}
                className="w-full bg-black text-white font-bold rounded-md hover:cursor-pointer py-4
               flex justify-center items-center space-x-4">
                <p>Continue Learning</p>
                <span className="">{<ArrowRightIcon className="w-6 h-6" />}</span>
              </button>
            </div>
          </div>

          {/* topics */}
          <div className="overflow-y-auto h-[90vh] w-full max-w-4xl
          flex flex-col space-y-4">
            {singleCourseInformation.topics.map((topic: topicSchema, index: number) => (
              <TopicContentDisplay
                key={index}
                topicTitle={topic.title}
                topicsSkillsTitle={topic.skills}
                selectedSkillId={skillId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;