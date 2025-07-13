"use client"

import FormComponent from "@/app/client/components/authComponents/FormComponent"
import ChangePassword from "./ChangePassword"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

const Page = (): React.ReactElement => {
  const router = useRouter()
  return (
    <FormComponent
      context="New password"
      showAlreadyHaveAnAcc={false}
      showDontHaveAnAcc={false}
      bgHeading="Set Your New Password"
      bgDesc="Create a strong new password to keep your ByteLearn account secure and continue your journey without interruptions"
      googleAuthReq={() => {
        try {
          router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`)
        } catch (err) {
          console.error(err)
          toast.error("Unable to initiate Google sign in at the moment. Please try again later.")
          router.push("/client/auth/login")
        }
      }}
    >
      <ChangePassword />
    </FormComponent>
  )
}

export default Page