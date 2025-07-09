"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/app/redux/essentials/hooks";
import axios from "../../utils/config/axios"
import { getInformation } from "@/app/redux/informationSlices/usersInformationSlice";
import { useRedirect } from "../../utils/utils";

const SuccessPage = (): React.ReactElement => {
  const { redirectTo } = useRedirect()
  const dispatch = useAppDispatch()

  useEffect(() => {

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");


    if (token) {
      localStorage.setItem("bytelearn_token", token);

      axios.get("/api/get-information", { headers: { "Authorization": `Bearer ${localStorage.getItem("bytelearn_token")}` } }).then((res) => {
        if (res.data.payload.role === "student") {
          redirectTo("/client/dashboard/studentDashboard");
          return;
        } else {
          redirectTo("/client/dashboard/instructorDashboard");
        }
        
        dispatch(getInformation(res.data.payload));
      }).catch((err) => {
        redirectTo("/client/auth/login")
      })
    } else {
      redirectTo("/client/auth/login")
    }
  }, [dispatch]);

  return (
    <div className="h-screen centered-flex">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-[300px] h-[300px] rounded-full"
      >
        <source src="/videos/Loading.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default SuccessPage;
