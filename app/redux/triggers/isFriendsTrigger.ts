import { createSlice } from "@reduxjs/toolkit";
import { IsFriendsState } from "@/app/client/types/types";


const initialState: IsFriendsState = {
  isFriends: true,
};

const isFriendsSlice = createSlice({
  name: "isFriends",
  initialState,
  reducers: {
    setIsFriendsTrue: (state) => {
      state.isFriends = true;
    },
    setIsFriendsFalse: (state) => {
      state.isFriends = false;
    },
  },
});

export const { setIsFriendsTrue, setIsFriendsFalse } = isFriendsSlice.actions;
export default isFriendsSlice.reducer;

