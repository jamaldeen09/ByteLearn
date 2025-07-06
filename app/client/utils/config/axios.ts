import axios from "axios"


axios.defaults.baseURL = `http://localhost:${process.env.NEXT_PUBLIC_PORT}`
export default axios;

