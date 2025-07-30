import { CompletedSkillsSchema  } from "@/app/client/types/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type BaseCompletedSkill = {
  _id: string; 
  courseId: string; 
  topicId?: string;
  topicTitle?: string;
  completedAt?: string;  
};

// Then create the enriched type that combines with SkillsSchema
export type EnrichedCompletedSkill = BaseCompletedSkill & {
  skillTitle?: string;  // from SkillsSchema
  content?: string;     // from SkillsSchema
};

// Update your initialState type
const initialState: CompletedSkillsSchema<EnrichedCompletedSkill> = {
  completedSkills: []
};

const completedSkillsSlice = createSlice({
  initialState,
  name: "completedSkills",
  reducers: {
    getCompletedSkills: (state, action: PayloadAction<EnrichedCompletedSkill[]>) => {
      state.completedSkills = action.payload;
    },
    markSkillAsCompleted: (
      state, 
      action: PayloadAction<{
        skillId: string;
        courseId: string;
        topicId?: string;
        topicTitle?: string;
      }>
    ) => {
      const { skillId, courseId, topicId, topicTitle } = action.payload;

      // Check if skill is already marked as completed
      const alreadyExists = state.completedSkills.some(
        (skill) => skill._id === skillId && skill.courseId === courseId
      );

      if (!alreadyExists) {
        state.completedSkills.push({
          _id: skillId,
          courseId,
          ...(topicId && { topicId }),
          ...(topicTitle && { topicTitle }),
          completedAt: new Date().toISOString() 
        });
      }
    },
    unmarkSkillCompleted: (
      state,
      action: PayloadAction<{
        skillId: string;
        courseId: string;
      }>
    ) => {
      const { skillId, courseId } = action.payload;
      state.completedSkills = state.completedSkills.filter(
        (skill) => !(skill._id === skillId && skill.courseId === courseId)
      );
    }
  }
});

export const { 
  getCompletedSkills, 
  markSkillAsCompleted, 
  unmarkSkillCompleted 
} = completedSkillsSlice.actions;

export default completedSkillsSlice.reducer;
