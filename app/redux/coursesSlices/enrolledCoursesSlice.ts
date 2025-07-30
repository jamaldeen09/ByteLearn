import { EnrolledCourse } from "@/app/client/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EnrolledCoursesState {
  enrolledCourses: EnrolledCourse[];
}

const initialState: EnrolledCoursesState = {
  enrolledCourses: []
};

export const enrolledCoursesSlice = createSlice({
  name: "enrolledCourses",
  initialState,
  reducers: {
    setEnrolledCourses: (state, action: PayloadAction<EnrolledCourse[]>) => {
      state.enrolledCourses = action.payload;
    },
    addEnrolledCourse: (state, action: PayloadAction<EnrolledCourse>) => {
      if (!state.enrolledCourses.some(course => course._id === action.payload._id)) {
        state.enrolledCourses.push(action.payload);
      }
    },
    removeEnrolledCourse: (state, action: PayloadAction<string>) => {
      state.enrolledCourses = state.enrolledCourses.filter(
        course => course._id !== action.payload
      );
    }
  }
});

export const { setEnrolledCourses, addEnrolledCourse, removeEnrolledCourse } = enrolledCoursesSlice.actions;
export default enrolledCoursesSlice.reducer;