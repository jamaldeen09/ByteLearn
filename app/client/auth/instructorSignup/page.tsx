"use client"
import React from 'react'
import FormComponent from '../../components/authComponents/FormComponent'
import InstructorSignup from "./InstructorSignup"
import toast from 'react-hot-toast'
import { useRedirect } from '../../utils/utils'

const page = (): React.ReactElement => {
  const { redirectTo } = useRedirect()
  return (
    <FormComponent
     context="Sign up as an instructor"
     showDontHaveAnAcc={false}
     showAlreadyHaveAnAcc={true}
     bgHeading="Become a Mentor"
     bgDesc="Share your expertise, guide students and create impactful courses on ByteLearn"
     googleAuthReq={() => {
      try {
        redirectTo(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google?state=instructor`)
      } catch (err) {
        toast.error("Unable to initiate Google sign in at the moment. Please try again later.")
        redirectTo("/client/auth/login")
      }
     }}
    >
        <InstructorSignup />
    </FormComponent>
  )
}

export default page