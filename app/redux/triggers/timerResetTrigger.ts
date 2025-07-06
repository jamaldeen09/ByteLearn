import { createSlice } from "@reduxjs/toolkit";
import { TimerResetSchema } from "@/app/client/types/types";

const initialState: TimerResetSchema = {
    resetTime: false
}


const timerResetSlice = createSlice({
    initialState,
    name: "timerReset",
    reducers: {
        activateTimeReset: (state) => {
            state.resetTime = !state.resetTime
        },
        deactivateTimeReset: (state) => {
            state.resetTime = false
        }
    }
})

export const { activateTimeReset, deactivateTimeReset } = timerResetSlice.actions;
export default timerResetSlice.reducer
