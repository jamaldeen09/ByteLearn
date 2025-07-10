import { configureStore } from '@reduxjs/toolkit'
import timerResetSlice  from "./triggers/timerResetTrigger"
import userInformaionSlice from "./informationSlices/usersInformationSlice"
import canvasSlice from "./triggers/canvasTriggerSlice"
import courseSlice from "./coursesSlices/courseSlice"
import singleCourseSlice from "./coursesSlices/singleCourseSlice"
import completedSkillsSlice from "./coursesSlices/completedSkillsSlice"
import progressReducer from "./coursesSlices/progressSlice";


export const store = configureStore({
  reducer: {
    timerReset: timerResetSlice,
    usersInformation: userInformaionSlice,
    canvasTrigger: canvasSlice,
    coursesSlice: courseSlice,
    singleCourse: singleCourseSlice,
    completedSkills: completedSkillsSlice,
    progress: progressReducer,
  }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch