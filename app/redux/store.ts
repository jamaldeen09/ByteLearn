import { configureStore } from '@reduxjs/toolkit'
import timerResetSlice  from "./triggers/timerResetTrigger"
import userInformaionSlice from "./informationSlices/usersInformationSlice"
import canvasSlice from "./triggers/canvasTriggerSlice"
import courseSlice from "./coursesSlices/courseSlice"
import singleCourseSlice from "./coursesSlices/singleCourseSlice"


export const store = configureStore({
  reducer: {
    timerReset: timerResetSlice,
    usersInformation: userInformaionSlice,
    canvasTrigger: canvasSlice,
    coursesSlice: courseSlice,
    singleCourse: singleCourseSlice,
  }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch