import { courseSchema } from "@/app/client/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EnrolledCoursesState {
  enrolledCourses: courseSchema[];
}

const initialState: EnrolledCoursesState = {
  enrolledCourses: []
};

export const enrolledCoursesSlice = createSlice({
  name: "enrolledCourses",
  initialState,
  reducers: {
    setEnrolledCourses: (state, action: PayloadAction<courseSchema[]>) => {
      state.enrolledCourses = action.payload;
    },
    addEnrolledCourse: (state, action: PayloadAction<courseSchema>) => {
      if (!state.enrolledCourses.some(course => course.id === action.payload.id)) {
        state.enrolledCourses.push(action.payload);
      }
    },
    removeEnrolledCourse: (state, action: PayloadAction<string>) => {
      state.enrolledCourses = state.enrolledCourses.filter(
        course => course.id !== action.payload
      );
    }
  }
});

export const { setEnrolledCourses, addEnrolledCourse, removeEnrolledCourse } = enrolledCoursesSlice.actions;
export default enrolledCoursesSlice.reducer;