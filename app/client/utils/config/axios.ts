import axios from "axios"


axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
axios.defaults.withCredentials = true
export default axios;


// process.env.NEXT_PUBLIC_BACKEND_URL
// https://bytelearn-online-school-backend.onrender.com