"use client"
import toast from "react-hot-toast";
import FormComponent from "../../components/authComponents/FormComponent"
import Signup from "./Signup";
import { useRedirect } from "../../utils/utils";


const page = (): React.ReactElement => {
  const { redirectTo } = useRedirect()
  return (
    <FormComponent
      context="Sign up as a student"
      bgHeading="Join ByteLearn"
      bgDesc="Start Building your future by learning with real-world projects and direct mentorship"
      showAlreadyHaveAnAcc={true}
      showDontHaveAnAcc={false}
      googleAuthReq={() => {
        try {
          window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google?role=student`
        } catch (err) {
          toast.error("Unable to initiate Google sign in at the moment. Please try again later.")
          redirectTo("/client/auth/login")
        }
      }}
    >
      <Signup />
    </FormComponent>
  )
}

export default page
