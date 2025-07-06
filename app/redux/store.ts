import { configureStore } from '@reduxjs/toolkit'
import timerResetSlice  from "./triggers/timerResetTrigger"
import userInformaionSlice from "./informationSlices/usersInformationSlice"



export const store = configureStore({
  reducer: {
    timerReset: timerResetSlice,
    usersInformation: userInformaionSlice
  }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch