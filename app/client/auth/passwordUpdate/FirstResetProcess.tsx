"use client"
import { useState, useEffect } from "react";
import { emailValidation, invalidInput, useRedirect } from "../../utils/utils";
import { triangleErr } from "@/app/icons/Icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios  from "@/app/client/utils/config/axios"
import { useAppDispatch } from "@/app/redux/essentials/hooks";
import { activateTimeReset } from "@/app/redux/triggers/timerResetTrigger";
import WhiteSpinner from "../../components/reusableComponents/WhiteSpinner";

const FirstResetProcess = (): React.ReactElement => {
    // local states

    // strings (values)
    const [email, setEmail] = useState<string>("");

    // booleans
    const [showEmailErr, setShowEmailErr] = useState<boolean>(false);

    const [disableBtn, setDisableBtn] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    // strings (error message states)
    const [emailError, setEmailError] = useState<string>("")



    useEffect(() => {
        const emailValidity = emailValidation(email)

        if (!emailValidity) {
            setDisableBtn(true);
            return
        }

        if (emailValidity) {
            setDisableBtn(false);
            return;
        }
    }, [
        email,
    ])

    // utility function
    const { redirectTo } = useRedirect()

    // global states
    const dispatch = useAppDispatch()

    // Post req for reseting password
    const resetPassword = (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        e.preventDefault()
        axios.post("/api/forgot-password", {
            email
        }).then((res) => {
            setLoading(false)
            localStorage.setItem("password-reset-token", res.data.passwordResetToken);
            dispatch(activateTimeReset());
            redirectTo("/client/auth/passwordUpdate/OTP");
            return;
        }).catch((err) => {
            setLoading(false)
            if (err.response?.status === 404){
                setEmail("")
                setEmailError("Email was not found. OTP was not sent")
                return;
            }
            setEmailError(err.response?.data.msg);
            console.error(err);
            return;
        })
    }

    return (
        <form
          onSubmit={resetPassword}
          method="POST"
          className="w-full flex flex-col space-y-6"
        >

            {/* Email */}
            <div className="grid gap-2">
                <Label>
                    Email
                </Label>
                <div className="relative flex flex-col space-y-2">
                    <Input
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newEmail = e.target.value
                            if (!emailValidation(newEmail)) {
                                invalidInput(true, "Invalid email", setShowEmailErr, setEmailError)
                            } else {
                                invalidInput(false, "", setShowEmailErr, setEmailError)
                            }
                            setEmail(e.target.value)
                        }}
                        className={`h-12 ${showEmailErr && "border-destructive focus-visible:ring-destructive focus:border-0"}`}
                    />
                    <p className="text-red-600 text-xs">{emailError}</p>
                    {showEmailErr && <p className="text-red-600 absolute top-4 right-4">{triangleErr}</p>}
                </div>
            </div>


            <div className="w-full">
                {disableBtn ? <Button
                    disabled
                    className={`bg-gray-300 text-gray-600 w-20`}>
                    <p>Next</p>
                </Button> : <Button
                    type="submit"
                    className={`centered-flex space-x-4 hover:cursor-pointer hover:shadow-2xl w-20`}>
                    <p>Next</p>
                    {loading && <WhiteSpinner />}
                </Button>}
            </div>
        </form>
    )
}

export default FirstResetProcess