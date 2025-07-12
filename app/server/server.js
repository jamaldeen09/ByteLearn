import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import passport from "passport";
import cors from "cors";
import { authRouter } from "./routes/authRouter.js";
import "./config/passport.js";
import {
  exampleCourse,
  cssMasteryCourse,
  pythonCourse,
  reactCourse,
} from "./data/courseData.js";
import { courseRouter } from "./routes/courseRouter.js";
import { chatRouter } from "./routes/chatRouter.js";
import jwt from "jsonwebtoken";
import { events } from "../client/utils/events.js";
import User from "./models/User.js";
import { responseGenerator } from "./utils/utils.js";
import Notification from "./models/Notification.js";


dotenv.config();

const URL = process.env.MONGO_URL;
const PORT = process.env.NEXT_PUBLIC_PORT;
const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    socket.emit("unauthorized-access", {
      success: false,
      msg: "Unauthorized access",
    });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      socket.emit("invalid-token", {
        success: false,
        msg: "Token is not Valid",
      });
      return;
    } else {
      socket.user = decoded;
      next();
    }
  });
});


// `;

io.on("connection", async (socket) => {
  try {
    const currentUser = await User.findById(socket.user.userId)
    if (!currentUser) {
      socket.emit(events.NOT_FOUND, responseGenerator(false, "Account was not found"))
      return;
    }

    console.log(`${currentUser.fullName} has connected to  byteLearn website`)
    currentUser.isOnline = true;
    await currentUser.save()

    socket.off("disconnect", async () => {

      console.log(`${currentUser.fullName} has disconnected from byteLearn website`)
      currentUser.isOnline = false
      await currentUser.save()
    })

    socket.on(events.JOIN_ROOM, ({ room }) => {
      socket.join(room.toString());
      console.log(currentUser.fullName, `Has joined ${room}`);
    })

    socket.on(events.ADD_FRIEND, async ({ firstName, lastName }) => {
      console.log(firstName, lastName)
      const friend = await User.findOne({ fullName: `${firstName} ${lastName}` })
      if (!friend) {
        socket.emit(events.NOT_FOUND, responseGenerator(false, "Person you are trying to add does not exist"))
        return;
      }

      if (currentUser._id.equals(friend._id)) {
        socket.emit(events.NOT_ALLOWED, responseGenerator(false, "You cannot add yourself as a friend"));
        return;
      }

      if (currentUser.friends.includes(friend._id)) {
        socket.emit(events.NOT_ALLOWED, responseGenerator(false, `You and ${friend.fullName} are already friends`));
        return;
      }

      if (!currentUser.friends.includes(friend._id)) {

       setTimeout(() => {
        io.to(friend._id.toString()).emit(events.SEND_NOTIFICATION, responseGenerator(true, `${currentUser.fullName} sent you a friend request`));
       }, 2000)

        socket.emit(events.NEW_NOTIFICATION, responseGenerator(false, `A friend request has been sent to ${friend.fullName}`));

        // create new notfication
        const notificationContent = `
          <div class="friend-request">
          <img src="${currentUser.avatar}" width="40" height="40" style="border-radius:50%"/>
             <p>${currentUser.fullName} wants to be friends!</p>
          <div class="request-actions">
           <button class="accept-btn" data-sender="${currentUser._id}">Accept</button>
          <button class="reject-btn" data-sender="${currentUser._id}">Reject</button>
          </div>
        </div>`

        const notificationSent = await Notification.create({
          sender: currentUser._id,
          content: notificationContent,
          receiver: friend._id,
          isSeen: false,
          sentAt: Date.now(),
          briefContent: `${currentUser.fullName} wants to be friends!`
        })
        friend.notifications.push(notificationSent._id)
        await friend.save();
        return;
      }  
    })

    // seen notification
    socket.on(events.SEEN_NOTIFICATION, async ({ notifId }) => {
      if (!notifId){
        socket.emit(events.NOT_ALLOWED, responseGenerator(false, "Notification ID must be proivided"))
        return;
      }

      // find notification
      const foundNotification = await Notification.findById(notifId);
      if (!foundNotification) {
        socket.emit(events.NOT_FOUND, responseGenerator(false, "Notification was not found"))
        return;
      }

      if (foundNotification.isSeen) {
        socket.emit(events.NOT_ALLOWED, responseGenerator(true, "Notification is already seen"));
        return;
      }

      foundNotification.isSeen = true;
      await foundNotification.save();

      socket.emit(events.CHANGED_TO_SEEN, responseGenerator(true, "Notification seen"));
    })
  } catch (err) {
    console.error(err)
    socket.emit(events.ERROR_OCCURED, { success: false, msg: "Server Error" })
    return;
  }
});

app.use(express.json());
app.use(passport.initialize());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(authRouter);
app.use(courseRouter);
app.use(chatRouter);

mongoose
  .connect(URL ? URL : "")
  .then(async () => {
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


    server.listen(PORT, () =>
      console.log(`Server is running on port http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error(err);
  });
