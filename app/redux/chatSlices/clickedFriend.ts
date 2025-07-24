import { ClickedFriendState, InformationSchema } from "@/app/client/types/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: ClickedFriendState = {
    id: "",
    information: { _id: "", fullName: "", avatar: "",  isOnline: false, bio: "", }
}

const clickedFriendReducer = createSlice({
    initialState,
    name: "clickedFriend",
    reducers: {
        getClickedFriendInformation: (state, action: PayloadAction<InformationSchema>) => {
            state.information = action.payload.information
        },
        getClickedFriendId: (state, action: PayloadAction<string>) => {
            state.id = action.payload
        },
        resetClickedFriend: (state) => {
            state.id = "";
            state.information = {
                _id: "",
                fullName: "", 
                avatar: "",  
                isOnline: false, 
                bio: "",
            };
        },
    }
})

export const { getClickedFriendInformation, getClickedFriendId, resetClickedFriend } = clickedFriendReducer.actions;
export default clickedFriendReducer.reducer;