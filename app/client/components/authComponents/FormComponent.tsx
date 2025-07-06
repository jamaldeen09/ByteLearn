"use client";
import { Button } from "@/components/ui/button";
import { arrowIcon, Icons } from "../../../icons/Icons";
import { FormProps } from "../../types/types";
import { useRedirect } from "../../utils/utils";
import Logo from "../reusableComponents/Logo";
import { motion } from "framer-motion"

const FormComponent = ({
  context,
  showDontHaveAnAcc,
  showAlreadyHaveAnAcc,
  bgHeading,
  bgDesc,
  children,
  googleAuthReq
}: FormProps): React.ReactElement => {

  // routing utility function
  const { redirectTo } = useRedirect()

  return (
    <div className="min-h-screen flex">

      {/* Sidebar */}
      <div
        className="bg-white w-full min-h-fit iphone:pb-6  max-sm:pb-4 max-lg:max-w-xs px-4 sm:py-4 flex flex-col iphone:gap-10 sm:gap-5"
      >
        {/* Logo + Name */}
        <div className="w-full flex items-center justify-between max-lg:justify-start max-sm:py-3 iphone:py-4 sm:py-0">

          <div className="flex items-center">
            <Logo />
            <h1 className="font-extrabold iphone:text-md sm:text-2xl">ByteLearn</h1>
          </div>

          <div className="fit flex items-center space-x-4 max-lg:hidden ">
            <button className="hover:cursor-pointer py-[0.4rem] bg-black text-white font-bold px-3 rounded-md centered-flex space-x-2">
              <span>{arrowIcon}</span>
              <p className="iphone:text-[0.6rem] max-sm:text-[0.7rem] sm:text-[0.9rem]" onClick={() => redirectTo("/")}>Go Back</p>
            </button>
          </div>
        </div>


        {/* Context */}
        <div className="w-full flex flex-col space-y-4">
          <h1 className="text-xl font-extrabold">{context || "Sign up as a student"}</h1>
          {showAlreadyHaveAnAcc ? <p className="text-sm">Already have an account? <span onClick={() => redirectTo("/client/auth/login")} className="text-blue-500 hover:cursor-pointer">Login</span></p> :
            showDontHaveAnAcc ? <p className="text-sm">Dont have an account? <span onClick={() => redirectTo("/client/auth/studentSignup")} className="text-blue-500 hover:cursor-pointer">Signup as a student</span> or  <span onClick={() => redirectTo("/client/auth/instructorSignup")} className="text-blue-500 hover:cursor-pointer">Signup as an instructor</span> </p> : null}
        </div>

        {/* oAuth */}

        <div className="grid gap-4">
          {/* OAuth Button */}
          <div className="w-full">
            <Button onClick={googleAuthReq} variant="outline" className="w-full h-10">
              <Icons.google />
              Google
            </Button>
          </div>
        </div>

        {/* divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        {children}
      </div>

      <div
        style={{
          backgroundImage: "url(/TechPeople.jpg)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        className="w-full flex-col gap-4 p-20 min-h-screen hidden max-lg:flex"
      >
        <motion.div 
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, type: "spring", damping: 10, stiffness: 100 }}
          className="w-full max-w-lg flex flex-col space-y-4 text-white"
        >
          {/* Heading */}
          <h1 className="font-bold text-5xl leading-14">{bgHeading || "Join ByteLearn"}</h1>

          {/* Subheading */}
          <h3 className="">
            {bgDesc ||
              "Start Building your future by learning with real-world projects and direct mentorship"}
          </h3>
        </motion.div>

        <motion.div 
          initial={{ x: 500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.2, type: "spring", damping: 12, stiffness: 100, delay: 0.4 }}
          className=""
        >

          <Button className="hover:cursor-pointer">
            <span>{arrowIcon}</span>
            <p onClick={() => redirectTo("/")}>Go Back</p>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default FormComponent;

