
"use client";
import { RobotIcon } from '../components/reusableComponents/RobotIcon';
import { useRouter } from "next/navigation";
import { ButtonProps, SidebarDropdownLinks, SidebarLinkSchema } from "../types/types";
import {
  academicCap,
  bookIcon,
  chatIcon,
  dashboardIcon,
  profileIcon,
  settingsIcon,
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
      text: "Student",
      funcToExecute: () => redirectTo("/client/auth//studentSignup"),
    },
    {
      text: "Instructor",
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

const colors = [
  { normal: "#FF5733", darker: "#CC4629" }, // Red-Orange
  { normal: "#33FF57", darker: "#29CC46" }, // Bright Green
  { normal: "#3357FF", darker: "#2946CC" }, // Blue
  { normal: "#F033FF", darker: "#C029CC" }, // Pink-Purple
  { normal: "#33FFF5", darker: "#29CCC7" }, // Cyan
  { normal: "#FF33A8", darker: "#CC2986" }, // Pink
  { normal: "#A833FF", darker: "#8629CC" }, // Purple
  { normal: "#33FFA8", darker: "#29CC86" }, // Aqua Green
  { normal: "#FF8C33", darker: "#CC7029" }, // Orange
  { normal: "#338CFF", darker: "#2970CC" }, // Sky Blue
  { normal: "#8C33FF", darker: "#7029CC" }, // Violet
  { normal: "#33FF8C", darker: "#29CC70" }, // Light Green
  { normal: "#FF338C", darker: "#CC2970" }, // Hot Pink
  { normal: "#33A8FF", darker: "#2986CC" }, // Light Blue
  { normal: "#A8FF33", darker: "#86CC29" }, // Lime
  { normal: "#FF33F5", darker: "#CC29C4" }, // Magenta
  { normal: "#F5FF33", darker: "#C4CC29" }, // Yellow
  { normal: "#33F5FF", darker: "#29C4CC" }, // Light Cyan
  { normal: "#FF5733", darker: "#CC4629" }, // Red-Orange (repeat for variety)
  { normal: "#57FF33", darker: "#46CC29" }, // Bright Lime
  { normal: "#5733FF", darker: "#4629CC" }, // Indigo
  { normal: "#FF33BD", darker: "#CC2997" }, // Deep Pink
  { normal: "#33FFBD", darker: "#29CC97" }, // Turquoise
  { normal: "#BD33FF", darker: "#9729CC" }, // Bright Purple
  { normal: "#33BDFF", darker: "#2997CC" }, // Light Sky Blue
  { normal: "#FFBD33", darker: "#CC9729" }, // Gold
  { normal: "#33FF57", darker: "#29CC46" }, // Bright Green (repeat)
  { normal: "#FF5733", darker: "#CC4629" }, // Red-Orange (repeat)
  { normal: "#33FF8C", darker: "#29CC70" }, // Light Green (repeat)
  { normal: "#8CFF33", darker: "#70CC29" }, // Yellow-Green
  { normal: "#FF338C", darker: "#CC2970" }, // Hot Pink (repeat)
  { normal: "#338CFF", darker: "#2970CC" }, // Sky Blue (repeat)
  { normal: "#8C33FF", darker: "#7029CC" }, // Violet (repeat)
  { normal: "#FF8C33", darker: "#CC7029" }, // Orange (repeat)
  { normal: "#33FFA8", darker: "#29CC86" }, // Aqua Green (repeat)
  { normal: "#A833FF", darker: "#8629CC" }, // Purple (repeat)
  { normal: "#FF33A8", darker: "#CC2986" }, // Pink (repeat)
  { normal: "#33FFF5", darker: "#29CCC7" }, // Cyan (repeat)
  { normal: "#F033FF", darker: "#C029CC" }, // Pink-Purple (repeat)
  { normal: "#33FF57", darker: "#29CC46" }, // Bright Green (repeat)
  { normal: "#FF5733", darker: "#CC4629" }, // Red-Orange (repeat)
  { normal: "#3357FF", darker: "#2946CC" }, // Blue (repeat)
  { normal: "#57FF33", darker: "#46CC29" }, // Bright Lime (repeat)
  { normal: "#FF33F5", darker: "#CC29C4" }, // Magenta (repeat)
  { normal: "#33F5FF", darker: "#29C4CC" }, // Light Cyan (repeat)
  { normal: "#F5FF33", darker: "#C4CC29" }, // Yellow (repeat)
  { normal: "#FF33A8", darker: "#CC2986" }, // Pink (repeat)
  { normal: "#A8FF33", darker: "#86CC29" }, // Lime (repeat)
  { normal: "#33A8FF", darker: "#2986CC" }, // Light Blue (repeat)
  { normal: "#FF8C33", darker: "#CC7029" }  // Orange (repeat)
];


export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex]
}


export const sidebarDropdownLinks: SidebarDropdownLinks[] = [
  {name: "Profile", styles: "px-4 py-2 hover:bg-gray-100 hover:cursor-pointer rounded-md text-sm",
    routingFunc: () => {
      console.log("incoming")
    }
  },
  {name: "Settings", styles: "px-4 py-2 hover:bg-gray-100 hover:cursor-pointer rounded-md text-sm",
    routingFunc: () => {
      console.log("incoming")
    }
  },

  {name: "Log out", styles: "px-4 py-2 hover:bg-red-100 hover:text-red-600 hover:cursor-pointer rounded-md text-sm",
    routingFunc: () => {
      console.log("incoming")
    }
  },
]

export const getDropdownLinks = (): SidebarDropdownLinks[] => {
  const { redirectTo } = useRedirect();
  const sidebarDropdownLinks: SidebarDropdownLinks[] = [
    {name: "Profile", styles: "px-4 py-2 hover:bg-gray-100 hover:cursor-pointer rounded-md text-sm",
      routingFunc: () => {
        console.log("incoming")
      }
    },
    {name: "Settings", styles: "px-4 py-2 hover:bg-gray-100 hover:cursor-pointer rounded-md text-sm",
      routingFunc: () => {
        console.log("incoming")
      }
    },
  
    {name: "Log out", styles: "px-4 py-2 hover:bg-red-100 hover:text-red-600 hover:cursor-pointer rounded-md text-sm",
      routingFunc: () => {
        console.log("incoming")
      }
    },
  ]
  return sidebarDropdownLinks
}