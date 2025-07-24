import { IMessage } from "@/app/client/types/types";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

export type GroupSchema = {
    _id: string,
    roomId: string,
    participants: {
        _id: string,
        fullName: string,
        avatar: string,
        bio: string,
    }[],
    groupName: string,
    createdAt: Date,
    isGroup: boolean,
    groupImageUrl: string,
    messages: IMessage[],
    activateGroup: (id: string) => string
}

const initialState: { groups: GroupSchema[], singleGroup: GroupSchema | null } = {
    groups: [],
    singleGroup: null
}

const groupSlice = createSlice({
    initialState,
    name: "groupsContainer",
    reducers: {
        getGroupData: (state, action: PayloadAction<GroupSchema[]>) => {
            state.groups = action.payload;
        },
        getSingleGroupData: (state, action: PayloadAction<GroupSchema>) => {
            state.singleGroup = action.payload
        }
    }
})

export const { getGroupData } = groupSlice.actions;
export default groupSlice.reducer
