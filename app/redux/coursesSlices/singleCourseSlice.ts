import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { singleCourseSchema } from "@/app/client/types/types";

const initialState: singleCourseSchema = {
    _id: "",
    title: "",
    topics: [],
    description: "",
    category: "",
    imageUrl: "",
    dateCreated: new Date().toISOString(),
    creator: {
        fullName: "",
        email: "",
        profilePicture: ""
    },
    isPublished: false
}

const singleCourseSlice = createSlice({
    initialState,
    name: "singleCourse",
    reducers: {
        getSingleCourse: (state, action: PayloadAction<singleCourseSchema>) => {
            state._id = action.payload._id;
            state.title = action.payload.title;
            state.topics = action.payload.topics;
            state.description = action.payload.description;
            state.category = action.payload.category;
            state.imageUrl = action.payload.imageUrl;
            state.dateCreated = action.payload.dateCreated;
            state.creator = action.payload.creator;
            state.isPublished = action.payload.isPublished;
        }
    }
})

export const { getSingleCourse } = singleCourseSlice.actions;
export default singleCourseSlice.reducer;