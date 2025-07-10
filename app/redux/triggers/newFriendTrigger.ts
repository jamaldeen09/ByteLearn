import { NewFriendTrigger } from "@/app/client/types/types";
import { createSlice } from "@reduxjs/toolkit";


const initialState: NewFriendTrigger = {
    triggerNewFriend: false
}

const newFriendsSlice = createSlice({
    initialState,
    name: "newFriendTrigger",
    reducers: {
        newFriend: (state) => {
            state.triggerNewFriend = true
        },
        untriggerNewFriend: (state) => {
            state.triggerNewFriend = false
        }
    }
})

export const { newFriend, untriggerNewFriend } = newFriendsSlice.actions;
export default newFriendsSlice.reducer;