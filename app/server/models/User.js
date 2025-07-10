import mongoose from "mongoose"


const notificationSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, required: true },
    dateSent: { type: Date, default: Date.now() },
    content: { type: String, required: true },
    read: { type: Boolean, default: false }
})
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: String,
    googleId: { type: String }, 
    avatar: { type: String, default: "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg" },
    role: {
        type: String,
        required: true,
        enum: ["student", "instructor"],
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    }],
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        default: [],
    }],
    isOnline: {
        type: Boolean,
        default: false
    },
    generatedOtp: {
        type: String,
        default: null,
    },
    bio: {
        type: String,
        default: "Hello Bytelearn!"
    },
    notifications: [ notificationSchema ]
})

export default mongoose.model("User", userSchema)