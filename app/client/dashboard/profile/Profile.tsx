"use client"
import { FiAward, FiMessageSquare, FiBarChart2, FiUsers, FiHeart, FiBook, FiPlus, FiUpload, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ProfileSkeleton from '../../components/profileComponents/ProfileSkeleton';
import EnrollmentsPage from './Enrollments';
import { useAppDispatch, useAppSelector } from '@/app/redux/essentials/hooks';
import { courseSchema } from '../../types/types';
import axios from "@/app/client/utils/config/axios"
import FeedbackDashboard from './FeedbackDashboard';
import Image from 'next/image';
import FeedbackItem from './FeedbackItem';
import toast from 'react-hot-toast';
import { getNewAvatar } from '@/app/redux/informationSlices/usersInformationSlice';
import DeepseekSpinner from '../../components/reusableComponents/DeepseekSpinner';

const Profile = () => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const subTab = searchParams.get('subTab');
  const [loadingProfileData, setLoadingProfileData] = useState<boolean>(false);
  const dispatch = useAppDispatch()
  const [isChangingImage, setIsChangingImage] = useState<boolean>(false);


  const [mostRecentFeedbacks, setMostRecentFeedbacks] = useState<{

    courseId: string,
    courseTitle: string,
    message: string,
    sender: string,
    senderAvatar: string,
    createdAt: Date,
    likes: 0,
  }[] | null>(null)

  const [metricsManager, setMetricsManager] = useState<{
    totalEnrollments: number,
    averageLikes: number,
    mostPopularCourse: courseSchema | undefined,
    engagementRatio: number,
    averageCompletionRate: number
  } | null>(null)

  const usersInformation = useAppSelector(state => state.usersInformation);

  useEffect(() => {
    setLoadingProfileData(true);
    axios.get("/api/profile-metrics", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}`
      }
    }).then((res) => {
      setLoadingProfileData(false);
      setMetricsManager(() => res.data.metricsData);
    }).catch((err) => {
      console.error(err)
      setLoadingProfileData(false);
      if (err.response.status === 401 || err.response.status === 404) {
        router.push("/client/auth/login");
        return;
      }
    })
  }, [router])

  const fetchFeedbacks = useCallback(() => {
    axios.get("/api/most-recent-feedback", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}`
      }
    }).then((res) => {

      setMostRecentFeedbacks(res.data.feedbacks)
      console.log("feedbacks:", res.data)
    }).catch((err) => {

      console.error(err)
      if (err.response.status === 401 || err.response.status === 404) {
        router.push("/client/auth/login");
        return;
      }
    })
  }, [router])

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks])


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file (JPEG, PNG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    setIsChangingImage(true)

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.put("/api/change-avatar", formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}`,
          "Content-Type": "multipart/form-data"
        }
      });
      // Update all states at once
      setProfileImage(response.data.avatarUrl);
      setIsChangingImage(false)
      dispatch(getNewAvatar(response.data.avatarUrl));
      toast.success("Profile picture updated!");

    } catch (err: unknown) {
      console.error("Upload error:", err);
      if (err instanceof Error) {
        toast.error(err.message || "Failed to update avatar");
      }
    }
  };


  if (subTab === "feedback") return <FeedbackDashboard />;
  if (subTab === "enrollments") return <EnrollmentsPage />;

  return (
    loadingProfileData ? <ProfileSkeleton /> : (
      <div className="col-span-16 p-6 space-y-6 bg-gray-50">
        {/* Profile Header - Modern Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar with Upload */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden border-2 border-white shadow-md">
                {isChangingImage ? (
                  <div
                    className="rounded-full w-full h-full centered-flex"
                  >
                    <DeepseekSpinner />
                  </div>
                ) : profileImage || usersInformation?.avatar ? (
                  <Image
                    src={profileImage || usersInformation?.avatar || ''}
                    alt={`${usersInformation?.fullName}'s profile`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                    onError={() => setProfileImage(null)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-2xl font-light text-gray-500">
                      {usersInformation?.fullName?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="hover:cursor-pointer absolute -bottom-1 -right-1 bg-black text-white p-1.5 rounded-full shadow-sm hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                aria-label="Upload profile picture"
              >
                <FiUpload size={14} />
              </button>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {usersInformation?.fullName || 'Anonymous User'}
              </h1>

              <p className="text-gray-500 mt-1">
                {usersInformation?.bio || "Educator & Course Creator"}
              </p>

              {/* Stats Pills */}
              <div className="flex flex-wrap gap-3 mt-4">
                <StatPill
                  icon={<FiBook className="text-indigo-500" />}
                  value={usersInformation?.createdCourses?.length || 0}
                  label="Courses"
                />
                <StatPill
                  icon={<FiUsers className="text-teal-500" />}
                  value={metricsManager?.totalEnrollments}
                  label="Enrollments"
                />
                <StatPill
                  icon={<FiHeart className="text-rose-500" />}
                  value={metricsManager?.averageLikes}
                  label="Avg Likes"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid - Modern Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Engagement Ratio"
            value={metricsManager?.engagementRatio ? `${metricsManager.engagementRatio}x` : "N/A"}
            icon={<FiBarChart2 className="text-indigo-500" />}
            trend="up"

          />
          <StatCard
            title="Avg Completion"
            value={`${metricsManager?.averageCompletionRate ?? 0}%`}
            icon={<FiAward className="text-teal-500" />}
          />
          <StatCard
            title="Most Popular"
            value={metricsManager?.mostPopularCourse?.title || "N/A"}
            icon={<FiHeart className="text-rose-500" />}
            isText
          />
        </div>

        {/* Quick Actions - Modern Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <ActionButton
              icon={<FiPlus size={18} />}
              label="Create New Course"
              onClick={() => router.push('/client/dashboard?tab=course-creation')}
              primary
            />
            <ActionButton
              icon={<FiUsers size={18} />}
              label="View Enrollments"
              onClick={() => router.push('?tab=profile&subTab=enrollments')}
            />
            <ActionButton
              icon={<FiMessageSquare size={18} />}
              label="Feedback Dashboard"
              onClick={() => router.push('?tab=profile&subTab=feedback')}
            />
          </div>
        </div>


        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Engagement</h2>
          <div className="space-y-5">
            {/* Engagement Rate */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Completion Rate</span>
                <span className="text-gray-600">{metricsManager?.averageCompletionRate || 0}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
                  style={{ width: `${metricsManager?.averageCompletionRate || 0}%` }}
                />
              </div>
            </div>



            {/* Engagement Ratio */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Engagement Ratio</span>
                <span className="text-gray-600">{metricsManager?.engagementRatio || 0}x</span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full ${i <= Math.round(metricsManager?.engagementRatio || 0) ? 'bg-indigo-500' : 'bg-gray-200'}`}
                    style={{ width: '20%' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Feedback - Modern Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Feedback</h2>
            <button
              onClick={() => router.push('?tab=profile&subTab=feedback')}
              className="text-sm text-gray-500 hover:text-black flex items-center gap-1 hover:cursor-pointer"
            >
              View all <FiChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {mostRecentFeedbacks === null ? (

              // Loading state (see skeleton below)
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>

            ) : mostRecentFeedbacks?.length > 0 ? (
              mostRecentFeedbacks.map((feedback, index) => (
                <FeedbackItem
                  key={index}
                  text={feedback.message}
                  course={feedback.courseTitle}
                />
              ))
            ) : (
              <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center justify-center space-y-3 h-64">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiMessageSquare className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="absolute -inset-2 border-2 border-gray-100 rounded-full animate-pulse"></div>
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-medium text-gray-900">No recent feedback</h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Student feedback will appear here once submitted
                  </p>
                </div>
                <button
                  onClick={() => fetchFeedbacks()} // Assuming you have a refetch function
                  className="mt-2 px-4 py-2 text-sm font-medium text-gray-700 hover:cursor-pointer bg-transparent border border-gray-300 rounded-md hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Check again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

// Reusable Components
const StatPill = ({ icon, value, label }: { icon: React.ReactNode, value?: number, label: string }) => (
  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-sm">
    <span className="text-gray-600">{icon}</span>
    <span className="font-medium text-gray-900">{value ?? 0}</span>
    <span className="text-gray-500">{label}</span>
  </div>
);

const StatCard = ({ title, value, icon, isText }: {
  title: string, value: string, icon: React.ReactNode,
  trend?: 'up' | 'down', isText?: boolean
}) => (
  <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`mt-1 ${isText ? 'text-lg font-medium' : 'text-2xl font-bold'}`}>{value}</p>
      </div>
      <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
        {icon}
      </div>
    </div>
  </div>
);

const ActionButton = ({ icon, label, onClick, primary }: {
  icon: React.ReactNode, label: string, onClick: () => void, primary?: boolean
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${primary ? 'bg-black text-white hover:bg-gray-800' : 'border border-gray-200 hover:bg-gray-50'
      }`}
  >
    <div className="flex items-center gap-3">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
    <FiChevronRight size={16} />
  </button>
);

export default Profile;