"use client"
import { useAppDispatch } from "@/app/redux/essentials/hooks"
import { courseSchema } from "../../types/types";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Editor, { Monaco } from "@monaco-editor/react";
import { BookOpen, Code, Eye, FileText, Plus, Settings, Trash2, ChevronDown, ChevronRight, Upload, X, AlertTriangle, Check, Info, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/app/client/utils/config/axios"
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DeepseekSpinner from "../../components/reusableComponents/DeepseekSpinner";

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
  quiz?: QuizQuestion[]
}


type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  _id?: string;
};

const CourseEditorPage = () => {

  // important variables
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const dispatch = useAppDispatch()
  const [courses, setCourses] = useState<courseSchema[]>([]);
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
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  // booleans
  const [loadingCourseDetails, setLoadingCourseDetails] = useState<boolean>(false);
  const [editingSkillName, setEditingSkillName] = useState(false);
  const [addingNewTopic, setAddingNewTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [editingTopicIndex, setEditingTopicIndex] = useState<number | null>(null);
  const [editedTopicTitle, setEditedTopicTitle] = useState('');
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [hasQuizChanges, setHasQuizChanges] = useState(false);
  const [newQuestion, setNewQuestion] = useState<QuizQuestion>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ""
  });
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [optionCount, setOptionCount] = useState(4);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialCourseData, setInitialCourseData] = useState<CourseDetails | null>(null);


  // state to manage all new inputs
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    isPublished: false,
    quiz: [],
    topics: []
  });


  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Add these handler functions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
      setCourseDetails(prev => ({
        ...prev,
        imageUrl: previewUrl
      }));
      setHasUnsavedChanges(true);
    }
  };
  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setCourseDetails(prev => ({
      ...prev,
      imageUrl: ""
    }));
    setHasUnsavedChanges(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const addNewTopic = () => {
    setCourseDetails(prev => ({
      ...prev,
      topics: [
        ...prev.topics,
        {
          title: newTopicTitle,
          skills: [],
          quiz: [],
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
    setHasUnsavedChanges(true);
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

  const fetchCourses = () => {
    setLoadingCourseDetails(true);

    axios.get("/api/courses", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } }).then((res) => {
      setCourses(res.data.allCourses)
      console.log(res.data.allCourses)
      setLoadingCourseDetails(false);
    }).catch((err) => {
      console.error(err);
      setLoadingCourseDetails(false);
    })
  }

  useEffect(() => {
    fetchCourses()
  }, [dispatch]);

  const toggleTopicExpansion = (index: number) => {
    setExpandedTopics(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };


  useEffect(() => {
    if (courseToEdit && !initialCourseData) {
      const initialData = {
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
          })),
        })),
        quiz: courseToEdit.quiz
      };

      setCourseDetails(initialData);
      setInitialCourseData(initialData);
      setHasUnsavedChanges(false);
    }
  }, [courseToEdit]);




  useEffect(() => {
    const originalQuiz = courseDetails.quiz || []
    setHasQuizChanges(
      JSON.stringify(quizQuestions) !== JSON.stringify(originalQuiz)
    );
  }, [quizQuestions, courseDetails, activeTopicIndex]);


  const handleDiscardChanges = () => {
    if (!hasUnsavedChanges) return;

    if (confirm('Are you sure you want to discard all changes? This cannot be undone.')) {
      if (initialCourseData) {
        setCourseDetails(JSON.parse(JSON.stringify(initialCourseData)));
        setImagePreviewUrl(null);
        setSelectedImageFile(null);
        setHasUnsavedChanges(false);
        toast.success('Changes discarded');
      }
    }
  };



  const handleEditorWillMount = (monaco: Monaco) => {

    monaco.languages.html.htmlDefaults.setOptions({
      format: {

        tabSize: 2,
        insertSpaces: true,
        wrapLineLength: 120,
        unformatted: 'span,b,i,em,strong,a,sub,sup,small,code',
        contentUnformatted: 'pre,code',
        indentHandlebars: false,
        endWithNewline: false,
        extraLiners: 'head,body,/html',
        preserveNewLines: true,
        maxPreserveNewLines: 1,
        indentInnerHtml: true,
        wrapAttributes: 'auto'
      },
      suggest: {
        html5: true
      }
    });

    monaco.languages.css.cssDefaults.setOptions({
      validate: true,
      lint: {
        compatibleVendorPrefixes: 'ignore'
      }
    });
  };


  const [isSaving, setIsSaving] = useState(false);
  const handleSave = () => {

    if (!courseId) return;
    if (!selectedImageFile && !courseDetails.imageUrl) {
      toast.error("Please upload a course image before saving");
      setIsSaving(false);
      return;
    }

    setIsSaving(true)
    const formData = new FormData();

    if (selectedImageFile) {
      formData.append("image", selectedImageFile);
    } else if (courseDetails.imageUrl) {
      formData.append("imageUrl", courseDetails.imageUrl);
    }

    formData.append("title", courseDetails.title)
    formData.append("description", courseDetails.description)
    formData.append("category", courseDetails.category)
    formData.append("isPublished", courseDetails.isPublished.toString())
    formData.append("topics", JSON.stringify(courseDetails.topics));
    formData.append("courseToEditId", courseId);
    formData.append("quiz", JSON.stringify(courseDetails.quiz));

    axios.patch("/api/update-course", formData, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}`,
        "Content-Type": "multipart/form-data",
      }
    }).then((res) => {
      setIsSaving(false)
      setActiveTab("course")

      setTimeout(() => {
        toast.success('Changes saved successfully!');
        fetchCourses()
        setSelectedImageFile(null);
        setHasUnsavedChanges(false);
      }, 2000)
    }).catch((err) => {
      console.error(err)
      if (err.response.status == 401) {
        router.push("/client/auth/login")
        return;
      } else if (err.response.status === 404) {
        toast.error(err.response.data.msg);
        return;
      } else {
        toast.error("A server error occured... Failed to save changes");
        return;
      }
    })
  }


  return (
    !courseId || courseToEdit?.isPublished ? (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 col-span-16">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-800">
                {!courseId ? "Course Editor" : "Published Course"}
              </h2>
            </div>
          </div>

          {/* Empty State Content */}
          <div className="p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              {!courseId ? (
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
              ) : (
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
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              )}
            </div>

            <h3 className="text-xl font-medium text-gray-800 mb-2">
              {!courseId ? "No Course Selected" : "Course Already Published"}
            </h3>
            <p className="text-gray-500 mb-6">
              {!courseId
                ? "Please select a course to edit or create a new one."
                : "This course is already published. Please unpublish it first to make edits."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">

              {!courseId ? (
                <Button
                  className="bg-gray-900 text-white hover:bg-gray-800 hover:cursor-pointer"
                  onClick={() => router.push("/client/dashboard?tab=course-creation")}
                >
                  Create New Course
                </Button>
              ) : (
                <Button
                  className="bg-gray-900 text-white hover:bg-gray-800 hover:cursor-pointer"
                  onClick={() => router.push(`/client/dashboard?tab=course-creation`)}
                >
                  View created courses
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    ) : loadingCourseDetails ? <EditorPageSkeleton /> : <div className="min-h-screen bg-gray-50 overflow-y-auto overflow-x-hidden col-span-16">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex gap-4 md:gap-0 md:justify-between md:items-center sticky top-0 z-10
      flex-col md:flex-row">
        <div className="flex w-full justify-between items-center">
          <h1 className="text-md md:text-xl font-bold text-gray-800 flex items-center">
            <FileText className="w-3 sh-3 md:w-5 md:h-5 mr-2 text-indigo-600" />
            Course Editor
          </h1>

          {activeTab === "content" && (
            <Button
              variant="outline"
              className="flex items-center hover:cursor-pointer text-xs"

              onClick={() => {
                const currentQuiz = courseDetails.quiz || [];
                setQuizQuestions(currentQuiz);
                setIsQuizModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-1" /> Edit Quiz
            </Button>
          )}

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
                        Add
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
                                Add Skill
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
                  <AlertTriangle className="w-3 h-3 text-red-600" />
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
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                          src={imagePreviewUrl || courseDetails.imageUrl || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
                          alt="Course cover"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        {imagePreviewUrl && (
                          <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <input
                          type="file"
                          id="cover-image-upload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          className="flex items-center space-x-2 hover:cursor-pointer text-xs md:text-sm"
                          onClick={() => document.getElementById('cover-image-upload')?.click()}
                        >
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
              <Card className="border border-gray-200 shadow-sm mt-6">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Info className="w-5 h-5 mr-2 text-gray-600" />
                    Draft Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="font-medium">This course is in draft mode</p>
                      <p className="text-sm text-gray-500">
                        Make changes here and save to update.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Editor Header */}
              <div className="border-b border-gray-200 p-4 bg-white flex  md:justify-between flex-col space-y-6 md:space-y-0 md:flex-row md:items-center sticky top-0 z-50">
                <div>
                  <h2 className="font-bold text-gray-800">
                    {courseDetails.topics[activeTopicIndex]?.title || "No Topic Selected"}
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
                  <Button
                    variant={previewMode ? "default" : "outline"}
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center  hover:cursor-pointer text-xs  col-span-2"
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


                  {/* Quiz modal */}
                  <AnimatePresence>
                    {isQuizModalOpen && (
                      <motion.div
                        key="edit-quiz-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 "
                        style={{ overflow: 'auto' }}
                      >
                        {/* Main Modal */}
                        <motion.div
                          key="edit-quiz-modal"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white dark:bg-gray-900 z-50 w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden "
                        >
                          {/* Modal Header */}
                          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center z-50">
                            <div>
                              <h3 className="text-2xl font-bold text-white">Quiz Editor</h3>
                              <p className="text-indigo-100 text-sm mt-1">
                                {quizQuestions.length} {quizQuestions.length === 1 ? 'question' : 'questions'}
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                setCourseDetails(prev => ({
                                  ...prev,
                                  quiz: quizQuestions
                                }));

                                if (hasQuizChanges) {
                                  setIsQuizModalOpen(false);
                                  toast("Changes have been made");
                                }
                                setIsQuizModalOpen(false);
                              }}
                              className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 hover:cursor-pointer"
                            >
                              <X className="w-6 h-6" />
                            </button>
                          </div>

                          {/* Modal Body */}
                          <div className="flex-1 flex flex-col overflow-hidden">
                            {/* Questions List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                              {quizQuestions.length > 0 ? (
                                quizQuestions.map((q, qIndex) => (
                                  <motion.div
                                    key={qIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: qIndex * 0.05 }}
                                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm
                                    "
                                  >
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                      <div className="flex justify-between items-start">
                                        <h4 className="font-medium text-gray-800 dark:text-gray-100">
                                          {q.question}
                                        </h4>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => {
                                              setNewQuestion({
                                                question: q.question,
                                                options: [...q.options],
                                                correctAnswer: q.correctAnswer
                                              });
                                              setOptionCount(q.options.length);
                                              setShowAddQuestionForm(true);
                                              setEditingQuestionIndex(qIndex);
                                            }}

                                            className="text-gray-400 hover:text-blue-500 transition-colors hover:cursor-pointer
                                            "
                                          >
                                            <Pencil2Icon className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => {
                                              const updated = [...quizQuestions];
                                              updated.splice(qIndex, 1);
                                              setQuizQuestions(updated);
                                            }}
                                            className="text-gray-400 hover:text-red-500 transition-colors
                                            "
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="p-4 space-y-3">
                                      {q.options.map((option, i) => {
                                        console.log("Option: ", option)
                                        console.log("Correct Answer: ", q.correctAnswer)
                                        return <div
                                          key={i}
                                          className={`flex items-center gap-3 p-2 rounded-md ${option === q.correctAnswer
                                            ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                                            : 'bg-gray-50 dark:bg-gray-700/30'
                                            }`}
                                        >
                                          <span className="font-medium w-6 text-center text-gray-500 dark:text-gray-400">
                                            {String.fromCharCode(65 + i)}
                                          </span>
                                          <p className="flex-1 text-gray-700 dark:text-gray-300">
                                            {option}
                                          </p>
                                          {option === q.correctAnswer && (
                                            <span className="text-green-500 dark:text-green-400">
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
                                                <path d="M20 6L9 17l-5-5" />
                                              </svg>
                                            </span>
                                          )}
                                        </div>
                                      })}
                                    </div>
                                  </motion.div>
                                ))
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                  </div>
                                  <h4 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                                    No questions yet
                                  </h4>
                                  <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                                    Add your first question to start building this quiz
                                  </p>
                                  <Button
                                    onClick={() => setShowAddQuestionForm(true)}
                                    className="mt-4"
                                    variant="outline"
                                  >
                                    <Plus className="w-4 h-4 mr-2" /> Add Question
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Add Question Form */}
                            <AnimatePresence>
                              {showAddQuestionForm && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ type: "spring", damping: 25 }}
                                  className="border-t border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
                                  style={{ maxHeight: '60vh' }} // Limits the maximum height
                                >
                                  {/* Scrollable Content Area */}
                                  <div className="overflow-y-auto flex-1">
                                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
                                      <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-semibold">
                                          {editingQuestionIndex !== null ? 'Edit Question' : 'New Question'}
                                        </h4>
                                        <button
                                          onClick={() => {
                                            setShowAddQuestionForm(false);
                                            setNewQuestion({
                                              question: '',
                                              options: ['', '', '', ''],
                                              correctAnswer: ""
                                            });
                                            setEditingQuestionIndex(null);
                                          }}
                                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:cursor-pointer"
                                        >
                                          <X className="w-5 h-5" />
                                        </button>
                                      </div>

                                      <div className="space-y-5">
                                        <div>
                                          <Label className="block text-sm font-medium mb-1">
                                            Question Text
                                            {!newQuestion.question.trim() && (
                                              <span className="text-red-500 text-xs ml-2">(Required)</span>
                                            )}
                                          </Label>
                                          <Textarea
                                            value={newQuestion.question}
                                            onChange={(e) => setNewQuestion({
                                              ...newQuestion,
                                              question: e.target.value
                                            })}
                                            className={`min-h-[100px] ${!newQuestion.question.trim() ? 'border-red-300 dark:border-red-500' : ''}`}
                                            placeholder="Enter your question here..."
                                          />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                          <div>
                                            <Label className="block text-sm font-medium mb-1">Options Count</Label>
                                            <Select
                                              value={optionCount.toString()}
                                              onValueChange={(value) => {
                                                const count = parseInt(value);
                                                setOptionCount(count);
                                                const newOptions = [...newQuestion.options];
                                                if (count > newOptions.length) {
                                                  while (newOptions.length < count) {
                                                    newOptions.push('');
                                                  }
                                                } else {
                                                  newOptions.length = count;
                                                }
                                                setNewQuestion({
                                                  ...newQuestion,
                                                  options: newOptions,
                                                  correctAnswer: Math.min(parseInt(newQuestion.correctAnswer), count - 1).toString()
                                                });
                                              }}
                                            >
                                              <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select option count" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {[2, 3, 4].map((num) => (
                                                  <SelectItem key={num} value={num.toString()}>
                                                    {num} Options
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <div>
                                            <Label className="block text-sm font-medium mb-1">Correct Answer</Label>
                                            <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md text-sm">
                                              {newQuestion.correctAnswer || "Not selected"}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="space-y-3">
                                          <Label className="block text-sm font-medium">Options</Label>
                                          {newQuestion.options.map((option, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                              <span className="font-medium w-6 text-center text-gray-500 dark:text-gray-400">
                                                {String.fromCharCode(65 + i)}
                                              </span>
                                              <Input
                                                value={option}
                                                onChange={(e) => {
                                                  const newOptions = [...newQuestion.options];
                                                  newOptions[i] = e.target.value;
                                                  setNewQuestion({
                                                    ...newQuestion,
                                                    options: newOptions,
                                                    // Preserve correct answer relationship
                                                    correctAnswer: newQuestion.correctAnswer === option
                                                      ? e.target.value
                                                      : newQuestion.correctAnswer
                                                  });
                                                }}
                                              />
                                              <button
                                                onClick={() => setNewQuestion({
                                                  ...newQuestion,
                                                  correctAnswer: option
                                                })}
                                                className={`p-2 rounded-full ${newQuestion.correctAnswer === option
                                                  ? 'text-indigo-600 dark:text-indigo-400'
                                                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                                  }`}
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="20"
                                                  height="20"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                >
                                                  {newQuestion.correctAnswer === option ? (
                                                    <circle cx="12" cy="12" r="10" fill="currentColor" />
                                                  ) : (
                                                    <circle cx="12" cy="12" r="10" />
                                                  )}
                                                </svg>
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Fixed Button Area */}
                                  <div className="bg-gray-100 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setShowAddQuestionForm(false);
                                        setNewQuestion({
                                          question: '',
                                          options: ['', '', '', ''],
                                          correctAnswer: ""

                                        });
                                      }}
                                      className="hover:cursor-pointer"
                                    >
                                      Cancel
                                    </Button>


                                    <Button
                                      onClick={() => {
                                        if (!newQuestion.question.trim()) {
                                          toast.error("Question text is required");
                                          return;
                                        }
                                        if (newQuestion.options.some(opt => !opt.trim())) {
                                          toast.error("All options must be filled");
                                          return;
                                        }

                                        const updatedQuestions = [...quizQuestions];
                                        if (editingQuestionIndex !== null) {
                                          // Update existing question
                                          updatedQuestions[editingQuestionIndex] = newQuestion;
                                        } else {
                                          // Add new question
                                          updatedQuestions.push(newQuestion);
                                        }

                                        setQuizQuestions(updatedQuestions);
                                        setNewQuestion({
                                          question: '',
                                          options: ['', '', '', ''],
                                          correctAnswer: ""
                                        });
                                        setShowAddQuestionForm(false);
                                        setEditingQuestionIndex(null);
                                      }}
                                    >
                                      {editingQuestionIndex !== null ? 'Update Question' : 'New Question'}
                                    </Button>

                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Modal Footer */}
                          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowAddQuestionForm(!showAddQuestionForm)
                                setNewQuestion({
                                  question: '',
                                  options: ['', '', '', ''],
                                  correctAnswer: "0"
                                });
                                setEditingQuestionIndex(null);
                              }}
                              disabled={showAddQuestionForm}
                              className="gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              {quizQuestions.length > 0 ? 'Add Another Question' : 'Add Question'}
                            </Button>

                            <div className="flex gap-3">
                              <Button
                                onClick={() => {
                                  setCourseDetails(prev => ({
                                    ...prev,
                                    quiz: quizQuestions
                                  }));
                                  if (hasQuizChanges) {
                                    setIsQuizModalOpen(false);
                                    toast("Changes have been made");
                                  }
                                  setIsQuizModalOpen(false);
                                }}
                              >
                                Exit
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    variant="destructive"
                    className="flex items-center hover:cursor-pointer text-xs col-span-2 md:col-span-0 "
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this topic and all its skills?')) {
                        // Delete the topic
                        setCourseDetails(prev => {
                          const updatedTopics = [...prev.topics];
                          updatedTopics.splice(activeTopicIndex, 1);

                          return {
                            ...prev,
                            topics: updatedTopics
                          };
                        });

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
                  <AnimatePresence>
                    {editingTopicIndex !== null && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1, damping: 30, stiffness: 100 }}
                        className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                        <motion.div
                          key="skillname-edit-modal"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.1 }}
                          className="p-6 rounded-lg max-w-sm w-full bg-white  border border-gray-300">
                          <h3 className="font-extrabold mb-4">Edit Topic Title</h3>
                          <Input
                            value={editedTopicTitle}
                            onChange={(e) => setEditedTopicTitle(e.target.value)}
                            className="mb-4"
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
                  </AnimatePresence>
                </div>
              </div>

              {/* Skill Editor */}
              {courseDetails?.topics[activeTopicIndex]?.skills[activeSkillIndex] && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {previewMode ? (
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                      <div className="flex-1 p-6 overflow-y-auto">
                        <div
                          className="prose max-w-none h-full overflow-y-auto"
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
                              transition={{ duration: 0.1 }}
                              className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
                            >
                              <motion.div
                                key="skillname-edit-modal"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 0.1, damping: 30, stiffness: 100 }}
                                className="bg-white  p-6 rounded-lg max-w-sm w-full  border border-white"
                              >
                                <h3 className="font-medium mb-4">Edit Skill Name</h3>
                                <Input
                                  value={courseDetails.topics[activeTopicIndex]?.skills[activeSkillIndex]?.skillTitle || ''}
                                  onChange={(e) => handleSkillChange(
                                    activeTopicIndex,
                                    activeSkillIndex,
                                    'skillTitle',
                                    e.target.value
                                  )}
                                  className="mb-4"
                                  autoFocus
                                />
                                <div className="flex justify-end gap-2">

                                  <Button
                                    className="hover:cursor-pointer hover:brightness-150"
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
                              beforeMount={handleEditorWillMount}
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
            variant="outline"
            className="text-gray-300 hover:bg-gray-700 text-xs bg-transparent hover:cursor-pointer"
            onClick={handleDiscardChanges}
          >
            Discard Changes
          </Button>


          <Button
            className={`text-xs ${hasUnsavedChanges
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-gray-800 text-gray-400 cursor-not-allowed"
              }`}
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
          >
            {hasUnsavedChanges ? (
              <>
                <p>Save Changes</p>
                {isSaving && <DeepseekSpinner />}
              </>
            ) : (
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3" />
                Saved
              </div>
            )}
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

