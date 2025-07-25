"use client"

import { FiMessageSquare, FiHeart, FiTrendingUp, FiUsers, FiRefreshCw, FiBarChart2, FiActivity } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import axios from '@/app/client/utils/config/axios';
import { useRouter } from 'next/navigation';
import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FeedbackDashboardSkeleton from '../../components/profileComponents/FeedbackDashboardSkeleton';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale, BarElement, PointElement, LineElement, Title
);

interface FeedbackMetrics {
  overview: {
    totalCourses: number;
    coursesWithFeedback: number;
    totalFeedbackMessages: number;
    totalLikesReceived: number;
    avgFeedbackPerCourse: number;
  };
  engagement: {
    enrollmentToFeedbackRatio: number;
    mostActiveCourse: {
      courseId: string;
      title: string;
      feedbackCount: number;
      enrollments: number;
      likes: number;
      feedbackRatio: number;
      recentMessages: Array<{
        content: string;
        sender: string;
        date: Date;
      }>;
    } | null;
    leastActiveCourse: {
      courseId: string;
      title: string;
      feedbackCount: number;
      enrollments: number;
      likes: number;
      feedbackRatio: number;
      recentMessages: Array<{
        content: string;
        sender: string;
        date: Date;
      }>;
    } | null;
  };
  sentiment: {
    positiveFeedbackCount: number;
    negativeFeedbackCount: number;
    neutralFeedbackCount: number;
  };

  temporal: {
    recentFeedback: Array<{
      course: string;
      sender: string;
      message: string;
      date: string;
      likes?: number;
    }>;
    feedbackByMonth?: Record<string, number>;
  };
  courseBreakdown: Array<{
    courseId: string;
    title: string;
    feedbackCount: number;
    enrollments: number;
    likes: number;
    feedbackRatio: number;
    recentMessages: Array<{
      content: string;
      sender: string;
      date: Date;
    }>;
  }>;
}


const FeedbackDashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const router = useRouter();
  const [feedbackMetrics, setFeedbackMetrics] = useState<FeedbackMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const generateCompleteMonthlyData = (feedbackByMonth?: Record<string, number>) => {
    const months = [];
    const currentDate = new Date();

    // Generate 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
      });
      months.unshift(monthKey);
    }

    // If no data exists, return empty structure
    if (!feedbackByMonth || Object.keys(feedbackByMonth).length === 0) {
      return months.map(month => ({ month, count: 0 }));
    }

    return months.map(month => ({
      month,
      count: feedbackByMonth[month] || 0
    }));
  };

  // 3. Usage with null check
  const completeMonthlyData = generateCompleteMonthlyData(
    feedbackMetrics?.temporal.feedbackByMonth
  );

  useEffect(() => {
    setLoading(true);
    axios.get("/api/feedback-metrics", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }
    })
      .then((res) => {
        setFeedbackMetrics(res.data.metrics);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 404) {
          router.push("/client/auth/login");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);


  if (loading) {
    return <FeedbackDashboardSkeleton />
  }


  if (!feedbackMetrics) {
    return (
      <div className="col-span-16 p-6 text-center text-gray-500">
        Failed to load feedback metrics
      </div>
    );
  }

  // Process data for visualizations using the metrics data
  const courses = feedbackMetrics.courseBreakdown.map(course => course.title);
  const filteredFeedback = selectedCourse === 'All'
    ? feedbackMetrics.temporal.recentFeedback
    : feedbackMetrics.temporal.recentFeedback.filter(f => f.course === selectedCourse);

  // 1. Likes by Course (Doughnut)
  const likesByCourse = feedbackMetrics.courseBreakdown
    .map(course => ({
      course: course.title,
      likes: course.likes
    }))
    .sort((a, b) => b.likes - a.likes);

  const hasFeedbackData = (
    feedbackMetrics?.temporal?.recentFeedback?.length > 0 ||
    Object.keys(feedbackMetrics?.temporal?.feedbackByMonth || {}).length > 0
  );

  return (
    <div className="col-span-16 p-6 space-y-8 bg-gray-50 overflow-y-auto h-screen">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <FiMessageSquare className="text-blue-600" /> Feedback Analytics
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Course Filter */}

          <div className="relative">
            <Select
              value={selectedCourse}
              onValueChange={(value) => setSelectedCourse(value)}
            >
              <SelectTrigger className="truncate max-w-[200px]">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent className="iphone:w-[90vw] sm:w-fit">
                <SelectItem
                  value="All"
                  className="text-xs"
                >
                  All Courses
                </SelectItem>
                {courses.map(course => (
                  <SelectItem
                    key={course}
                    value={course}
                    className=""
                  >
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 max-lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <FiMessageSquare className="text-blue-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Feedback</p>
              <p className="text-2xl font-semibold">{feedbackMetrics.overview.totalFeedbackMessages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full ">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-full">
              <FiHeart className="text-red-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Likes</p>
              <p className="text-2xl font-semibold">
                {feedbackMetrics.overview.totalLikesReceived}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <FiTrendingUp className="text-green-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Engagement Ratio</p>
              <p className="text-2xl font-semibold">
                {feedbackMetrics.engagement.enrollmentToFeedbackRatio.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <FiUsers className="text-purple-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Courses With Feedback</p>
              <p className="text-2xl font-semibold">
                {feedbackMetrics.overview.coursesWithFeedback}/{feedbackMetrics.overview.totalCourses}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Likes Distribution by Course */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Likes by Course</h2>
          <div className="h-80">
            <Doughnut
              data={{
                labels: likesByCourse.map(item => item.course),
                datasets: [{
                  data: likesByCourse.map(item => item.likes),
                  backgroundColor: [
                    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
                    '#EC4899', '#14B8A6', '#F97316', '#64748B', '#8B5CF6'
                  ],
                  borderWidth: 0,
                  hoverOffset: 10
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: { padding: 20 }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const total = likesByCourse.reduce((sum, item) => sum + item.likes, 0);
                        const value = context.raw as number;
                        const percentage = Math.round((value / total) * 100);
                        return `${context.label}: ${value} likes (${percentage}%)`;
                      }
                    }
                  }
                },
                cutout: '65%'
              }}
            />
          </div>
        </div>

        {/* 2. Feedback Activity Over Time */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Feedback Activity</h2>
          <div className="h-80">
            {!hasFeedbackData ? (
              <div className="h-80 flex flex-col items-center justify-center p-8 space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiActivity className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="absolute -inset-2 border-2 border-gray-100 rounded-full animate-pulse"></div>
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-medium text-gray-900">No activity yet</h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Feedback timeline will appear when students engage
                  </p>
                </div>
              </div>
            ) :
              <Line
                data={{
                  labels: completeMonthlyData.map(item => item.month),
                  datasets: [{
                    label: 'Feedback Received',
                    data: completeMonthlyData.map(item => item.count),
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true,
                    pointBackgroundColor: '#FFFFFF',
                    pointBorderColor: '#3B82F6',
                    pointBorderWidth: 2,
                    pointRadius: 3,
                    showLine: true, // Explicitly enable line
                    spanGaps: true  // Connect across gaps
                  }]
                }}

                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: 'rgba(0,0,0,0.05)' },
                      ticks: {
                        precision: 0 // Ensure whole numbers
                      }
                    },
                    x: {
                      grid: { display: false },
                      ticks: {
                        autoSkip: true,
                        maxRotation: 0
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} entries`
                      }
                    },
                    legend: {
                      display: true,
                      position: 'top'
                    }
                  },
                  elements: {
                    line: {
                      tension: 0.3, // Smoother curve
                      borderWidth: 2
                    },
                    point: {
                      radius: 4,
                      hoverRadius: 6
                    }
                  }
                }}

              />}
          </div>
        </div>

        {/* 3. Sentiment Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Feedback Sentiment</h2>
          <div className="h-80">
            {feedbackMetrics.sentiment.positiveFeedbackCount === 0 &&
              feedbackMetrics.sentiment.neutralFeedbackCount === 0 &&
              feedbackMetrics.sentiment.negativeFeedbackCount === 0 ? (
              // --- Empty State ---
              <div className="h-full flex flex-col items-center justify-center p-8 space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiBarChart2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="absolute -inset-2 border-2 border-gray-100 rounded-full animate-pulse"></div>
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-medium text-gray-900">No sentiment data</h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Student feedback will be analyzed here once submitted
                  </p>
                </div>
                <button
                  onClick={() => router.refresh()}
                  className="mt-4 px-4 py-2 text-sm hover:cursor-pointer font-medium text-gray-700 bg-transparent border border-gray-300 rounded-md hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Refresh analysis
                </button>
              </div>
            ) : <Doughnut
              data={{
                labels: ['Positive', 'Neutral', 'Negative'],
                datasets: [{
                  data: [
                    feedbackMetrics.sentiment.positiveFeedbackCount,
                    feedbackMetrics.sentiment.neutralFeedbackCount,
                    feedbackMetrics.sentiment.negativeFeedbackCount
                  ],
                  backgroundColor: [
                    '#10B981', // green for positive
                    '#64748B', // gray for neutral
                    '#EF4444'  // red for negative
                  ],
                  borderWidth: 0
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right'
                  }
                },
                cutout: '65%'
              }}
            />}
          </div>
        </div>

        {/* 4. Top Liked Feedback */}

      </div>

      {/* Recent Feedback Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">Likes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Comment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFeedback.length > 0 ? (
                filteredFeedback.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiHeart className="text-red-500" />
                        {item.likes || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 min-w-[200px]">{item.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 bg-gray-100 rounded-full">
                        <FiMessageSquare className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">No feedback yet</h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto">
                        Students haven’t submitted feedback for this course.
                        Encourage them to share their thoughts!
                      </p>
                      <button
                        onClick={() => router.refresh()}
                        className="mt-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors hover:cursor-pointer"
                      >
                        <FiRefreshCw className="inline mr-2" />
                        Check again
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDashboard;