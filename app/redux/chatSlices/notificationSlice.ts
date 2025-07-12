import { NotificationContainer, NotificationSchema } from "@/app/client/types/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"

const initialState: NotificationContainer = {
    notifications: []
}

const notificationReducer = createSlice({
    initialState,
    name: "notificationContainer",
    reducers: {
        getNotifications: (state, action: PayloadAction<NotificationSchema[]>) => {
            state.notifications = action.payload
        }
    }
})

export const { getNotifications } = notificationReducer.actions;
export default notificationReducer.reducer;