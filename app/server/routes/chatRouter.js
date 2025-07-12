import express from "express";
import {
  validationMiddleware,
  verifyAccessToken,
} from "../middlewares/auth.js";
import { getFriends, getNotifications } from "../controllers/chatController.js";

export const chatRouter = express.Router();

chatRouter.get("/api/get-friends", verifyAccessToken, getFriends);
chatRouter.get("/api/get-notifications", verifyAccessToken, getNotifications)
