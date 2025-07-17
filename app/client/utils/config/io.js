import { io } from "socket.io-client";


export const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
  auth: {
    token: typeof window !== "undefined" ? localStorage.getItem("bytelearn_token") : null
  },
});



