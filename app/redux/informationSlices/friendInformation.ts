import { FriendSchema } from './../../client/types/types';
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ReduxFriendsSliceSchema } from "@/app/client/types/types";

const initialState: ReduxFriendsSliceSchema = {
    friends: []
}

const friendsReducer = createSlice({
    initialState,
    name: "friendsContainer",
    reducers: {
        getFriends: (state, action: PayloadAction<FriendSchema[]>) => {
            state.friends = action.payload
        },
        removeFriend: (state, action: PayloadAction<string>) => {
            state.friends = state.friends.filter((friend) => friend._id !== action.payload)
        }
    }

})

export const { getFriends, removeFriend } = friendsReducer.actions;
export default friendsReducer.reducer;