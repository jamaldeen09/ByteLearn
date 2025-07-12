"use client"
import toast from "react-hot-toast"
import FormComponent from "../../components/authComponents/FormComponent"
import FirstResetProcess from "./FirstResetProcess"
import { useRedirect } from "../../utils/utils"


const page = (): React.ReactElement => {
    const { redirectTo } = useRedirect()
    return (
        <FormComponent
            context="Change your password"
            showAlreadyHaveAnAcc={false}
            showDontHaveAnAcc={false}
            bgHeading="Reset Your Password"
            bgDesc="Don’t worry, it happens to the best of us. Enter your email to receive a secure OTP and get back into your learning journey."
            googleAuthReq={() => {
                try {
                    redirectTo(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`)
                } catch (err) {
                    toast.error("Unable to initiate Google sign in at the moment. Please try again later.")
                    redirectTo("/client/auth/login")
                }
            }}
        >
            <FirstResetProcess />
        </FormComponent>
    )
}

export default page