"use client"
import React from 'react'
import FormComponent from '../../components/authComponents/FormComponent'
import InstructorSignup from "./InstructorSignup"
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const Page = (): React.ReactElement => {
  const router = useRouter()
  return (
    <FormComponent
     context="Sign up as an instructor"
     showDontHaveAnAcc={false}
     showAlreadyHaveAnAcc={true}
     bgHeading="Become a Mentor"
     bgDesc="Share your expertise, guide students and create impactful courses on ByteLearn"
     googleAuthReq={() => {
      try {
        router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google?state=instructor`)
      } catch (err) {
        console.error(err)
        toast.error("Unable to initiate Google sign in at the moment. Please try again later.")
        router.push("/client/auth/login")
      }
     }}
    >
        <InstructorSignup />
    </FormComponent>
  )
}

export default Page