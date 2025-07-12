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
        }
    }

})

export const { getFriends } = friendsReducer.actions;
export default friendsReducer.reducer;