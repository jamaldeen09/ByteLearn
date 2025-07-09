import mongoose from "mongoose";
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import User from "../models/User.js";

export const fetchCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate({
      path: "creator",
      model: "User",
    });

    const formattedCourses = courses.map((course) => {
      return {
        id: course._id,
        title: course.title,
        description: course.description,
        creator: {
          fullName: course.creator.fullName,
          email: course.creator.email,
          profilePicture: course.creator.avatar,
        },
        topics: course.topics,
        imageUrl: course.imageUrl,
        category: course.category,
      };
    });

    return res.status(200).send({ courses: formattedCourses });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, msg: "Server error" });
  }
};

export const enrollToACourse = async (req, res) => {
  try {
    // expecting studentId, courseId,
    const { courseId } = req.data;
    const student = req.user.userId;

    // check if student requesting to enroll exists

    const enrollingStudent = await User.findById(student);
    if (!enrollingStudent)
      return res
        .status(406)
        .send({ success: false, msg: "Your Account was not found" });

    const courseToEnrollIn = await Course.findById(courseId);

    const alreadyEnrolled = await Progress.findOne({
      student,
      course: courseToEnrollIn._id,
    });
    if (alreadyEnrolled) {
      return res.status(409).send({
        success: false,
        msg: "You are already enrolled in this course.",
      });
    }
    if (!courseToEnrollIn)
      return res.status(404).send({
        success: false,
        msg: "Course you are trying to enroll in does not exist",
      });

    const newProgress = await Progress.create({
      student,
      course: courseToEnrollIn._id,
    });
    if (!enrollingStudent.courses.includes(courseToEnrollIn._id)) {
      enrollingStudent.courses.push(courseToEnrollIn._id);
    }

    await enrollingStudent.save();
    return res.status(200).send({
      success: true,
      msg: `Successfuly enrolled in ${courseToEnrollIn.title}`,
      progress: newProgress,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, msg: "Server error" });
  }
};

export const getSingleCourseDetails = async (req, res) => {
  try {
    if (!req.user.userId)
      return res.status(401).send({ success: false, msg: "Unauthorized Access" })
    const  { id } = req.data;

    // check for exsisting course
    const requestedCourse = await Course.findById(id).populate({ path: "creator", model: "User" })
    const data = {
      title: requestedCourse.title,
      _id: requestedCourse._id,
      creator: {
         fullName: requestedCourse.creator.fullName,
         email: requestedCourse.creator.email,
         profilePicture: requestedCourse.creator.avatar
      },
      imageUrl: requestedCourse.imageUrl,
      topics: requestedCourse.topics,
      dateCreated: requestedCourse.dateCreated,
      isPublished: requestedCourse.isPublished
    }
    
    if (!requestedCourse) 
      return res.status(404).send({ success: false , msg: "Course does not exsist" })
    
    return res.status(200).send({ success: true, courseDetails: data })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ success: false, msg: "Server error" })
  }
}

export const markSkillAsCompleted = async (req, res) => {
  try {
    if (!req.user.userId) {
      return res.status(401).send({ success: false, msg: "Unauthorized Access" });
    }
 
    const { courseId, skillId } = req.data;
    // Find progress document
    const progress = await Progress.findOne({ 
      student: req.user.userId,
      course: courseId 
    });
    
    if (!progress) {
      return res.status(404).send({ 
        success: false, 
        msg: "No progress data found for this course" 
      });
    }

    // Verify couse exists in course collection
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send({ 
        success: false, 
        msg: "Course not found" 
      });
    }

    // Check if skill exists in any topic
    const skillExists = course.topics.some(topic => 
      topic.skills.some(skill => skill._id.equals(new mongoose.Types.ObjectId(skillId)))
    );

    if (!skillExists) {
      return res.status(404).send({ 
        success: false, 
        msg: "Skill not found in this course" 
      });
    }

    // Check if already completed
    if (progress.completedSkills.includes(new mongoose.Types.ObjectId(skillId))) {
      return res.status(409).send({ 
        success: false, 
        msg: "Skill already marked as completed" 
      });
    }

    // Mark as completed
    progress.completedSkills.push(new mongoose.Types.ObjectId(skillId));
    await progress.save();

    return res.status(200).send({ 
      success: true, 
      msg: "Skill marked as completed successfully",
      completedSkills: progress.completedSkills
    });
    
  } catch (err) {
    console.error(err);
    return res.status(500).send({ 
      success: false, 
      msg: "Server error while marking skill as completed" 
    });
  }
}