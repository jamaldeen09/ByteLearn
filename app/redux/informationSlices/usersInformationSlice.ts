import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserInfoSchema } from './../../client/types/types';

const initialState: UserInfoSchema = {
    email: "",
    fullName: "",
    enrolledCourses: [],
    createdCourses: [],
    friends: [],
    role: "",
    _id: "",
    bio: "",
    avatar: "",
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
            state.enrolledCourses = action.payload.enrolledCourses
            state.createdCourses = action.payload.createdCourses
            state._id = action.payload._id
            state.bio = action.payload.bio
            state.avatar = action.payload.avatar
        },
        getNewAvatar: (state, action: PayloadAction<string>) => {
            state.avatar = action.payload
        }
    }
})

export const { getInformation, getNewAvatar } = usersInformationSlice.actions;
export default usersInformationSlice.reducer;