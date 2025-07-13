"use client"
import toast from "react-hot-toast"
import FormComponent from "../../components/authComponents/FormComponent"
import FirstResetProcess from "./FirstResetProcess"
import { useRouter } from "next/router"


const Page = (): React.ReactElement => {
    const router = useRouter()

    return (
        <FormComponent
            context="Change your password"
            showAlreadyHaveAnAcc={false}
            showDontHaveAnAcc={false}
            bgHeading="Reset Your Password"
            bgDesc="Don’t worry, it happens to the best of us. Enter your email to receive a secure OTP and get back into your learning journey."
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
            <FirstResetProcess />
        </FormComponent>
    )
}

export default Page