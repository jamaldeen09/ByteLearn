"use client"
import { MyCoursesProp } from "@/app/client/types/types"
import axios from "../../utils/config/axios"
import { useCallback, useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { getSingleCourse } from "@/app/redux/coursesSlices/singleCourseSlice"
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons"
import TopicContentDisplay from "@/app/client/components/reusableComponents/TopicContentDisplay"
import { useRouter, useSearchParams } from "next/navigation"
import SkillContent from "./SkillContent"
import QuizResult from "./QuizResult"
import { getCompletedSkills } from "@/app/redux/coursesSlices/completedSkillsSlice"
import { setProgress, updateSnapshottedCourse } from "@/app/redux/coursesSlices/progressSlice"
import Image from 'next/image';
import { singleCourseSchema, SkillsSchema, topicSchema } from "@/app/client/types/types"

const CourseContent = ({ courseId }: MyCoursesProp) => {
  const searchParams = useSearchParams();
  const rawSingleCourseInformation = useAppSelector((state) => state.singleCourse);

  const singleCourseInformation = useMemo(
    () => rawSingleCourseInformation || { topics: [] },
    [rawSingleCourseInformation]
  );
  const skillId = searchParams.get("skillId");
  const showQuiz = searchParams.get("quiz");
  const quizResults = searchParams.get("quizResults");


  const router = useRouter();
  const [progressPercentage, setProgressPercentage] = useState<number>(10);
  const dispatch = useAppDispatch();
  const [isRefreshingProgress, setIsRefreshingProgress] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [enrollmentChecked, setEnrollmentChecked] = useState<boolean>(false);

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
  }, [courseId, dispatch, router]);

  
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const response = await axios.get(`/api/verify-enrollment/${courseId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("bytelearn_token")}` }
        });

        if (!response.data.isEnrolled) {
          router.push("/client/dashboard?tab=my-courses");
          toast.error("You must enroll in this course first");
        } else {
          setIsEnrolled(true);
        }
      } catch (err) {
        console.error(err);
        router.push("/client/dashboard?tab=my-courses");
      } finally {
        setEnrollmentChecked(true);
      }
    };

    if (courseId) checkEnrollment();
  }, [courseId, router]);

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


  useEffect(() => {
    if (singleCourseInformation && singleCourseInformation.topics && completedSkillsContainer) {
      const completedSkillIds = completedSkillsContainer.map(skill => skill._id.toString());
      const calculatedProgress = calculateCourseProgress(
        singleCourseInformation,
        completedSkillIds
      );
      setProgressPercentage(calculatedProgress);
    }
  }, [singleCourseInformation, completedSkillsContainer]);

  const fetchProgressData = useCallback(async () => {
    setIsRefreshingProgress(true);
    try {
      const response = await axios.get("/api/progress", {
        headers: { Authorization: `Bearer ${localStorage.getItem("bytelearn_token")}` },
      });
      dispatch(setProgress(response.data.progress));
      setIsRefreshingProgress(false);
    } catch (err) {
      console.error("Failed to fetch progress data:", err);
    }
  }, [dispatch]);


  useEffect(() => {
    const fetchCompletedSkills = async () => {
      try {
        const response = await axios.get(`/api/completed-skills/${courseId}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }
        });
        dispatch(getCompletedSkills(response.data.completedSkills));

        // Also fetch progress data to ensure everything is in sync
        const progressResponse = await axios.get("/api/progress", {
          headers: { Authorization: `Bearer ${localStorage.getItem("bytelearn_token")}` },
        });
        dispatch(setProgress(progressResponse.data.progress));
      } catch (err) {
        console.error("Error fetching completed skills:", err);
      }
    };

    fetchCompletedSkills();
  }, [courseId, dispatch, quizResults]);

  useEffect(() => {
    fetchProgressData();
  }, [dispatch, fetchProgressData]);

  const progressData = useAppSelector(state =>
    state.progress.find(p => p.course === courseId)
  );
  useEffect(() => {
    const handleRouteChange = () => {

      const fetchCompletedSkills = async () => {
        try {
          const response = await axios.get(`/api/completed-skills/${courseId}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }
          });
          dispatch(getCompletedSkills(response.data.completedSkills));
        } catch (err) {
          console.error("Error refetching completed skills:", err);
        }
      };
      fetchCompletedSkills();
    };

    // Set up listener for route changes
    const url = new URL(window.location.href);
    if (url.searchParams.get('quizResults')) {
      handleRouteChange();
    }
  }, [courseId, dispatch]);


  const handleContinueLearning = useCallback(async () => {
    try {
      // If we have progress data with last visited skill, use that
      if (progressData?.lastVisitedSkill) {
        router.push(
          `/client/dashboard?tab=my-courses&courseId=${courseId}&skillId=${progressData.lastVisitedSkill}`
        );
        return;
      }

      // Otherwise find the next skill to continue with
      if (!singleCourseInformation?.topics || !completedSkillsContainer) {
        toast.error("Course data not loaded yet");
        return;
      }

      // Flatten all skills with completion status
      const allSkills = singleCourseInformation.topics.flatMap((topic: topicSchema) =>
        topic.skills.map((skill: SkillsSchema) => ({
          skillId: skill._id,
          topicId: topic._id,
          isCompleted: completedSkillsContainer.some(c => c._id === skill._id)
        }))
      );

      // Find first uncompleted skill or fall back to first skill
      const nextSkill = allSkills.find(skill => !skill.isCompleted) || allSkills[0];

      if (!nextSkill) {
        toast.error("No skills available in this course");
        return;
      }

      // Update last visited skill in backend
      await axios.post('/api/update-last-visited', {
        courseId,
        skillId: nextSkill.skillId,
        topicId: nextSkill.topicId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("bytelearn_token")}` }
      });

      // Navigate to the skill
      router.push(
        `/client/dashboard?tab=my-courses&courseId=${courseId}&skillId=${nextSkill.skillId}`
      );

    } catch (err) {
      console.error("Continue learning error:", err);
      toast.error("Failed to navigate. Please try again.");
    }
  }, [courseId, progressData, singleCourseInformation, completedSkillsContainer, router]);

  useEffect(() => {
    const handleRouteChange = () => {
      // Refresh completed skills and progress when route changes
      const fetchData = async () => {
        try {
          const [skillsResponse, progressResponse] = await Promise.all([
            axios.get(`/api/completed-skills/${courseId}`, {
              headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }
            }),
            axios.get("/api/progress", {
              headers: { Authorization: `Bearer ${localStorage.getItem("bytelearn_token")}` },
            })
          ]);

          dispatch(getCompletedSkills(skillsResponse.data.completedSkills));
          dispatch(setProgress(progressResponse.data.progress));
        } catch (err) {
          console.error("Error refreshing data:", err);
        }
      };

      fetchData();
    };

    // Set up the listener
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [courseId, dispatch]);

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

  if (!enrollmentChecked) {
    return (
      <LoadingSkeleton />
    )
  }

  if (!isEnrolled) {
    return;
  }

  if (skillId) {
    return <SkillContent skillId={skillId} />;
  }

  if (quizResults) {
    return <QuizResult />;
  }

  if (!singleCourseInformation || !singleCourseInformation.topics) {
    return (
      <LoadingSkeleton />
    );
  }

  if (showQuiz === "true") {
    return <SkillContent skillId="" />; // The SkillContent component will handle showing the quiz
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
    <div className="col-span-14 py-6 min-h-[90vh]">
      {/* Centralized course display area */}
      <div className="h-full flex flex-col space-y-8 justify-center items-center ">

        {/* course overview text */}
        <div className="w-full max-w-xs sm:max-w-sm mx-auto py-6">
          <p className="text-gray-400 text-xs">{`${singleCourseInformation.title}`}</p>
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

                {isRefreshingProgress ? (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
                ) : (
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      progressColor
                    )}
                    style={{ width: `${clampedProgress}%` }}
                  />
                )}
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


const LoadingSkeleton = () => {
  return (
    <div className="col-span-14 py-6 min-h-[90vh]">
      {/* Centralized skeleton area */}
      <div className="h-full flex flex-col space-y-8 justify-center items-center">
        {/* Course overview text skeleton */}
        <div className="w-48 h-3 bg-gray-200 rounded-full animate-pulse"></div>

        {/* Responsive course details + topics skeleton */}
        <div className="w-full flex flex-col lg:flex-row justify-center gap-6 px-4 lg:px-6">
          {/* Left card skeleton - grows on larger screens */}
          <div className="w-full lg:max-w-sm border border-gray-200 rounded-xl h-fit transition-all duration-200 flex flex-col space-y-4 p-4 md:p-6">
            {/* Course image skeleton */}
            <div className="w-full flex justify-center min-h-fit py-4 md:py-6">
              <div className="w-24 h-16 md:w-32 md:h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Title + date skeleton */}
            <div className="space-y-3">
              <div className="w-3/4 h-4 md:h-5 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Progress percentage skeleton */}
            <div className="space-y-1">
              <div className="w-1/4 h-6 md:h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-1/3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Progress bar skeleton */}
            <div className="space-y-1 mt-2">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gray-300 rounded-full animate-pulse" style={{ width: "30%" }}></div>
              </div>
            </div>

            {/* Continue Learning button skeleton */}
            <div className="w-full h-10 md:h-12 bg-gray-200 rounded-md animate-pulse mt-4"></div>
          </div>

          {/* Right topics skeleton - takes remaining space */}
          <div className="w-full lg:max-w-4xl overflow-y-auto h-[70vh] lg:h-[80vh] flex flex-col space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 md:p-6">
                {/* Topic title skeleton */}
                <div className="w-1/2 h-5 md:h-6 bg-gray-200 rounded-full animate-pulse mb-3 md:mb-4"></div>

                {/* Skills list skeleton */}
                <div className="space-y-2 md:space-y-3 pl-2 md:pl-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="w-2/3 md:w-3/4 h-3 md:h-4 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;