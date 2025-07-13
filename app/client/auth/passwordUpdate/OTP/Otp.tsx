"use client"
import { useEffect, useState } from "react"
import axios from "../../../utils/config/axios"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useAppDispatch, useAppSelector } from "@/app/redux/essentials/hooks"
import { deactivateTimeReset } from "@/app/redux/triggers/timerResetTrigger"
import Spinner from "@/app/client/components/reusableComponents/Spinner"
import { triangleErr } from "@/app/icons/Icons"
import { useRedirect } from "@/app/client/utils/utils"

const Otp = (): React.ReactElement => {

    const [value, setValue] = useState("");
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ errorMsg, setErrorMsg ] = useState<string>("")

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        target.value = target.value.replace(/\D/g, "");
    };
    const timerTrigger = useAppSelector((state) => state.timerReset.resetTime);
    const [timeLeft, setTimeLeft] = useState<number>(300);
    const dispatch = useAppDispatch();

    
    useEffect(() => {
        const storedEndTime = localStorage.getItem("otpTimerEndTime");
        const remainingSeconds = storedEndTime
        ? Math.max(0, Math.floor((Number(storedEndTime) - Date.now()) / 1000))
        : 600;

        setTimeLeft(remainingSeconds);

        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        // Add this condition
        if (timerTrigger) {
            resetTimer();
            dispatch(deactivateTimeReset());
        }

        return () => clearInterval(interval);
    }, [timerTrigger, dispatch]);


    const resetTimer = () => {
        localStorage.setItem("otpTimerEndTime", String(Date.now() + 600 * 1000));
        setTimeLeft(600);
    };

    const formattedTime = `${Math.floor(timeLeft / 60).toString().padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`;

    // utility function
    const { redirectTo } = useRedirect();

    // make verification req to my backend
    const verifyOTP = () => {
        if (!value || value.length < 6 || value.length > 6 || isNaN(parseInt(value))) {
            setErrorMsg("Invalid OTP")
            setValue("")
            return;
        }

        setErrorMsg("")
        setLoading(true);
        axios.post("/api/verify-otp", {
            otp: parseInt(value)
        }, { headers: { "Authorization": `Bearer ${localStorage.getItem("password-reset-token")}`} }).then(() => {
            setValue("")
            setLoading(false);
            redirectTo("/client/auth/passwordUpdate/newPassword");
            return;
        }).catch((err) => {
            setLoading(false);
            if (err.response?.status === 403){
                setErrorMsg(`OTP has likely expired`)
                setValue("")
                return;
            }

            setErrorMsg(err.response?.data.msg)
            setValue("");
            return;
        })
    }
    return (
        <div
            className="h-fit py-6 rounded-xl shadow-xl border-gray-400 border flex flex-col space-y-10"
        >
            {/* Heading */}
            <div className="col-centered text-center space-y-1 py-2">
                <h1 className="font-extrabold text-xl">Email Verification</h1>
                <p className="text-xs text-gray-400">We have sent a code to your email</p>
                {/* countdown timer */}
                <div className="text-xs text-gray-400">
                    Expires in: <span className="text-red-600">{formattedTime}</span>
                </div>
            </div>

            {/* Otp Area */}
            <div className="w-full col-centered space-y-4">
                <InputOTP
                   maxLength={6}
                   pattern="[0-9]*"
                   inputMode="numeric"
                   value={value}
                   onChange={(newValue) => setValue(newValue)}
                   onInput={handleInput}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <p className="text-red-600 text-xs centered-flex w-full gap-2">{errorMsg}{errorMsg && triangleErr}</p>
            </div>

            {/* button for submission */}
            <div className="w-full centered-flex text-sm">
                <button onClick={() => verifyOTP()}
                className={` bg-black text-white font-bold px-4 rounded-lg py-2 centered-flex space-x-4 hover:bg-black/85 hover:cursor-pointer`}>
                    <p>Verify your account</p>
                    {loading && <Spinner />}
                </button>
            </div>
        </div>
    )
}

export default Otp