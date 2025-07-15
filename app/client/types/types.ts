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
  canvas: boolean
}

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
  courses: unknown[]; // Replaced any with unknown
  _id: string,
  bio: string,
  avatar: string,
};

export type SidebarLinkSchema = {
  routeName: string,
  icon: React.ReactNode, // Replaced any with React.ReactNode
  value: string,
  isActive: boolean
}

export type SidebarNavProps = {
  profilePic: string,
  firstName: string
}

export type onGoingCoursesProps = {
  courseImgURL: string,
  courseName: string,
  currentTopic: string,
  progress: number,
}

export type NewCourseCardProps = {
  category: string,
  title: string,
  description: string,
  courseImg: string,
  instructorImg: string,
  instructorName: string,
  dateOfCreation: string,
}

export type LatestUpdateProps = {
  updateUrl: string,
  updateCategory: string,
  updateTitle: string,
  updateDesc: string,
}

export type NotificationCardProps = {
  senderURL: string,
  sendersName: string,
  dateSent: string,
  descriptionOfWhatWasSent: string,
}

export type MyCoursesCardProps = {
  imgUrl: string,
  category?: string,
  title: string,
  desc: string,
  instructorImg: string,
  progress: number,
  instructorsName: string,
  continueCourse?: (id: string) => void,
  topic?: string,
  courseId: string,
}

export type CourseCard = {
  imageUrl: string;
  title: string;
  description: string;
  creator: CreatorSchema,
  topics: topicSchema[];
  category: string,
  enroll: (id: string) => void,
  id: string,
  isEnrolling: boolean,
  isEnrolled: boolean,
}

type quizSchema = {
  question: string,
  options: string[],
  correctAnswer: string
}

export type singleCourseSchema = {
  _id: string
  title: string,
  description: string,
  category: string,
  imageUrl: string,
  topics: topicSchema[],
  dateCreated: string,
  creator: CreatorSchema,
  isPublished: boolean,
}

export type topicSchema = {
  _id: string,
  title: string,
  skills: SkillsSchema[]
  quiz: quizSchema[]
}

export type CreatorSchema = {
  fullName: string
  email: string,
  profilePicture: string,
}

export type SkillsSchema = {
  skillTitle: string,
  content: string,
  _id: string,
}

export type CompletedSkillsSchema<T> = {
  completedSkills: T[]
}

export type courseSchema = {
  id: string
  title: string,
  description: string,
  category: string,
  imageUrl: string,
  topics: topicSchema[],
  dateCreated: Date,
  creator: CreatorSchema,
  isPublished: boolean,
}

export type coursesContainer<T> = {
  courses: T[]
}

export type MyCoursesProp = {
  courseId: string | null
}

export type TopicContentDisplaySchema = {
  topicTitle: string;
  topicsSkillsTitle: SkillsSchema[]; 
  selectedSkillId?: string | null;
}

export type SkillContentProps = {
  skillId: string
}

export type quizComponentprops = {
  topicId: string,
}

export type QuizItemProps = {
  option: string,
  isCorrect: boolean,
  clickAnswer: (id: string) => void,
  id: string,
  isSelected?: boolean,
  showResult?: boolean,
}

export type ProgressState = {
  course: string;
  lastVisitedSkill: string | null;
  completedSkills: string[];
  isCompleted: boolean;
}

export type ProgressRootState = {
  progress: ProgressState[];
}

export type SidebarDropdownLinks = {
  name: string,
  styles: string,
  routingFunc: () => void
}

export type ChatFilterProps = {
  filterName: string,
  isActive: boolean
}

export type FriendProps = {
  friendImageUrl: string,
  friendName: string,
  previousMessage: string,
  timePreviousMsgWasSent: string,
  unreadMessages: number,
  bio: string,
  createRoom: (id: string) => void,
  id: string,
  isActive: boolean,
}

export type ClickedFriendState = {
  id: string;
  information: {
    _id: string;
    fullName: string;
    avatar: string;
    isOnline: boolean;
    bio: string;
  } ;
}

export type InformationSchema = {
  information: {
    _id: string,
    fullName: string,
    avatar: string,
    isOnline: boolean,
    bio: string,
  }
}

export type EnableAddFriendProps = {
  triggerAddFriend: boolean,
  setTriggerAddFriend: React.Dispatch<React.SetStateAction<boolean>>
}

export type AddComponentProps = {
  icon: React.ReactNode, // Replaced any with React.ReactNode
  purpose: string,
  whatTheButtonDoes: () => void;
}

export type FriendsOnByteLearnProps = {
  profilePicture: string,
  name: string,
  bio: string,
  createRoom: (id: string) => void
  id: string,
}

export type NewFriendTrigger = {
  triggerNewFriend: boolean
}

export type NewGroupTrigger = {
  triggerNewGroup: boolean
}

export type GroupMembersProps = {
  memberName: string,
  profilePic: string,
  bio: string,
  setIsAdded: React.Dispatch<React.SetStateAction<boolean>>,
  id: string,
  isAdded: boolean,
}

export type FriendSchema = {
  friendImageUrl: string,
  isOnline: boolean,
  friendName: string,
  lastSeen: string,
  bio: string,
  _id: string,
  lastMessage: IMessage,
}

export type ReduxFriendsSliceSchema = {
  friends: FriendSchema[],
}

export type NotificationSchema = {
  _id: string,
  sender: {
    _id: string,
    fullName: string,
    avatar: string,
    email: string,
  },
  content: string,
  receiver: {
    _id: string,
    fullName: string,
    avatar: string,
    email: string,
  },
  isSeen: boolean, // Changed from Boolean to boolean
  sentAt: Date,
  briefContent: string,
}

export type NotificationContainer = {
  notifications: NotificationSchema[]
}

export type NotifSenderInformationSchema = {
  fullName: string,
  avatar: string,
  email: string,
  content: string,
}

export type UserPreview = {
  _id: string | undefined;
  fullName: string;
  avatar: string | undefined;
};

export type IMessage = {
  _id: string;
  imageUrl?: string,
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

export type IsFriendsState  = {
  isFriends: boolean;
}

export type ChatDropDownData = {
  name: string, 
  clickFunc: () => void
}

export type ProfileSidebar = {
  fullName: string,
  bio: string,
  trigger: boolean, 
  avatar: string
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>,
  triggerImgView: React.Dispatch<React.SetStateAction<boolean>>,
  imgView: boolean,
}

export type PreviewImageTriggerSchema = {
  clickedImageId: string,
  activatePreview: boolean,
}