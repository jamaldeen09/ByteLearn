import express from "express"
import http from "http"
import { Server } from "socket.io"
import dotenv from "dotenv"
import mongoose from "mongoose"
import passport from "passport"
import cors from "cors"
import { authRouter } from "./routes/authRouter.js"
import "./config/passport.js";
import Course from "./models/Course.js"
import { exampleCourse,  cssMasteryCourse, pythonCourse, reactCourse } from "./data/courseData.js"
import { courseRouter } from "./routes/courseRouter.js"


dotenv.config();

const URL = process.env.MONGO_URL
const PORT = process.env.NEXT_PUBLIC_PORT
const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    origin: "http://localhost:3000"
})

app.use(express.json())
app.use(passport.initialize());
app.use(cors({
    origin: "http://localhost:3000"  
}))
app.use(authRouter)
app.use(courseRouter)

mongoose.connect(URL ? URL : "").then(async () => {
    // const title = "Mastering JavaScript for Web Development"
    // const otherTitle = "Mastering Modern CSS Development"
    // const deleteCourse = await Course.findOneAndDelete({$and: [{title: title}, {title: otherTitle} ]})

    // console.log(deleteCourse, "has been deleted")

    // await Course.insertOne(cssMasteryCourse)
    // await Course.insertOne(pythonCourse)

    // await Course.insertOne(reactCourse)
    // console.log("react course added")
    // const deleted = await Course.findOneAndDelete({ title: "Mastering React.js: From Fundamentals to Advanced Patterns" })
    // console.log(deleted)
    // console.log("Added new course")
    server.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));
}).catch((err) => {     
    console.error(err)
})    