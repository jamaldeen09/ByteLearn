import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LikedStateSchema = {
  likedMap: { [courseId: string]: boolean };
};

const initialState: LikedStateSchema = {
  likedMap: {},
};

const isLikedReducer = createSlice({
  name: "likedState",
  initialState,
  reducers: {
    changeState: (
      state,
      action: PayloadAction<{ courseId: string; isLiked: boolean }>
    ) => {
      state.likedMap[action.payload.courseId] = action.payload.isLiked;
    },
  },
});

export const { changeState } = isLikedReducer.actions;
export default isLikedReducer.reducer;
