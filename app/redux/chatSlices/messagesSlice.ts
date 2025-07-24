
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessagesState, IMessage } from "../../client/types/types";


const initialState: MessagesState = {
    messages: [],
  };

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
      // Completely replace all messages
      setMessages(state, action: PayloadAction<IMessage[]>) {
        state.messages = action.payload;
      },
      
      // Add a single new message
      addMessage(state, action: PayloadAction<IMessage>) {
        state.messages = [...state.messages, action.payload];
      },
      
      // Clear all messages
      clearMessages(state) {
        state.messages = [];
      },
      replaceMessage: (state, action) => {
        const { index, message } = action.payload;
        state.messages[index] = message;
      }
    },
});
export const { setMessages, addMessage, clearMessages,replaceMessage } = messagesSlice.actions;
export default messagesSlice.reducer;