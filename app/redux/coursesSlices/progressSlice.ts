// progressSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ProgressRootState,
  ProgressState,
  CourseBase,
} from "@/app/client/types/types";

const initialState: ProgressState[] = [];

export const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    markCourseCompleted: (state, action: PayloadAction<string>) => {
      const progress = state.find((p) => p.course === action.payload);
      if (progress) progress.isCompleted = true;
    },
    setProgress: (state, action: PayloadAction<ProgressState[]>) => {
      return action.payload;
    },
    updateLastVisitedSkill: (
      state,
      action: PayloadAction<{
        courseId: string;
        skillId: string;
        snapshottedCourse?: CourseBase;
      }>
    ) => {
      const { courseId, skillId, snapshottedCourse } = action.payload;
      const existingProgress = state.find((p) => p.course === courseId);

      if (existingProgress) {
        existingProgress.lastVisitedSkill = skillId;
        if (snapshottedCourse) {
          existingProgress.snapshottedCourse = snapshottedCourse;
        }
      } else {
        state.push({
          course: courseId,
          lastVisitedSkill: skillId,
          completedSkills: [],
          isCompleted: false,
          snapshottedCourse,
        });
      }
    },
    addCompletedSkill: (
      state,
      action: PayloadAction<{
        courseId: string;
        skillId: string;
        snapshottedCourse?: CourseBase;
      }>
    ) => {
      const { courseId, skillId, snapshottedCourse } = action.payload;
      const existingProgress = state.find((p) => p.course === courseId);

      if (existingProgress) {
        if (!existingProgress.completedSkills.includes(skillId)) {
          existingProgress.completedSkills.push(skillId);
        }
        if (snapshottedCourse) {
          existingProgress.snapshottedCourse = snapshottedCourse;
        }
      } else {
        state.push({
          course: courseId,
          lastVisitedSkill: skillId,
          completedSkills: [skillId],
          isCompleted: false,
          snapshottedCourse,
        });
      }
    },
    updateSnapshottedCourse: (
      state,
      action: PayloadAction<{ courseId: string; snapshottedCourse: CourseBase }>
    ) => {
      const { courseId, snapshottedCourse } = action.payload;
      const existingProgress = state.find((p) => p.course === courseId);

      if (existingProgress) {
        existingProgress.snapshottedCourse = snapshottedCourse;
      }
    },

  },
});

export const {
  setProgress,
  updateLastVisitedSkill,
  addCompletedSkill,
  updateSnapshottedCourse,
} = progressSlice.actions;

export const selectProgressByCourse = (
  state: ProgressRootState,
  courseId: string
) => state.progress.find((p) => p.course === courseId);

export default progressSlice.reducer;
