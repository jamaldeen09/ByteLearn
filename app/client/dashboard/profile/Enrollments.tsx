
"use client"

import { FiUsers, FiBook, FiSearch, FiHeart } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import axios from "../../utils/config/axios"
import EnrollmentsSkeleton from '../../components/profileComponents/EnrollmentsSkeleton';
import { cn } from "@/lib/utils"


const EnrollmentsPage = () => {

  const [enrollmentsMetrics, setEnrollmentsMetrics] = useState<{
    enrollments: {
      _id: string,
      course: string,
      student: string,
      enrolledAt: string,
      progress: number,
      likes: number
    }[],
    stats: {
      totalEnrollments: number,
      activeStudents: number[],
      totalLikes: number
    }
  } | null>(null)
  const [loadingEnrollmentData, setLoadingEnrollmentData] = useState<boolean>(false);

  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoadingEnrollmentData(true)
    axios.get("/api/course-enrollments", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}`
      }
    }).then((res) => {
      setLoadingEnrollmentData(false)
      setEnrollmentsMetrics(res.data.enrollmentsData)
    }).catch((err) => {
      setLoadingEnrollmentData(false)
      console.error(err)
      if (err.response.status === 401 || err.response.status === 404) {
        router.push("/client/auth/login");
        return;
      }
    })
  }, [router])

  const filteredEnrollments = enrollmentsMetrics?.enrollments?.filter((enrollment) =>
    enrollment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];


  return (
    <>
      {/* MAIN CONTAINER - Vertical scrolling only */}
      {
        loadingEnrollmentData ? <EnrollmentsSkeleton /> : <div className="col-span-16 p-6 space-y-6 bg-gray-50 overflow-y-auto h-screen">

          {/* HEADER SECTION - No scrolling needed */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FiUsers className="text-green-600" /> Course Enrollments
            </h1>

            <div className="relative flex items-center space-x-2 w-full md:w-auto">
              <div className="">
                <Button
                  onClick={() => router.push("/client/dashboard?tab=profile")}
                  className="bg-black text-white font-bold rounded-lg hover:cursor-pointer"
                >
                  Go back
                </Button>
              </div>
              <div className="relative flex-1 md:flex-none">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search enrollments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md text-sm w-full md:w-64"
                />
              </div>
            </div>
          </div>

          {/* STATS CARDS - Normal flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FiBook className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Enrollments</p>
                  <p className="text-xl font-semibold">{enrollmentsMetrics?.stats.totalEnrollments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <FiUsers className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Students</p>
                  <p className="text-xl font-semibold">
                    {enrollmentsMetrics?.stats.activeStudents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <FiHeart className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Likes</p>
                  <p className="text-xl font-semibold">
                    {enrollmentsMetrics?.stats.totalLikes}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE CONTAINER - Only this scrolls horizontally */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[180px]">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[180px]">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[120px]">Enrolled On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[150px]">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[100px]">Likes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollmentsMetrics?.enrollments?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                            <FiUsers className="w-10 h-10 text-gray-400" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium text-gray-900">No enrollments yet</h3>
                            <p className="text-sm text-gray-500 max-w-md">
                              Students who enroll in your courses will appear here. Share your courses to get started.
                            </p>
                          </div>
                          <button
                            onClick={() => router.push('/client/dashboard?tab=course-creation')}
                            className="mt-4 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors hover:cursor-pointer"
                          >
                            Create New Course
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : filteredEnrollments.length === 0 && searchTerm ? (

                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <FiSearch className="w-12 h-12 text-gray-400" />
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium text-gray-900">No matching enrollments</h3>
                            <p className="text-sm text-gray-500 max-w-md">
                              No enrollments found for "{searchTerm}". Try a different search term.
                            </p>
                          </div>
                          <button
                            onClick={() => setSearchTerm('')}
                            className="mt-4 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Clear Search
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    (searchTerm ? filteredEnrollments : enrollmentsMetrics?.enrollments)?.map((enrollment, index) => {
                      const clampedProgress = Math.min(100, Math.max(0, enrollment.progress));
                      const progressColor = clampedProgress >= 70
                        ? "bg-green-500"
                        : clampedProgress >= 40
                          ? "bg-yellow-500"
                          : "bg-red-500";

                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{enrollment.course}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.student}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-700",
                                  progressColor
                                )}
                                style={{ width: `${clampedProgress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 mt-1">{enrollment.progress}%</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <FiHeart className="text-red-500" />
                              {enrollment.likes}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default EnrollmentsPage;