export type ButtonProps = {
  text: String;
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
  courses: any[];
  _id: string,
};

export type SidebarLinkSchema = {
  routeName: string,
  icon: any,
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
  isPublished: Boolean,
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
  isPublished: Boolean,
}


export type coursesContainer<T> = {
  courses: T[]
}

export type MyCoursesProp = {
  courseId: string | null
}


export type  TopicContentDisplaySchema  = {
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