import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { PreviewImageTriggerSchema } from "@/app/client/types/types";

const initialState: PreviewImageTriggerSchema = {
    clickedImageId: "",
    activatePreview: false,
}

const imagePreviewReducer = createSlice({
    initialState,
    name: "imagePreview",
    reducers: {
        getImageId: (state, action: PayloadAction<string>) => {
            state.clickedImageId = action.payload
        },

        activatePreview: (state) => {
            state.activatePreview = true
        },

        deactivatePreview: (state) => {
            state.activatePreview = false
        }
    }
})

export const { getImageId, activatePreview, deactivatePreview } = imagePreviewReducer.actions;
export default imagePreviewReducer.reducer;