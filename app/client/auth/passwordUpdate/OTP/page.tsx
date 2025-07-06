"use client"
import FormComponent from "@/app/client/components/authComponents/FormComponent"
import toast from "react-hot-toast"
import Otp from "./Otp"
import { useRedirect } from "@/app/client/utils/utils"


const page = () => {  
  const { redirectTo } = useRedirect()
  return (
    <FormComponent
      context="OTP has been sent to you"
      showAlreadyHaveAnAcc={false}
      showDontHaveAnAcc={false}
      bgHeading="📩 Verify Your Email"
      bgDesc="We’ve sent a one-time password (OTP) to your email. Please enter it below to verify your identity and continue."
      googleAuthReq={() => {
        try {
          window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`
        } catch (err) {
          toast.error("Unable to initiate Google sign in at the moment. Please try again later.")
          redirectTo("/client/auth/login")
        }
       }}
    >
        <Otp />
    </FormComponent>
  )
}

export default page