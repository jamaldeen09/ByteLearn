
"use client";

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
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';

// routing
export const useRedirect = () => {
  const router = useRouter();

  const redirectTo = (path: string) => {
    router.push(path);
  };

  return { redirectTo };
};

// landing page Button Information
export const  useButtonInformation = (): ButtonProps[] => {
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
    routeName: "Inbox",
    icon: <EnvelopeClosedIcon className="w-5 h-5"/>,
    value: "e",
    isActive: false
  },
  {
    routeName: "Settings",
    icon: settingsIcon,
     value: "h",
     isActive: false,
  },
];


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

export function getTimeAgo(timestamp: string | Date): string {
  const now: Date = new Date();
  const past: Date = new Date(timestamp);
  const seconds: number = Math.floor((now.getTime() - past.getTime()) / 1000);

  // Time intervals in seconds
  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  // Future time (e.g., "in 30 minutes")
  if (seconds < 0) {
    const absSeconds: number = Math.abs(seconds);
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval: number = Math.floor(absSeconds / secondsInUnit);
      if (interval >= 1) {
        return `in ${interval} ${unit}${interval === 1 ? "" : "s"}`;
      }
    }
    return "just now";
  }

  // Past time (e.g., "30 minutes ago")
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval: number = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }

  return "just now";
}

export const generateFriendRequest = (
  fullName: any,
  id: any,
  requestStatus = "pending"
) => {
  // Base HTML for the notification content (keep this exactly as is)
  const notificationContent = `
    <div class="friend-request-letter" style="
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #f9fafb;
      font-family: 'Georgia', serif; 
      line-height: 1.6;
      color: #111827;
    ">
      <!-- Header -->
      <div class="letter-header" style="
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 15px;
        margin-bottom: 15px;
      ">
        <h2 style="font-size: 1.5rem; color: #1f2937; margin-bottom: 5px;">
          Friendship Request
        </h2>
        <p style="font-style: italic; color: #6b7280;">
          From: ${fullName}
        </p>
      </div>

      <!-- Body -->
      <div class="letter-body" style="margin-bottom: 20px;">
        <p>Dear Friend,</p>
        <p style="margin: 15px 0;">
          I came across your profile and was genuinely impressed. 
          I'd love the chance to connect and share experiences.
        </p>
      </div>
  `;

  // Only modify the buttons section
  const baseButtonStyles = `
    padding: 10px 16px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  `;

  let buttonsHTML = '';
  
  if (requestStatus === "accepted") {
    buttonsHTML = `
      <div class="letter-actions" style="
        display: flex;
        gap: 10px;
        margin-top: 25px;
        border-top: 1px solid #e5e7eb;
        padding-top: 15px;
      ">
        <button 
          style="
            ${baseButtonStyles}
            background: #059669;
            color: white;
            width: 100%;
            cursor: not-allowed;
          "
          disabled
        >
          ✓ Accepted
        </button>
      </div>
    `;
  } 
  else if (requestStatus === "rejected") {
    buttonsHTML = `
      <div class="letter-actions" style="
        display: flex;
        gap: 10px;
        margin-top: 25px;
        border-top: 1px solid #e5e7eb;
        padding-top: 15px;
      ">
        <button 
          style="
            ${baseButtonStyles}
            background: #f3f4f6;
            color: #6b7280;
            width: 100%;
            cursor: not-allowed;
            border: 1px solid #e5e7eb;
          "
          disabled
        >
          ✗ Declined
        </button>
      </div>
    `;
  }
  else {
    buttonsHTML = `
      <div class="letter-actions" style="
        display: flex;
        gap: 10px;
        margin-top: 25px;
        border-top: 1px solid #e5e7eb;
        padding-top: 15px;
      ">
        <button 
          id="accept-btn-${id}" 
          class="accept-btn" 
          data-sender="${id}"
          style="
            ${baseButtonStyles}
            background: #10b981;
            color: white;
            flex: 1;
          "
        >
          Accept
        </button>
        <button 
          id="reject-btn-${id}" 
          class="reject-btn" 
          data-sender="${id}"
          style="
            ${baseButtonStyles}
            background: white;
            color: #6b7280;
            flex: 1;
            border: 1px solid #e5e7eb;
          "
        >
          Decline
        </button>
      </div>
    `;
  }

  // Closing HTML (keep this as is)
  const closingHTML = `
      <!-- Closing -->
      <div class="letter-closing" style="
        margin-top: 20px;
        font-style: italic;
        color: #6b7280;
      ">
        <p>Warm regards,</p>
        <p>${fullName}</p>
      </div>
    </div>
  `;

  // Combine all parts
  return notificationContent + buttonsHTML + closingHTML;
};