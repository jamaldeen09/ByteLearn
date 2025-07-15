"use client"
import { ButtonProps } from "../../types/types";

const LandingPageButton = ({ text, funcToExecute }: ButtonProps): React.ReactElement => {
  return (
    <button
      onClick={funcToExecute}
      className="px-4 sm:px-6 py-3 bg-black text-white font-extrabold rounded-lg hover:brightness-120 hover:cursor-pointer duration-200
      transition-all iphone:text-[0.5rem] max-sm:text-[0.6rem] sm:text-xs md:text-[1rem] "
      aria-label={`Navigate to ${text} page`}
    >
      {text || "Click"}
    </button>
  );
};

export default LandingPageButton; 