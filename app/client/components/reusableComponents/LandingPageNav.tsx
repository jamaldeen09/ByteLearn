"use client"
import Logo from "./Logo"
import { useRouter } from "next/navigation"



const LandingPageNav = (): React.ReactElement => {
  
  const router = useRouter()
 
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
        <div className="text-sm space-x-6 fit flex items-center">
          <li onClick={() => router.push("/client/auth/login")}
          className="hover:text-blue-500 hover:cursor-pointer" >Sign in</li>
        </div>
    </nav>
  )
}

export default LandingPageNav