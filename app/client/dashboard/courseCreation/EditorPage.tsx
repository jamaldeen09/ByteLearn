"use client"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { courseSchema } from "../../types/types";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Editor from "@monaco-editor/react";
import { BookOpen, Code, Eye, FileText, ListChecks, Plus, Settings, Trash2, Image as ImageIcon, ChevronDown, ChevronRight, Save, Clock, Upload, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/app/client/utils/config/axios"
import { getCourses } from "@/app/redux/coursesSlices/courseSlice";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Pencil2Icon } from "@radix-ui/react-icons";

type CourseDetails = {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  isPublished: boolean;
  topics: {
    title: string;
    skills: {
      skillTitle: string;
      content: string;
    }[];
  }[];
}

const CourseEditorPage = () => {

  // important variables
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const dispatch = useAppDispatch()
  const courses = useAppSelector(state => state.coursesSlice.courses);
  const courseToEdit = courses.find((course: courseSchema) => course._id === courseId);
  const router = useRouter()

  // State management
  const [activeTab, setActiveTab] = useState("course");
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({});
  const [addingSkillToTopic, setAddingSkillToTopic] = useState<number | null>(null);
  const [newSkillTitle, setNewSkillTitle] = useState('')
  // booleans
  const [loadingCourseDetails, setLoadingCourseDetails] = useState<boolean>(false);
  const [editingSkillName, setEditingSkillName] = useState(false);
  const [addingNewTopic, setAddingNewTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [editingTopicIndex, setEditingTopicIndex] = useState<number | null>(null);
  const [editedTopicTitle, setEditedTopicTitle] = useState('');



  // state to manage all new inputs

  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    isPublished: false,
    topics: []
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseDetails(prev => ({
      ...prev,
      [name]: value // Using computed property name
    }));
  };

  const handleTogglePublish = () => {
    setCourseDetails(prev => ({
      ...prev,
      isPublished: !prev.isPublished
    }));
  };


  const handleTopicChange = (topicIndex: number, field: string, value: string) => {
    setCourseDetails(prev => {
      const updatedTopics = [...prev.topics];
      updatedTopics[topicIndex] = {
        ...updatedTopics[topicIndex],
        [field]: value
      };
      return { ...prev, topics: updatedTopics };
    });
  };

  const addNewTopic = () => {
    setCourseDetails(prev => ({
      ...prev,
      topics: [
        ...prev.topics,
        {
          title: newTopicTitle,
          skills: []
        }
      ]
    }));
    const newTopicIndex = courseDetails.topics.length;
    setActiveTopicIndex(newTopicIndex);
    setActiveSkillIndex(0);
    setExpandedTopics(prev => ({ ...prev, [newTopicIndex]: true }));
  };

  const addNewSkill = (topicIndex: number) => {
    setCourseDetails(prev => {
      const updatedTopics = [...prev.topics];
      updatedTopics[topicIndex] = {
        ...updatedTopics[topicIndex],
        skills: [
          ...updatedTopics[topicIndex].skills,
          {
            skillTitle: newSkillTitle,
            content: '<p>Start editing your skill content here</p>'
          }
        ]
      };
      return { ...prev, topics: updatedTopics };
    });

    // Set the new skill as active
    const newSkillIndex = courseDetails.topics[topicIndex].skills.length;
    setActiveTopicIndex(topicIndex);
    setActiveSkillIndex(newSkillIndex);
  };



  const handleSkillChange = (topicIndex: number, skillIndex: number, field: string, value: string) => {
    setCourseDetails(prev => {
      const updatedTopics = [...prev.topics];
      const updatedSkills = [...updatedTopics[topicIndex].skills];
      updatedSkills[skillIndex] = {
        ...updatedSkills[skillIndex],
        [field]: value
      };
      updatedTopics[topicIndex].skills = updatedSkills;
      return { ...prev, topics: updatedTopics };
    });
  };

  {/* Add this handler */ }
  const handleDeleteSkill = () => {
    if (confirm('Are you sure you want to delete this skill?')) {
      setCourseDetails(prev => {
        const updatedTopics = [...prev.topics];
        updatedTopics[activeTopicIndex].skills = updatedTopics[activeTopicIndex].skills.filter(
          (_, index) => index !== activeSkillIndex
        );
        return { ...prev, topics: updatedTopics };
      });
      setActiveSkillIndex(Math.max(0, activeSkillIndex - 1));
    }
  };


  useEffect(() => {
    setLoadingCourseDetails(true);
    axios.get("/api/courses", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } }).then((res) => {
      setLoadingCourseDetails(false);
      dispatch(getCourses(res.data.courses));
    }).catch((err) => {
      setLoadingCourseDetails(false);
      console.error(err);
    })
  }, [dispatch]);

  const toggleTopicExpansion = (index: number) => {
    setExpandedTopics(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    if (courseToEdit) {
      setCourseDetails({
        title: courseToEdit.title,
        description: courseToEdit.description,
        category: courseToEdit.category,
        imageUrl: courseToEdit.imageUrl,
        isPublished: courseToEdit.isPublished,
        topics: courseToEdit.topics.map(topic => ({
          title: topic.title,
          skills: topic.skills.map(skill => ({
            skillTitle: skill.skillTitle,
            content: skill.content
          }))
        }))
      });
    }
  }, [courseToEdit]);



  const handleSave = () => {
    // Add your save logic here
  };

  return (
    !courseId ? (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 col-span-16">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-800">Course Editor</h2>
            </div>
          </div>

          {/* Empty State Content */}
          <div className="p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h3 className="text-xl font-medium text-gray-800 mb-2">No Course Selected</h3>
            <p className="text-gray-500 mb-6">
              Please select a course to edit or create a new one.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:cursor-pointer"
                onClick={() => router.push("/client/dashboard")}
              >
                Back to Dashboard
              </Button>
              <Button
                className="bg-gray-900 text-white hover:bg-gray-800 hover:cursor-pointer"
                onClick={() => router.push("/client/dashboard?tab=course-creation")}
              >
                Create New Course
              </Button>
            </div>
          </div>
        </div>
      </div>
    ) : loadingCourseDetails ? <EditorPageSkeleton /> : <div className="min-h-screen bg-gray-50 overflow-y-auto overflow-x-hidden col-span-16">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex gap-4 md:gap-0 md:justify-between md:items-center sticky top-0 z-10
      flex-col md:flex-row">
        <div className="flex items-center space-x-4">
          <h1 className="text-md md:text-xl font-bold text-gray-800 flex items-center">
            <FileText className="w-3 sh-3 md:w-5 md:h-5 mr-2 text-indigo-600" />
            Course Editor
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
          <Tabs defaultValue="course" className="flex-1 flex flex-col">

            <div className="p-4 border-b border-gray-200">
              <TabsList className="grid w-full grid-cols-2 h-12 lg:h-full">
                <TabsTrigger value="course" onClick={() => setActiveTab("course")} className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" /> Course
                </TabsTrigger>
                <TabsTrigger value="content" onClick={() => setActiveTab("content")} className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" /> Content
                </TabsTrigger>
              </TabsList>
            </div>

            {activeTab === "content" ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {addingNewTopic ? (
                  <div className="space-y-2 mt-2">
                    <input
                      autoFocus
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                      className="text-xs px-3 h-8 border border-gray-300 rounded-md focus:outline-none w-full"
                      placeholder="Enter topic title"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        className="text-xs h-8 hover:bg-gray-100 hover:cursor-pointer"
                        onClick={() => {
                          if (!newTopicTitle.trim()) {
                            toast.error("Topic name cannot be empty");
                            return;
                          }
                          addNewTopic();
                          setAddingNewTopic(false);
                          setNewTopicTitle('');
                        }}
                      >
                        Save Topic
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-xs h-8 hover:bg-red-50 hover:cursor-pointer hover:text-red-600"
                        onClick={() => {
                          setAddingNewTopic(false);
                          setNewTopicTitle('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-indigo-600 text-xs hover:cursor-pointer hover:text-indigo-600 mt-2"
                    onClick={() => {
                      setAddingNewTopic(true);
                      setNewTopicTitle(`New Topic ${courseDetails.topics.length + 1}`);
                    }}
                  >
                    <Plus className="w-2 h-2 text-xs mr-1" /> Add Topic
                  </Button>
                )}

                {courseDetails.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="">
                    <div className="flex items-center justify-between bg-gray-50 rounded-md">
                      <Button
                        variant="ghost"
                        className="w-full justify-start font-medium text-[0.8rem] hover:cursor-pointer"
                        onClick={() => {
                          setActiveTopicIndex(topicIndex);
                          toggleTopicExpansion(topicIndex);
                        }}
                      >
                        {expandedTopics[topicIndex] ? (
                          <ChevronDown className="w-2 h-2" />
                        ) : (
                          <ChevronRight className="w-2 h-2" />
                        )}
                        <p className="truncate direction-r text-overflow:ellipsis overflow-hidden">
                          {topic.title}
                        </p>
                      </Button>
                    </div>


                    {expandedTopics[topicIndex] && (
                      <div className="space-y-2 mt-2">
                        {topic.skills.map((skill, skillIndex) => (
                          <Button
                            key={skillIndex}
                            variant={activeTopicIndex === topicIndex && activeSkillIndex === skillIndex ? "secondary" : "ghost"}
                            className="w-full justify-start text-xs hover:cursor-pointer px-3"
                            onClick={() => {
                              setActiveTopicIndex(topicIndex);
                              setActiveSkillIndex(skillIndex);
                            }}
                          >
                            <p className="truncate direction-r text-overflow:ellipsis overflow-hidden">
                              {skill.skillTitle}
                            </p>
                          </Button>
                        ))}

                        {/* Add/Save Skill Section */}
                        {addingSkillToTopic === topicIndex ? (
                          <div className="space-y-2">
                            <input
                              autoFocus
                              value={newSkillTitle}
                              onChange={(e) => setNewSkillTitle(e.target.value)}
                              className="text-xs px-3 h-8 border-gray-300 focus:outline-none"
                              placeholder="Enter skill title"
                            />
                            <div className="flex gap-2 ">
                              <Button
                                variant="ghost"
                                className="text-xs h-8 hover:bg-gray-100 hover:cursor-pointer"
                                onClick={() => {
                                  // Add the new skill'  
                                  if (!newSkillTitle.trim()) {
                                    // Show error feedback (you can use toast, alert, or inline message)
                                    toast.error("Skill name cannot be empty")
                                    return;
                                  }
                                  addNewSkill(topicIndex);
                                  setAddingSkillToTopic(null);
                                  setNewSkillTitle('');
                                }}
                              >
                                Save Skill
                              </Button>
                              <Button
                                variant="ghost"
                                className="text-xs h-8 hover:bg-red-50 hover:cursor-pointer hover:text-red-600"
                                onClick={() => {
                                  setAddingSkillToTopic(null);
                                  setNewSkillTitle('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-indigo-600 text-xs hover:cursor-pointer hover:text-indigo-600"
                            onClick={() => {
                              setAddingSkillToTopic(topicIndex);
                              setNewSkillTitle(`New Skill ${topic.skills.length + 1}`);
                            }}
                          >
                            <Plus className="w-2 h-2 text-xs mr-1" /> Add Skill
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : <div
              className="centered-flex h-full w-full"
            >
              <div className="p-6 rounded-lg  ">
                <div className="flex flex-col items-center text-center space-y-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-800">Course Editor</h3>
                  <p className="text-gray-500 text-xs max-w-md">
                    You're currently editing {courseToEdit?.title || "this course"}.
                    Any unsaved changes will be lost if you exit now.
                  </p>

                  <p className="text-xs text-gray-500"><span className="text-red-600">Warning:</span> refreshing the page will make you lose your changes if they are not saved</p>
                  <div className="flex gap-3 pt-2 w-full sm:w-auto">

                    <Button
                      variant="destructive"
                      className="
    rounded-full w-12 h-12 max-w-xs 
    shadow-lg hover:shadow-xl 
    transition-all duration-300
    hover:scale-110 hover:rotate-6
    group relative overflow-hidden hover:cursor-pointer active:scale-90 mx-auto
  "
                      onClick={() => {
                        router.push("/client/dashboard?tab=course-creation")
                      }}
                    >
                      {/* Main button content */}
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"

                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </span>

                      {/* Tooltip text that appears on hover */}
                      <span className="
    absolute opacity-0 group-hover:opacity-100 
    transition-opacity duration-200
    text-xs font-medium
    -bottom-8 left-1/2 transform -translate-x-1/2
    whitespace-nowrap 
  ">
                        Quit Editor
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>}
          </Tabs>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {activeTab === "course" ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 ">
              {/* Course Information Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-gray-600" />
                    Course Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Course Title</Label>
                      <Input
                        name="title"
                        value={courseDetails.title}
                        onChange={handleInputChange}
                        className="focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs md:text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Category</Label>
                      <Input
                        name="category"
                        value={courseDetails.category}
                        onChange={handleInputChange}
                        className="focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs md:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea
                      name="description"
                      value={courseDetails.description}
                      onChange={handleInputChange}
                      rows={5}
                      className="focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs md:text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Cover Image</Label>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="w-full h-44 max-smg:h-60 md:w-64 md:h-36 relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                        <Image
                          src={courseDetails.imageUrl || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
                          alt="Course cover"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" className="flex items-center space-x-2 hover:cursor-pointer text-xs md:text-sm">
                          <Upload className="w-4 h-4" />
                          <span>Upload New Image</span>
                        </Button>
                        <p className="text-xs text-gray-500">Recommended size: 1280x720px</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Publishing Status */}
              <Card className="border border-gray-200 shadow-sm basic-border">

                <CardHeader className="border-b border-gray-200 py-0 h-12 px-5">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <ListChecks className="w-5 h-5 mr-2 text-gray-600" />
                    Publishing Status
                  </CardTitle>
                </CardHeader>

                <CardContent className="h-fit">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div
                      className="flex items-center space-x-2"
                    >
                      <p className="text-gray-500 text-sm">Status: </p>

                      <p className={`text-sm ${courseDetails.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>
                        {courseDetails.isPublished ? (
                          <span className="inline-flex items-center text-xs">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center">
                            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                            Draft
                          </span>
                        )}
                      </p>
                    </div>
                    <Button
                      variant={courseDetails.isPublished ? "outline" : "default"}
                      className={courseDetails.isPublished ? "border-red-500 text-red-600 hover:bg-red-50 hover:cursor-pointer hover:text-red-600 active:text-red-800" : ""}
                      onClick={handleTogglePublish}
                    >
                      {courseDetails.isPublished ? "Unpublish Course" : "Publish Course"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Editor Header */}
              <div className="border-b border-gray-200 p-4 bg-white flex md:justify-between flex-col space-y-6 md:space-y-0 md:flex-row md:items-center sticky top-0 z-10">
                <div>
                  <h2 className="font-bold text-gray-800">
                    {courseDetails.topics[activeTopicIndex]?.title || "No Topic Selected"}
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
                  <Button
                    variant={previewMode ? "default" : "outline"}
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center  hover:cursor-pointer text-xs"
                  >
                    {previewMode ? (
                      <>
                        <Code className="w-3 h-3" /> Code Editor
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" /> Preview
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="flex items-center hover:cursor-pointer text-xs">
                    <Plus className="w-4 h-4" /> Add Quiz
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex items-center hover:cursor-pointer text-xs col-span-2 md:col-span-0"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this topic and all its skills?')) {
                        // Delete the topic
                        setCourseDetails(prev => {
                          const updatedTopics = [...prev.topics];
                          updatedTopics.splice(activeTopicIndex, 1); // Remove the active topic

                          return {
                            ...prev,
                            topics: updatedTopics
                          };
                        });

                        // Reset active indices
                        setActiveTopicIndex(Math.max(0, activeTopicIndex - 1));
                        setActiveSkillIndex(0);
                      }
                    }}
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Delete Topic
                  </Button>

                  <Button
                    onClick={() => {
                      setEditingTopicIndex(activeTopicIndex);
                      setEditedTopicTitle(courseDetails.topics[activeTopicIndex]?.title || '');
                    }}
                    variant="ghost" className="flex items-center hover:cursor-pointer text-xs col-span-2 md:col-span-0 border border-gray-300
                  ">
                    <Pencil2Icon className="w-3 h-3" /> Edit Topic
                  </Button>

                  {editingTopicIndex !== null && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                      <motion.div
                        key="skillname-edit-modal"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.3, damping: 12, stiffness: 100 }}
                        className="bg-black  p-6 rounded-lg max-w-sm w-full  border border-white">
                        <h3 className="font-medium mb-4 text-white">Edit Topic Title</h3>
                        <Input
                          value={editedTopicTitle}
                          onChange={(e) => setEditedTopicTitle(e.target.value)}
                          className="mb-4 text-white"
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">

                          <Button
                            className="hover:cursor-pointer"
                            onClick={() => {
                              if (!editedTopicTitle.trim()) {
                                toast.error("Topic title cannot be empty");
                                return;
                              }

                              setCourseDetails(prev => {
                                const updatedTopics = [...prev.topics];
                                updatedTopics[editingTopicIndex] = {
                                  ...updatedTopics[editingTopicIndex],
                                  title: editedTopicTitle
                                };
                                return { ...prev, topics: updatedTopics };
                              });

                              setEditingTopicIndex(null);
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      </motion.div>
                    </motion.div>)}
                </div>
              </div>

              {/* Skill Editor */}
              {courseDetails?.topics[activeTopicIndex]?.skills[activeSkillIndex] && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {previewMode ? (
                    <div className="flex-1 p-6 overflow-y-auto overflow-x-auto">
                      <div className="prose max-w-none min-w-max">
                        <h1>{courseDetails.topics[activeTopicIndex].skills[activeSkillIndex].skillTitle}</h1>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: courseDetails.topics[activeTopicIndex].skills[activeSkillIndex].content
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {/* Skill Title */}
                      <div className="flex items-center justify-between p-4">
                        <p className="text-gray-500 text-xs">
                          Skill: {courseDetails.topics[activeTopicIndex]?.skills[activeSkillIndex]?.skillTitle}
                        </p>

                        <div className="flex gap-2">
                          {/* Edit Skill Name Button */}
                          <button
                            onClick={() => setEditingSkillName(true)}
                            className="text-gray-400 hover:text-indigo-600 transition-colors p-1 hover:cursor-pointer"
                            aria-label="Edit skill name"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>

                          {/* Delete Skill Button */}
                          <button
                            onClick={handleDeleteSkill}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1 hover:cursor-pointer"
                            aria-label="Delete skill"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <AnimatePresence>
                          {editingSkillName && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}

                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
                            >
                              <motion.div
                                key="skillname-edit-modal"
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                                transition={{ type: "spring", duration: 0.3, damping: 12, stiffness: 100 }}
                                className="bg-black  p-6 rounded-lg max-w-sm w-full  border border-white"
                              >
                                <h3 className="font-medium mb-4 text-white">Edit Skill Name</h3>
                                <Input
                                  value={courseDetails.topics[activeTopicIndex]?.skills[activeSkillIndex]?.skillTitle || ''}
                                  onChange={(e) => handleSkillChange(
                                    activeTopicIndex,
                                    activeSkillIndex,
                                    'skillTitle',
                                    e.target.value
                                  )}
                                  className="mb-4 text-white"
                                  autoFocus
                                />
                                <div className="flex justify-end gap-2">

                                  <Button
                                    className="hover:cursor-pointer bg-transparent hover:brightness-150"
                                    onClick={() => {
                                      const currentTitle = courseDetails.topics[activeTopicIndex]?.skills[activeSkillIndex]?.skillTitle;
                                      if (!currentTitle?.trim()) {
                                        toast.error("Skill name cannot be empty")
                                        return;
                                      }
                                      setEditingSkillName(false);
                                    }}
                                    disabled={!courseDetails.topics[activeTopicIndex]?.skills[activeSkillIndex]?.skillTitle?.trim()}

                                  >
                                    Change
                                  </Button>
                                </div>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>


                      {/* Code Editor */}

                      <div className="flex-1 overflow-hidden">
                        {courseDetails.topics[activeTopicIndex]?.skills?.length ? (
                          <div className="overflow-x-auto h-full w-full">
                            <Editor
                              height="100%"
                              defaultLanguage="html"
                              theme="vs-dark"
                              value={courseDetails.topics[activeTopicIndex]?.skills[activeSkillIndex]?.content || ''}
                              onChange={(value) => handleSkillChange(
                                activeTopicIndex,
                                activeSkillIndex,
                                'content',
                                value || ''
                              )}
                              options={{
                                minimap: { enabled: true },
                                fontSize: 14,
                                wordWrap: "on",
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                                renderWhitespace: "selection",
                                tabSize: 2,
                                autoClosingBrackets: "always",
                                autoClosingQuotes: "always",
                                formatOnPaste: true,
                                formatOnType: true,
                              }}
                              className="h-full"
                            />
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-50">
                            <div className="text-center max-w-md">
                              <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                <Code className="w-8 h-8 text-gray-400" />
                              </div>
                              <h3 className="text-lg font-medium text-gray-800 mb-2">No Skills Yet</h3>
                              <p className="text-gray-500 text-sm mb-6">
                                This topic doesn't contain any skills yet. Add your first skill to start editing content.
                              </p>
                              <Button
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                  // Ensure the topic exists and has a skills array
                                  if (!courseDetails.topics[activeTopicIndex]?.skills) {
                                    // Initialize skills array if it doesn't exist
                                    const updatedTopics = [...courseDetails.topics];
                                    updatedTopics[activeTopicIndex] = {
                                      ...updatedTopics[activeTopicIndex],
                                      skills: []
                                    };
                                    setCourseDetails(prev => ({ ...prev, topics: updatedTopics }));
                                  }

                                  setAddingSkillToTopic(activeTopicIndex);
                                  setNewSkillTitle(`New Skill ${courseDetails.topics[activeTopicIndex]?.skills?.length + 1 || 1}`);
                                  setActiveSkillIndex(0);
                                }}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Skill
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 text-gray-300 px-4 max-sm:py-2 text-sm sticky bottom-0 gap-2">


        {/* Right side - Buttons */}
        <div className="flex gap-2 w-full justify-end items-center">
          <Button
            className="text-gray-300 hover:bg-gray-700 text-xs bg-transparent hover:cursor-pointer"
          >
            Discard Changes
          </Button>
          <Button
            className={`text-xs hover:cursor-pointer bg-transparent hover:bg-gray-700`}
            onClick={handleSave}
          >
            <p>Save Changes</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseEditorPage;


const EditorPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto overflow-x-hidden col-span-16">
      {/* Navigation Header Skeleton */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex gap-4 md:gap-0 md:justify-between md:items-center sticky top-0 z-10 flex-col md:flex-row">
        <div className="flex items-center space-x-4">
          <div className="animate-pulse flex items-center">
            <div className="w-5 h-5 mr-2 bg-gray-200 rounded"></div>
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Sidebar Skeleton */}
        <div className="w-full lg:w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-2 h-12">
              <div className="bg-gray-200 rounded animate-pulse"></div>
              <div className="bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="flex justify-end mb-2">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Topics Skeleton */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between bg-gray-50 rounded-md p-2">
                  <div className="flex items-center w-full">
                    <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse mr-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>

                {/* Skills Skeleton */}
                <div className="ml-4 space-y-1 mt-2">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="h-6 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                  <div className="h-6 bg-gray-100 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Editor Area Skeleton */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Editor Header Skeleton */}
          <div className="border-b border-gray-200 p-4 bg-white flex md:justify-between flex-col space-y-6 md:space-y-0 md:flex-row md:items-center sticky top-0 z-10">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse col-span-2 md:col-span-0"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Editor Skeleton */}
            <div className="flex-1 bg-gray-100 animate-pulse">
              <div className="h-full w-full bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar Skeleton */}
      <div className="bg-gray-800 text-gray-300 px-4 max-sm:py-2 text-sm sticky bottom-0 gap-2">
        <div className="flex gap-2 w-full justify-end items-center">
          <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-600 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}