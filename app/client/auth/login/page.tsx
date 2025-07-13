"use client"
import { useRouter } from 'next/navigation'
import FormComponent from '../../components/authComponents/FormComponent'
import Login from './Login'
import toast from 'react-hot-toast'

const page = (): React.ReactElement => {
  const router = useRouter()
  
    
  return (
    <FormComponent
     context="Login to your account"
     showDontHaveAnAcc={true}
     showAlreadyHaveAnAcc={false}
     bgHeading="Welcome Back to ByteLearn"
     bgDesc="Continue your journey towards building real-world skills and achieving your goals with hands-on projects and mentorship"
     googleAuthReq={() => {
      try {
        router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`)
      } catch (err) {
        toast.error("Unable to initiate Google sign in at the moment. Please try again later.")
        router.push("/client/auth/login")
      }
     }}
    >
      <Login />
    </FormComponent>
  )
}

export default page