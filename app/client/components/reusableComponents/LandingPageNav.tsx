"use client"
import Logo from "./Logo"
import { getButtonInformation } from "../../utils/utils"
import { ButtonProps } from "../../types/types"
import { harmBurgerMenu } from "@/app/icons/Icons"
import Dropdown from "./Dropdown"


const LandingPageNav = (): React.ReactElement => {
  
  // Buttons
  const buttonInfo: ButtonProps[] = getButtonInformation();
 
  return (
    <nav
      className="flex-between items-center iphone:px-4 iphone:py-6 max-sm:py-4 max-sm:px-6 sm:px-8 md:px-10 max-lg:px-20 sm:py-2"
    >
        {/* logo + name */}
        <div className="flex items-center space-x-1 fit">
            <Logo />
            <h1 className="font-extrabold text-xl sm:text-2xl">ByteLearn</h1>
        </div>

        {/* Buttons (Desktop)*/}
        <div className="text-sm space-x-6 fit hidden max-lg:flex max-lg:items-center">
          <li className="hover:text-blue-500 hover:cursor-pointer" onClick={buttonInfo[2].funcToExecute}>{buttonInfo[2].text}</li>
        </div>

        {/* Buttons (Mobile) */}
        <div className="fit centered-flex max-lg:hidden">
          <Dropdown dropdownContent={buttonInfo[2]} label="Sign in to your account">
            <p className="fit hover:cursor-pointer">{harmBurgerMenu}</p>
          </Dropdown>
        </div>
    </nav>
  )
}

export default LandingPageNav