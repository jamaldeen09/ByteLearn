import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProgressRootState,ProgressState } from "@/app/client/types/types";



const initialState: ProgressState[] = [];

export const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    markCourseCompleted: (state, action: PayloadAction<string>) => {
      const progress = state.find(p => p.course === action.payload);
      if (progress) progress.isCompleted = true;
    },
    setProgress: (state, action: PayloadAction<ProgressState[]>) => {
      return action.payload;
    },
    updateLastVisitedSkill: (
      state,
      action: PayloadAction<{ courseId: string; skillId: string }>
    ) => {
      const { courseId, skillId } = action.payload;
      const existingProgress = state.find((p) => p.course === courseId);

      if (existingProgress) {
        existingProgress.lastVisitedSkill = skillId;
      } else {
        state.push({
          course: courseId,
          lastVisitedSkill: skillId,
          completedSkills: [],
          isCompleted: false
        });
      }
    },
    addCompletedSkill: (
      state,
      action: PayloadAction<{ courseId: string; skillId: string }>
    ) => {
      const { courseId, skillId } = action.payload;
      const existingProgress = state.find((p) => p.course === courseId);

      if (existingProgress) {
        if (!existingProgress.completedSkills.includes(skillId)) {
          existingProgress.completedSkills.push(skillId);
        }
      } else {
        state.push({
          course: courseId,
          lastVisitedSkill: skillId,
          completedSkills: [skillId],
          isCompleted: false,
        });
      }
    },
  },
});


export const { setProgress, updateLastVisitedSkill, addCompletedSkill } =
  progressSlice.actions;


export const selectProgressByCourse = (state: ProgressRootState, courseId: string) =>
  state.progress.find((p) => p.course === courseId);

export default progressSlice.reducer;