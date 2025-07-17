"use client"
import { useEffect, useState } from "react"
import { invalidInput, passwordValidation, useRedirect } from "@/app/client/utils/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { triangleErr } from "@/app/icons/Icons"
import axios from "../../../utils/config/axios"
import toast from "react-hot-toast"
import WhiteSpinner from "@/app/client/components/reusableComponents/WhiteSpinner"


const ChangePassword = () => {
  // local states

  // strings (values)
  const [password, setPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("");

  // strings (error messages)
  const [passwordError, setPasswordError] = useState<string>("");
  const [newPasswordError, setNewPasswordError] = useState<string>("")

  // booleans;
  const [showPasswordErr, setShowPasswordErr] = useState<boolean>(false);
  const [showNewPasswordErr, setShowNewPasswordErr] = useState<boolean>(false);
  const [disableBtn, setDisableBtn] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  


  useEffect(() => {

    const passwordValidity = passwordValidation(password)
    const newPasswordValidity = passwordValidation(newPassword)

    if (!newPasswordValidity || !passwordValidity) {
      setDisableBtn(true);
      return
    }

    if (passwordValidity && newPasswordValidity) {
      setDisableBtn(false);
      return;
    }
  }, [
    newPassword,
    password
  ])

  // utility function
  const { redirectTo } = useRedirect()

  // make post req
  const changePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isEqual = password === newPassword
    if (!isEqual) {
      setNewPassword("")
      setPassword("")
      setNewPasswordError("Passwords must be the same")
      return;
    }

    setLoading(true);
    axios.post("/api/change-password", {
      password: newPassword
    }, { headers: { "Authorization": `Bearer ${localStorage.getItem("password-reset-token")}`} }).then(() => {
      setNewPassword("")
      setPassword("")
      toast.success("Password Changed successfully")
      redirectTo("/client/dashboard")
      
    }).catch((err) => {
      setLoading(false)

      if (err.response?.status === 403){
        setNewPassword("")
        setPassword("")
        setNewPasswordError("Password cannot be changed. OTP expired")
        return;
      }
      setNewPassword("")
      setPassword("")
      setNewPasswordError(err.response?.data.msg)
      return;
    })
  }
  return (
    <form
      onSubmit={changePassword}
      method="POST"
      className="w-full flex flex-col space-y-6"
    >
      {/* password (new one)*/}
      <div className="grid gap-2">
        <Label>
          New Password
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

      {/* password (confirmation) */}
      <div className="grid gap-2">
        <Label>
          Confirm Password
        </Label>
        <div className="relative flex flex-col space-y-2">
          <Input
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newPassword = e.target.value
              if (!passwordValidation(newPassword)) {
                invalidInput(true, "Invalid password", setShowNewPasswordErr, setNewPasswordError)
              } else {
                invalidInput(false, "", setShowNewPasswordErr, setNewPasswordError)
              }
              setNewPassword(e.target.value)
            }}
            className={`h-12 ${showNewPasswordErr && "border-destructive focus-visible:ring-destructive focus:border-0"}`}
          />
          <p className="text-red-600 text-xs">{newPasswordError}</p>
          {showNewPasswordErr && <p className="text-red-600 absolute top-4 right-4">{triangleErr}</p>}
        </div>
      </div>

      {/* submit button */}
      <div className="">
        {disableBtn ? <button
          className={` bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm`}>
          <p>Change</p>
        </button> : <button
          type="submit"
          className={` bg-black text-white text-sm font-bold px-4 rounded-lg py-2 centered-flex space-x-4 hover:bg-black/85 hover:cursor-pointer`}>
          <p>Change</p>
          {loading && <WhiteSpinner />}
        </button>}
      </div>
    </form>
  )
}

export default ChangePassword