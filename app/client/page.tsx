"use client"
import LandingPageButton from "./components/reusableComponents/LandingPageButton"
import LandingPageNav from "./components/reusableComponents/LandingPageNav"
import { ButtonProps } from "./types/types"
import { useButtonInformation } from "./utils/utils"
import Image from "next/image"

const LandingPage = (): React.ReactElement => {
  const buttonInformation: ButtonProps[] = useButtonInformation();
  return (
    <div className="h-fit">
      {/* Nav Bar */}
      <LandingPageNav />

      {/* Hero Section */}
      <div className="h-fit max-lg:space-x-10 lg:space-x-20 py-10 flex flex-col items-center lg:flex-row lg:items-center lg:justify-center">
        {/* Hero Section image - Replaced img with Image */}
        <div className="w-[80vw] max-sm:w-[70vw] sm:w-[85vw] md:w-[60vw] max-lg:w-[46vw] rounded-full relative aspect-square">
          <Image
            src="/TechPerson.jpg"
            alt="Illustration of a person coding on a laptop"
            fill
            className="rounded-full object-cover"
            sizes="(max-width: 640px) 85vw, (max-width: 768px) 60vw, 46vw"
          />
        </div>

        {/* Hero Section Text */}
        <div className="col-centered space-y-6">
          <div className="leading-6 w-full iphone:max-w-60 max-sm:max-w-xs sm:max-w-md md:max-w-xl flex flex-col space-y-6 text-center lg:text-start">
            {/* Heading */}
            <h1 className="font-extrabold iphone:text-xl max-sm:text-2xl sm:text-3xl md:text-5xl max-lg:text-6xl">Learn By Building</h1>

            {/* Sub Heading */}
            <h3 className="iphone:text-[0.7rem] max-sm:text-[0.7rem] sm:text-sm md:text-md max-lg:text-[1rem]">Master coding by working on real projects, completing quizzes,and getting feedback from mentors—so you&apos;re ready for your first developer job</h3>
          </div>

          {/* Buttons */}
          <div className="fit w-full space-x-6 flex items-center justify-center lg:items-start lg:justify-start">
            {buttonInformation.map((link: ButtonProps, index: number): React.ReactElement => {
              return <LandingPageButton key={index} text={link.text} funcToExecute={link.funcToExecute}/>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage