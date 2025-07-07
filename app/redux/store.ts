import { configureStore } from '@reduxjs/toolkit'
import timerResetSlice  from "./triggers/timerResetTrigger"
import userInformaionSlice from "./informationSlices/usersInformationSlice"
import canvasSlice from "./triggers/canvasTriggerSlice"


export const store = configureStore({
  reducer: {
    timerReset: timerResetSlice,
    usersInformation: userInformaionSlice,
    canvasTrigger: canvasSlice
  }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch