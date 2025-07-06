import express from "express"
import http from "http"
import { Server } from "socket.io"
import dotenv from "dotenv"
import mongoose from "mongoose"
import passport from "passport"
import cors from "cors"
import { authRouter } from "./routes/authRouter.js"
import "./config/passport.js";


dotenv.config();

const URL = process.env.MONGO_URL
const PORT = process.env.NEXT_PUBLIC_PORT
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    origin: "http://localhost:3000"
})

app.use(express.json())
app.use(passport.initialize());
app.use(cors({
    origin: "http://localhost:3000"
}))
app.use(authRouter)

mongoose.connect(URL ? URL : "").then(async () => {
    console.log("Successfully connected to mongodb")
    // await mongoose.connection.dropDatabase()
    // console.log("database dropped")
    server.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));
}).catch((err) => {
    console.error(err)
})