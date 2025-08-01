export type ButtonProps = {
  text: string;
  funcToExecute: () => void;
};

export type DropdownProps = {
  dropdownContent: ButtonProps;
  label?: string;
  children: React.ReactNode;
};

export type FormProps = {
  context: string;
  showAlreadyHaveAnAcc: boolean;
  showDontHaveAnAcc: boolean;
  bgHeading: string;
  bgDesc: string;
  children: React.ReactNode;
  googleAuthReq: () => void | never;
};

export type TimerResetSchema = {
  resetTime: boolean;
};

export type CanvasSchema = {
  canvas: boolean;
};

export type AlertProps = {
  alertTitle: string;
  alertDescription: string;
  icon: string;
};

export type UserInfoSchema = {
  email: string;
  fullName: string;
  friends: UserInfoSchema[];
  role: string;
  enrolledCourses: courseSchema[];
  createdCourses: courseSchema[];
  _id: string;
  bio: string;
  avatar: string;
};

export type SidebarLinkSchema = {
  routeName: string;
  icon: React.ReactNode; // Replaced any with React.ReactNode
  value: string;
  isActive: boolean;
};

export type SidebarNavProps = {
  profilePic: string;
  firstName: string;
};

export type onGoingCoursesProps = {
  courseImgURL: string;
  courseName: string;
  currentTopic: string;
  progress: number;
  countinueLearningLink: string;
  courseId: string;
  isPublished: boolean | undefined;
  likedByCurrentUser: boolean | undefined
};

export type NewCourseCardProps = {
  category: string;
  title: string;
  courseImg: string;
  instructorImg: string;
  instructorName: string;
  likes: number | undefined;
  getId: (id: string) => void;
  id: string;
};

export type LatestUpdateProps = {
  updateUrl: string;
  updateCategory: string;
  updateTitle: string;
  updateDesc: string;
};

export type NotificationCardProps = {
  senderURL: string;
  sendersName: string;
  dateSent: string;
  descriptionOfWhatWasSent: string;
};

export type MyCoursesCardProps = {
  imgUrl: string;
  title: string;
  instructorImg: string;
  progress: number;
  instructorsName: string;
  continueCourse?: (id: string) => void;
  topic?: string;
  courseId: string;
};

export type CourseCard = {
  imageUrl: string;
  title: string;
  creator: CreatorSchema;
  id: string;
  likes?: number;
};

type quizSchema = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export type singleCourseSchema = {
  _id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  topics: topicSchema[];
  dateCreated: string;
  creator: CreatorSchema;
  isPublished: boolean;
  quiz: quizSchema[]
};

export type topicSchema = {
  _id: string;
  title: string;
  skills: SkillsSchema[];
};

export type CreatorSchema = {
  _id?: string,
  fullName: string;
  email: string;
  profilePicture: string;
};

export type SkillsSchema = {
  skillTitle: string;
  content: string;
  _id: string;
};

export type CompletedSkillsSchema<T> = {
  completedSkills: T[];
};

export type feedBackMsgSchema = {
  _id: string;
  sender: {
    fullName: string;
    profilePicture: string;
    _id: string,
  };
  text: string;
  createdAt: string;
  isEdited: boolean;
  editedAt?: Date | null;
  editWindow?: Date | null;
  likes: number,
  likedBy: string[];
};

export type courseSchema = {
  _id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  topics: topicSchema[];
  dateCreated?: Date;
  creator: CreatorSchema;
  isPublished: boolean;
  likes?: number;
  feedbackMessages: feedBackMsgSchema[];
  likedByCurrentUser?: boolean;
  createdCourses?: courseSchema[];
  peopleEnrolled: {
    fullName: string,
    avatar: string,
    bio: string,
  },
  quiz: quizSchema[];
  enrollments: number,
  enrolledAt: Date,
  isArchived?: boolean;
};
export interface MyCourseWithProgress extends courseSchema {
  progressData?: {
    completedSkills: string[];
    isCompleted: boolean;
    lastVisitedSkill: string;
  };
}

export type coursesContainer<T> = {
  courses: T[];
};

export type MyCoursesProp = {
  courseId: string | null;
};

export type TopicContentDisplaySchema = {
  topicTitle: string;
  topicsSkillsTitle: SkillsSchema[];
  selectedSkillId?: string | null;
};

export type SkillContentProps = {
  skillId: string;
};

export type quizComponentprops = {
  topicId: string;
};

export type QuizItemProps = {
  option: string;
  isCorrect: boolean;
  clickAnswer: (id: string) => void;
  id: string;
  isSelected?: boolean;
  showResult?: boolean;
};

export interface Skill {
  _id: string;
  skillTitle: string;
  content: string;
}

export interface Topic {
  _id: string;
  title: string;
  skills: Skill[];
  quiz?: quizSchema[]; // Add proper quiz type if needed
}

export interface CourseBase {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  topics: Topic[];
  creator: {
    fullName: string;
    email: string;
    profilePicture: string;
  };
  dateCreated?: Date;
  isPublished?: boolean;
  likes?: number;
  feedbackRoom?: string;
  enrollments?: number;
  peopleEnrolled?: string[];
  version?: number;
  publishedVersion?: number | null;
}

export interface ProgressData {
  completedSkills: string[];
  isCompleted: boolean;
  lastVisitedSkill: string | null;
  snapshottedCourse: CourseBase;
}

export interface EnrolledCourse extends CourseBase {
  progressData: ProgressData;
}

export interface ProgressState {
  course: string;
  lastVisitedSkill: string | null;
  completedSkills: string[];
  isCompleted: boolean;
  snapshottedCourse?: CourseBase; // Add this to match backend
  completionRate?: number;
  lastVisitedTopic?: string;
}

export interface ProgressRootState {
  progress: ProgressState[];
}

export type SidebarDropdownLinks = {
  name: string;
  styles: string;
  routingFunc: () => void;
};

export type ChatFilterProps = {
  filterName: string;
  isActive: boolean;
};

export type FriendProps = {
  friendImageUrl: string;
  friendName: string;
  previousMessage: string;
  timePreviousMsgWasSent: string;
  unreadMessages: number;
  bio: string;
  createRoom: (id: string) => void;
  id: string;
  isActive: boolean;
};

export type ClickedFriendState = {
  id: string;
  information: {
    _id: string;
    fullName: string;
    avatar: string;
    isOnline: boolean;
    bio: string;
  };
};

export type InformationSchema = {
  information: {
    _id: string;
    fullName: string;
    avatar: string;
    isOnline: boolean;
    bio: string;
  };
};

export type EnableAddFriendProps = {
  triggerAddFriend: boolean;
  setTriggerAddFriend: React.Dispatch<React.SetStateAction<boolean>>;
};

export type AddComponentProps = {
  icon: React.ReactNode; // Replaced any with React.ReactNode
  purpose: string;
  whatTheButtonDoes: () => void;
};

export type NewFriendTrigger = {
  triggerNewFriend: boolean;
};

export type NewGroupTrigger = {
  triggerNewGroup: boolean;
};

export type GroupMembersProps = {
  memberName: string;
  profilePic: string;
  bio: string;
  setIsAdded: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  isAdded: boolean;
  add: (id: string) => void | never;
  remove: (id: string) => void | never
};

export type FriendSchema = {
  friendImageUrl: string;
  isOnline: boolean;
  friendName: string;
  lastSeen: string;
  bio: string;
  _id: string;
  lastMessage: IMessage;
};

export type ReduxFriendsSliceSchema = {
  friends: FriendSchema[];
};

export type NotificationSchema = {
  _id: string;
  sender: {
    _id: string;
    fullName: string;
    avatar: string;
    email: string;
  };
  content: string;
  receiver: {
    _id: string;
    fullName: string;
    avatar: string;
    email: string;
  };
  isSeen: boolean;
  sentAt: Date;
  briefContent: string;
};

export type NotificationContainer = {
  notifications: NotificationSchema[];
};

export type NotifSenderInformationSchema = {
  fullName: string;
  avatar: string;
  email: string;
  content: string;
};

export type UserPreview = {
  _id: string | undefined;
  fullName: string;
  avatar: string | undefined;
};

export type IMessage = {
  _id: string;
  imageUrl?: string;
  sender: UserPreview;
  receiver: UserPreview;
  roomId: string;
  status: "sent" | "delivered" | "read";
  content: string;
  sentAt: Date | string;
  deliveredAt?: Date | string;
  readAt?: Date | string;
};

export type IMessageInput = {
  sender: string;
  receiver: string;
  roomId: string;
  content: string;
  status?: "sent";
};

export type MessagesState = {
  messages: IMessage[];
};

export type IsFriendsState = {
  isFriends: boolean;
};

export type ChatDropDownData = {
  name: string;
  clickFunc: () => void;
};

export type ProfileSidebar = {
  fullName: string;
  bio: string;
  trigger: boolean;
  avatar: string;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  triggerImgView: React.Dispatch<React.SetStateAction<boolean>>;
  imgView: boolean;
};

export type PreviewImageTriggerSchema = {
  clickedImageId: string;
  activatePreview: boolean;
};
