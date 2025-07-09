import mongoose from "mongoose"

const progressSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, required: true , ref: "User" },
    course: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Course" },
    completedSkills: [
        { type: mongoose.Schema.Types.ObjectId, required: true },
    ]
})

export default mongoose.model("Progress", progressSchema)

