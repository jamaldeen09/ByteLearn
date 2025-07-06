"use client"

import FormComponent from "@/app/client/components/authComponents/FormComponent"
import ChangePassword from "./ChangePassword"
import toast from "react-hot-toast"
import { useRedirect } from "@/app/client/utils/utils"

const page = (): React.ReactElement => {
  const { redirectTo } = useRedirect()
  return (
    <FormComponent
      context="New password"
      showAlreadyHaveAnAcc={false}
      showDontHaveAnAcc={false}
      bgHeading="Set Your New Password"
      bgDesc="Create a strong new password to keep your ByteLearn account secure and continue your journey without interruptions"
      googleAuthReq={() => {
        try {
          window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`
        } catch (err) {
          toast.error("Unable to initiate Google sign in at the moment. Please try again later.")
          redirectTo("/client/auth/login")
        }
      }}
    >
      <ChangePassword />
    </FormComponent>
  )
}

export default page