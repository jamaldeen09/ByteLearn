
"use client";
import { RobotIcon } from '../components/reusableComponents/RobotIcon';
import { useRouter } from "next/navigation";
import { ButtonProps, SidebarLinkSchema } from "../types/types";
import {
  academicCap,
  bookIcon,
  chatIcon,
  dashboardIcon,
  profileIcon,
  settingsIcon,
  starIcon,
} from "@/app/icons/Icons";

// routing
export const useRedirect = () => {
  const router = useRouter();

  const redirectTo = (path: string) => {
    router.push(path);
  };

  return { redirectTo };
};

// landing page Button Information
export const getButtonInformation = (): ButtonProps[] => {
  const { redirectTo } = useRedirect();
  const buttonInformation: ButtonProps[] = [
    {
      text: "Sign up as a student",
      funcToExecute: () => redirectTo("/client/auth//studentSignup"),
    },
    {
      text: "Sign up as an Instructor",
      funcToExecute: () => redirectTo("/client/auth/instructorSignup"),
    },
    {
      text: "Sign in",
      funcToExecute: () => redirectTo("/client/auth/login"),
    },
  ];

  return buttonInformation;
};

// validation
export const firstNameValidation = (firstName: string): boolean => {
  if (!firstName || firstName.length < 3 || typeof firstName !== "string")
    return false;
  return true;
};

export const lastNameValidation = (lastName: string): boolean => {
  if (!lastName || lastName.length < 3 || typeof lastName !== "string")
    return false;
  return true;
};

export const emailValidation = (email: string): boolean => {
  const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

  if (!strictEmailRegex.test(email) || !email) return false;
  return true;
};

export const passwordValidation = (password: string): boolean => {
  if (!password || password.length < 5 || typeof password !== "string")
    return false;
  return true;
};

// utility functions
export const invalidInput = (
  trigger: boolean,
  errMsg: string,
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>,
  setErrMsg: React.Dispatch<React.SetStateAction<string>>
): void | never => {
  setTrigger(trigger);
  setErrMsg(errMsg);
};

export const refresh = (
  setFirstname: React.Dispatch<React.SetStateAction<string>>,
  setLastname: React.Dispatch<React.SetStateAction<string>>,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  setPassword: React.Dispatch<React.SetStateAction<string>>,
  isLoginForm: boolean
) => {
  if (isLoginForm) {
    setEmail("");
    setPassword("");
  }
  setFirstname("");
  setLastname("");
  setEmail("");
  setPassword("");
};

const generateRoute = (setRoute: React.Dispatch<React.SetStateAction<string>>, str: string) => {
  setRoute(str)
}

export const sidebarlinks: SidebarLinkSchema[] = [
  {
    routeName: "Dashbord",
    icon: dashboardIcon,
    value: "a",
    isActive: false,
  },
  {
    routeName: "My Courses",
    icon: academicCap, 
    value: "b",
    isActive: false,
  },
  {
    routeName: "Courses",
    icon: bookIcon,
     value: "c",
     isActive: false,
  },
  {
    routeName: "Chats",
    icon: chatIcon,
    value: "d",
    isActive: false,
  },
  {
    routeName: "Achievements",
    icon: starIcon,
    value: "e",
    isActive: false,
  },
  {
    routeName: "Profile",
    icon: profileIcon,
    value: "f",
    isActive: false,
  },
  {
    routeName: "ByteLearn Ai",
    icon: <RobotIcon />,
    value: "g",
    isActive: false,
  },
  {
    routeName: "Settings",
    icon: settingsIcon,
     value: "h",
     isActive: false,
  },
];
