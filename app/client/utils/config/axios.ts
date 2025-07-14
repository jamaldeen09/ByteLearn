import axios from "axios"


axios.defaults.baseURL = "http://localhost:4080"
axios.defaults.withCredentials = true
export default axios;


// process.env.NEXT_PUBLIC_BACKEND_URL