"use client"
import { useState, useEffect } from "react"
import { emailValidation, passwordValidation } from "../../utils/utils";
import Spinner from "../../components/reusableComponents/Spinner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { invalidInput, refresh } from "../../utils/utils";
import { triangleErr } from "@/app/icons/Icons";
import axios from "axios"
import { useRouter } from "next/navigation";


const Login = (): React.ReactElement => {
  // local states

  // strings (values)
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // booleans
  const [showEmailErr, setShowEmailErr] = useState<boolean>(false);
  const [showPasswordErr, setShowPasswordErr] = useState<boolean>(false);
  const [disableBtn, setDisableBtn] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  // strings (error message states)
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")

  // utility functions
  const router = useRouter()
  useEffect(() => {
    const emailValidity = emailValidation(email)
    const passwordValidity = passwordValidation(password)

    if (!emailValidity || !passwordValidity) {
      setDisableBtn(true);
      return
    }

    if (emailValidity && passwordValidity) {
      setDisableBtn(false);
      return;
    }
  }, [
    email,
    password
  ])

  // login endpoint
  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    axios.post("/api/login", {
      email,
      password
    }).then((res) => {
      setLoading(false)
      refresh(setEmail, setEmail, setEmail, setPassword, true);
      localStorage.setItem("bytelearn_token", res.data.token);

      setTimeout(() => {
        router.push("/client/dashboard");
      }, 1000);

    }).catch((err) => {
      console.error(err)
      setLoading(false)
      if (err.response.status === 404) {
        setPasswordError("Account was not found. Please sign up");
        refresh(setEmail, setEmail, setEmail, setPassword, true)
        return;
      }
      if (err.response.status === 406) {
        setPasswordError("Invalid credentials");
        refresh(setEmail, setEmail, setEmail, setPassword, true)
        return;
      }
    })
  }
  return (
    <form
      onSubmit={login}
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

      {/* Forgot password */}
      <div className="w-full">
        <p onClick={() => router.push("/client/auth/passwordUpdate")} className="text-sm text-blue-500 hover:cursor-pointer">Forgot your password?</p>
      </div>
    </form>
  )
}

export default Login