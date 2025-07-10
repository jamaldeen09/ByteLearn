import { NewGroupTrigger } from "@/app/client/types/types";
import { createSlice } from "@reduxjs/toolkit";


const initialState: NewGroupTrigger = {
    triggerNewGroup: false
}

const newGroupSlice = createSlice({
    initialState,
    name: "newGroupTrigger",
    reducers: {
        newGroupTrigger: (state) => {
            state.triggerNewGroup = true
        },
        untriggerNewGroup: (state) => {
            state.triggerNewGroup = false
        }
    }
})

export const { newGroupTrigger, untriggerNewGroup } = newGroupSlice.actions;
export default newGroupSlice.reducer;