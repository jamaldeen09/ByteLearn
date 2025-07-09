import express from "express";
import {
  enrollToACourse,
  fetchCourses,
  getSingleCourseDetails,
  markSkillAsCompleted,
} from "../controllers/courseController.js";
import {
  validationMiddleware,
  verifyAccessToken,
} from "../middlewares/auth.js";
import { body, param } from "express-validator";

export const courseRouter = express.Router();

courseRouter.get("/api/courses", fetchCourses);
courseRouter.post(
  "/api/enroll",
  verifyAccessToken,
  body("courseId")
    .notEmpty()
    .withMessage("A course id must be provided")
    .isString()
    .withMessage("Course id must be a string")
    .isLength({ min: 1 })
    .withMessage("Invalid course id"),
  validationMiddleware,
  enrollToACourse
);

courseRouter.get(
  "/api/single-course/:id",
  verifyAccessToken,
  param("id")
    .notEmpty()
    .withMessage("An id must provided")
    .isString()
    .withMessage("id must be a string")
    .isLength({ min: 1 })
    .withMessage("ID must be at least 1 character"),
    validationMiddleware,
  getSingleCourseDetails
);

courseRouter.post("/api/mark-skill-as-completed", verifyAccessToken, validationMiddleware,
  body("courseId")
  .notEmpty()
  .withMessage("An courseId must provided")
  .isString()
  .withMessage("courseId must be a string"),
  body("skillId")
  .notEmpty()
  .withMessage("An skillId must provided")
  .isString()
  .withMessage("skillId must be a string"),
  validationMiddleware,
  markSkillAsCompleted
)
