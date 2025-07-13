"use client"
import React, { useState, useEffect } from "react";
import { emailValidation, firstNameValidation, lastNameValidation, passwordValidation, refresh } from "../../utils/utils";
import { invalidInput } from "../../utils/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { triangleErr } from "@/app/icons/Icons";
import Spinner from "../../components/reusableComponents/Spinner";
import axios from "../../utils/config/axios"
import { useRouter } from "next/navigation";

const InstructorSignup = (): React.ReactElement => {
    // local states

    // strings (values)
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter()

    // booleans
    const [showFirstNameErr, setShowFirstNameErr] = useState<boolean>(false);
    const [showLastNameErr, setShowLastNameErr] = useState<boolean>(false);
    const [showEmailErr, setShowEmailErr] = useState<boolean>(false);
    const [showPasswordErr, setShowPasswordErr] = useState<boolean>(false);
    const [disableBtn, setDisableBtn] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    // strings (error message states)
    const [firstNameError, setFirstNameError] = useState<string>("")
    const [lastNameError, setLastNameError] = useState<string>("")
    const [emailError, setEmailError] = useState<string>("")
    const [passwordError, setPasswordError] = useState<string>("")

    // utility functions
   

    useEffect(() => {
        const firstnameValidity = firstNameValidation(firstName)
        const lastnameValidity = lastNameValidation(lastName)
        const emailValidity = emailValidation(email)
        const passwordValidity = passwordValidation(password)

        if (!firstnameValidity || !lastnameValidity || !emailValidity || !passwordValidity) {
            setDisableBtn(true);
            return
        }

        if (firstnameValidity && lastnameValidity && emailValidity && passwordValidity) {
            setDisableBtn(false);
            return;
        }
    }, [
        firstName,
        lastName,
        email,
        password
    ])

    // Post req to backend
    const instructorSignup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        axios.post("/api/instructorSignup", {
            firstName,
            lastName,
            email,
            password
        }).then(() => {
            refresh(setFirstName, setLastName, setEmail, setPassword, false);
            router.push("/client/dashboard/instructorDashboard");
        }).catch((err) => {
            setLoading(false);
            console.error(err)
            if (err.response?.status === 400) {
                refresh(setFirstName, setLastName, setEmail, setPassword, false);
                setPasswordError("Please make sure the fields are valid");
                return;
            } else if (err.response?.status === 406) {
                refresh(setFirstName, setLastName, setEmail, setPassword, false);
                setPasswordError("Account already exists. Please log in");
                return;
            } else {
                refresh(setFirstName, setLastName, setEmail, setPassword, false);
                setPasswordError("Server error");
            }
        })
    }
    return (
        <form
            onSubmit={instructorSignup}
            method="POST"
            className="w-full flex flex-col space-y-6"
        >
            {/* FirstName */}
            <div className="grid gap-2">
                <Label>
                    FirstName
                </Label>
                <div className="relative flex flex-col space-y-2">
                    <Input
                        value={firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newFirstname = e.target.value
                            if (!firstNameValidation(newFirstname)) {
                                invalidInput(true, "Invalid firstname", setShowFirstNameErr, setFirstNameError)
                            } else {
                                invalidInput(false, "", setShowFirstNameErr, setFirstNameError)
                            }
                            setFirstName(e.target.value)
                        }}
                        className={`h-12 ${showFirstNameErr && "border-destructive focus-visible:ring-destructive focus:border-0"}`}
                    />
                    <p className="text-red-600 text-xs">{firstNameError}</p>
                    {showFirstNameErr && <p className="text-red-600 absolute top-4 right-4">{triangleErr}</p>}
                </div>
            </div>

            {/* Lastname */}
            <div className="grid gap-2">
                <Label>
                    LastName
                </Label>
                <div className="relative flex flex-col space-y-2">
                    <Input
                        value={lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newLastname = e.target.value
                            if (!lastNameValidation(newLastname)) {
                                invalidInput(true, "Invalid lastname", setShowLastNameErr, setLastNameError)
                            } else {
                                invalidInput(false, "", setShowLastNameErr, setLastNameError)
                            }
                            setLastName(e.target.value)
                        }}
                        className={`h-12 ${showLastNameErr && "border-destructive focus-visible:ring-destructive focus:border-0"}`}
                    />
                    <p className="text-red-600 text-xs">{lastNameError}</p>
                    {showLastNameErr && <p className="text-red-600 absolute top-4 right-4">{triangleErr}</p>}
                </div>
            </div>

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

            <div className="grid gap-2">
                <Label>
                    Password
                </Label>
                <div className="relative flex flex-col space-y-2">
                    <Input
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newPassword = e.target.value
                            if (!passwordValidation(newPassword)) {
                                invalidInput(true, "Invalid password", setShowPasswordErr, setPasswordError)
                            } else {
                                invalidInput(false, "", setShowPasswordErr, setPasswordError)
                            }
                            setPassword(e.target.value)
                        }}
                        className={`h-12 ${showPasswordErr && "border-destructive focus-visible:ring-destructive focus:border-0"}`}
                    />
                    <p className="text-red-600 text-xs">{passwordError}</p>
                    {showPasswordErr && <p className="text-red-600 absolute top-4 right-4">{triangleErr}</p>}
                </div>
            </div>

            <div className="w-full">
            {disableBtn ? <button
                    className={` bg-gray-200 text-gray-500 px-5 py-2 rounded-lg text-sm`}>
                    <p>Next</p>
                </button> : <button
                    type="submit"
                    className={` bg-black text-white text-sm font-bold px-5 rounded-lg py-2 centered-flex space-x-4 hover:bg-black/85 hover:cursor-pointer`}>
                    <p>Next</p>
                    {loading && <Spinner />}
                </button>}
            </div>
        </form>
    )
}

export default InstructorSignup