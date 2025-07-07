import { createSlice } from "@reduxjs/toolkit";
import { CanvasSchema } from "@/app/client/types/types";


const initialState: CanvasSchema = {
    canvas: false
}

const canvasSlice = createSlice({
    initialState,
    name: "canvasTrigger", 
    reducers: {
        triggerCanvas: (state) => {
            state.canvas = true
        },
        untriggerCanvas: (state) => {
            state.canvas = false
        }
    }
})

export const { triggerCanvas, untriggerCanvas } = canvasSlice.actions;
export default canvasSlice.reducer;