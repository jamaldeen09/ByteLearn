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