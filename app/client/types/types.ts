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

export type SidebarProps = {
  currentRoute: string,
  setCurrentRoute: React.Dispatch<React.SetStateAction<string>>
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
  category: string,
  title: string,
  desc: string,
  instructorImg: string,
  progress: number,
  instructorsName: string,
  continueCourse: (id: string) => void,
  topic: string,
}

export type CourseCard = {
  imageUrl: string;
  title: string;
  description: string;
  creator: {
    name: string;
    imageUrl?: string;
  };
  topics: string[];
}