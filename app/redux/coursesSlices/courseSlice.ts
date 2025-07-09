import { coursesContainer } from './../../client/types/types';
import { courseSchema } from "@/app/client/types/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";



const initialState: coursesContainer<courseSchema> = {
    courses: []
}

const courseSlice = createSlice({
    initialState,
    name: "coursesSlice",
    reducers: {
        getCourses: (state, action: PayloadAction<courseSchema[]>) => {
            state.courses = action.payload
        }
    }
})

export const { getCourses } = courseSlice.actions;
export default courseSlice.reducer;