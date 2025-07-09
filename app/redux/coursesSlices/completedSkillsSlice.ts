
import { CompletedSkillsSchema, SkillsSchema } from "@/app/client/types/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: CompletedSkillsSchema<SkillsSchema> = {
    completedSkills: []
}

const completedSkillsSlice = createSlice({
    initialState,
    name: "completedSkills",
    reducers: {
        getCompletedSkills: (state, action: PayloadAction<SkillsSchema[]>) => {
            state.completedSkills = action.payload
        }
    }
})

export const { getCompletedSkills } = completedSkillsSlice.actions;
export default completedSkillsSlice.reducer;