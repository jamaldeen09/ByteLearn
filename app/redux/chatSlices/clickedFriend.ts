import { ClickedFriendState, InformationSchema } from "@/app/client/types/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: ClickedFriendState = {
    id: "",
    information: null
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
        }
    }
})

export const { getClickedFriendInformation, getClickedFriendId } = clickedFriendReducer.actions;
export default clickedFriendReducer.reducer;