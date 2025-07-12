"use client"
import FormComponent from '../../components/authComponents/FormComponent'
import { useRedirect } from '../../utils/utils'
import Login from './Login'
import toast from 'react-hot-toast'

const page = (): React.ReactElement => {
  const { redirectTo } = useRedirect()
  
    
  return (
    <FormComponent
     context="Login to your account"
     showDontHaveAnAcc={true}
     showAlreadyHaveAnAcc={false}
     bgHeading="Welcome Back to ByteLearn"
     bgDesc="Continue your journey towards building real-world skills and achieving your goals with hands-on projects and mentorship"
     googleAuthReq={() => {
      try {
        redirectTo(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`)
      } catch (err) {
        toast.error("Unable to initiate Google sign in at the moment. Please try again later.")
        redirectTo("/client/auth/login")
      }
     }}
    >
      <Login />
    </FormComponent>
  )
}

export default page