"use client"
import { motion, AnimatePresence } from "framer-motion"
import { XIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { courseSchema } from "../../types/types"
import { Clock, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import axios from "../../utils/config/axios"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useAppSelector } from "@/app/redux/essentials/hooks"
import { AxiosError } from "axios"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface CourseFeedbackMetrics {
    overview: {
        totalFeedbackMessages: number;
        totalLikesReceived: number;
        enrollments: number;
        feedbackRatio: number;
    };
    sentiment: {
        positiveFeedbackCount: number;
        negativeFeedbackCount: number;
        neutralFeedbackCount: number;
    };
    temporal: {
        feedbackByMonth: Record<string, number>;
        recentFeedback: Array<{
            content: string;
            sender: string;
            date: Date;
            likes?: number;
        }>;
    };
}


const CourseDetailsModal = ({
    open,
    setOpen,
    course
}: {
    open: boolean
    setOpen: (open: boolean) => void
    course: courseSchema | null
}) => {
    const [activeTab, setActiveTab] = useState<"details" | "feedback">("details")
    const [metrics, setMetrics] = useState<CourseFeedbackMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter()

    const generateCompleteMonthlyData = (feedbackByMonth?: Record<string, number>) => {
        const months = [];
        const currentDate = new Date();

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

        if (!feedbackByMonth || Object.keys(feedbackByMonth).length === 0) {
            return months.map(month => ({ month, count: 0 }));
        }

        return months.map(month => ({
            month,
            count: feedbackByMonth[month] || 0
        }));
    };


    useEffect(() => {
        const fetchCourseMetrics = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/single-course-feedback-metrics/${course?._id}`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` }
                });
                setMetrics(response.data.metrics);
            } catch (err: unknown) {
                if (err instanceof AxiosError) {
                    console.error(err);
                    toast.error(err.response?.data?.msg || "Failed to load course feedback");
                    if (err.response?.status === 401 || err.response?.status === 404) {
                        router.push("/client/auth/login");
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        if (course?._id) {
            fetchCourseMetrics();
        }
    }, [course?._id, router]);


    if (!course) return null

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="relative w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="relative h-64 w-full">
                                <Image
                                    unoptimized
                                    src={course.imageUrl}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                                    >
                                        <XIcon className="w-5 h-5 text-white" />
                                    </button>
                                </div>

                                <div className="absolute bottom-6 left-6 space-y-2 ">
                                    <Badge variant="secondary" className="text-xs md:text-sm">
                                        {course.category}
                                    </Badge>
                                    <h1 className="text-xl md:text-3xl font-bold text-white">{course.title}</h1>
                                    <p className="text-gray-200 text-sm md:text-lg max-w-2xl line-clamp-2">
                                        {course.description}
                                    </p>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex flex-1 overflow-hidden">
                                {/* Main Content */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    {/* Stats Cards */}
                                    <div className="flex md:flex-row flex-col space-x-2 gap-4 mb-8">

                                        <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3 w-full md:w-1/2">
                                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div className="">
                                                <p className="text-sm text-gray-500">Enrollments</p>
                                                <p className="text-xl font-semibold">{course.enrollments}</p>
                                            </div>
                                        </div>



                                        <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3 w-full md:w-1/2">
                                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Created</p>
                                                <p className="text-xl font-semibold">
                                                    {new Date(!course.dateCreated ? "" : course.dateCreated).toLocaleDateString("en-GB", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric"
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tabs */}
                                    <div className="border-b border-gray-200 mb-6">
                                        <nav className="-mb-px flex space-x-8">
                                            <button
                                                onClick={() => setActiveTab("details")}
                                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "details"
                                                    ? "border-black text-black"
                                                    : "border-transparent text-gray-500 hover:text-gray-700"}`}
                                            >
                                                Course Details
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("feedback")}
                                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "feedback"
                                                    ? "border-black text-black"
                                                    : "border-transparent text-gray-500 hover:text-gray-700"}`}
                                            >
                                                Feedback Analytics
                                            </button>
                                        </nav>
                                    </div>

                                    {/* Tab Content */}
                                    {activeTab === "details" ? (
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-4">Topics</h2>
                                                <div className="space-y-3">
                                                    {course.topics.map((topic) => (
                                                        <div key={topic._id} className="bg-gray-50 rounded-lg p-4">
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="font-medium">{topic.title}</h3>
                                                                <span className="text-sm text-gray-500">
                                                                    {topic.skills.length} skills
                                                                </span>
                                                            </div>
                                                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                {topic.skills.slice(0, 4).map((skill) => (
                                                                    <div key={skill._id} className="text-sm text-gray-600">
                                                                        • {skill.skillTitle}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h2 className="text-xl font-semibold mb-4">Creator</h2>
                                                <div className="flex items-center space-x-4">
                                                    <Image
                                                        unoptimized
                                                        src={course.creator.profilePicture}
                                                        alt={course.creator.fullName}
                                                        width={48}
                                                        height={48}
                                                        className="rounded-full border"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{course.creator.fullName}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {course.creator.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        loading ? <div className="h-64 flex items-center justify-center bg-white p-4 rounded-lg border border-gray-200">
                                            <div className="animate-pulse flex flex-col items-center">
                                                <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
                                                <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                                                <div className="h-32 w-full bg-gray-200 rounded"></div>
                                            </div>
                                        </div> : (
                                            <div className="space-y-6">
                                                <div className="h-64 bg-white p-4 rounded-lg border border-gray-200">
                                                    <Line
                                                        data={{
                                                            labels: generateCompleteMonthlyData(metrics?.temporal.feedbackByMonth).map(item => item.month),
                                                            datasets: [{
                                                                label: 'Feedback Received',
                                                                data: generateCompleteMonthlyData(metrics?.temporal.feedbackByMonth).map(item => item.count),
                                                                borderColor: '#3B82F6',
                                                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                                borderWidth: 2,
                                                                tension: 0.1,
                                                                fill: true,
                                                                pointBackgroundColor: '#FFFFFF',
                                                                pointBorderColor: '#3B82F6',
                                                                pointBorderWidth: 2,
                                                                pointRadius: 3,
                                                                showLine: true,
                                                                spanGaps: true
                                                            }]
                                                        }}
                                                        options={{
                                                            responsive: true,
                                                            maintainAspectRatio: false,
                                                            plugins: {
                                                                title: {
                                                                    display: true,
                                                                    text: 'Monthly Feedback Activity',
                                                                    font: { size: 16 }
                                                                },
                                                                legend: { display: false }
                                                            },
                                                            scales: {
                                                                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                                                                x: { grid: { display: false } }
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                        <h3 className="font-medium text-gray-700 mb-2">Total Feedback</h3>
                                                        <p className="text-2xl font-semibold">{metrics?.overview.totalFeedbackMessages}</p>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                        <h3 className="font-medium text-gray-700 mb-2">Engagement Rate</h3>
                                                        <p className="text-2xl font-semibold">{metrics?.overview.feedbackRatio.toFixed(1)}%</p>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                        <h3 className="font-medium text-gray-700 mb-2">Total Likes</h3>
                                                        <p className="text-2xl font-semibold">{metrics?.overview.totalLikesReceived}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>


                            </div>

                            {/* Footer Actions */}
                            <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
                                <Button variant="outline" onClick={() => setOpen(false)} className="hover:cursor-pointer">
                                    Close
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

export default CourseDetailsModal