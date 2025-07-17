"use client"
import toast from "react-hot-toast";
import FormComponent from "../../components/authComponents/FormComponent"
import Signup from "./Signup";
import { useRouter } from "next/navigation";


const Page = (): React.ReactElement => {
  const router = useRouter()
  return (
    <FormComponent
      context="Sign up as a student"
      bgHeading="Join ByteLearn"
      bgDesc="Start Building your future by learning with real-world projects and direct mentorship"
      showAlreadyHaveAnAcc={true}
      showDontHaveAnAcc={false}
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
      <Signup />
    </FormComponent>
  )
}

export default Page
