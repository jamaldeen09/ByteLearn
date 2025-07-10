import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserInfoSchema } from './../../client/types/types';

const initialState: UserInfoSchema = {
    email: "",
    fullName: "",
    courses: [],
    friends: [],
    role: "",
    _id: "",
    bio: "",
}

const usersInformationSlice = createSlice({
    initialState,
    name: "usersInformation",
    reducers: {
        getInformation: (state, action: PayloadAction<UserInfoSchema>) => {
            state.email = action.payload.email
            state.fullName = action.payload.fullName
            state.friends = action.payload.friends
            state.role = action.payload.role
            state.courses = action.payload.courses
            state._id = action.payload._id
            state.bio = action.payload.bio
        }
    }
})

export const { getInformation } = usersInformationSlice.actions;
export default usersInformationSlice.reducer;