"use client"
import { ToastContainer, ToastOptions } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { toast } from "react-toastify"


export function showSuccessToast(message: string) {
  const options: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };
  
  toast.success(message, options);
}
const ToastProvider = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            className="toast-bounce"
        />
    )
}

export default ToastProvider