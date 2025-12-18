import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AssistantChat, AssistantMessage } from "../types/chat/index.ts"
import AssistantService from "../services/AssistantService.ts";

const assistantService = new AssistantService()
interface AssistantState {
    assistantChat?: AssistantChat,
    assistantMessages?: AssistantMessage[]
    create_status: "idle" | "loading" | "succeeded" | "failed"
    send_status: "idle" | "loading" | "succeeded" | "failed",
    error?: string
}

const initialState: AssistantState = {
    assistantChat: undefined,
    assistantMessages: undefined,
    create_status: "idle",
    send_status: "idle",
    error: undefined
}

export const createChat = createAsyncThunk<
    AssistantChat,
    void,
    { rejectValue: string }
>(
    "assistant/createChat",
    async (_, thunkApi) => {
        try {
            const createdChat = await assistantService.startNewChat()
            console.log("log in assistant slice")
            console.log("create chat ok")
            return createdChat
        } catch (error) {
            return thunkApi.rejectWithValue("createChat error")
        }
    }
)

export const sendMessage = createAsyncThunk<
    {
        userMessage: AssistantMessage,
        assistantResponse: AssistantMessage
    },
    { message: string, chatId: string },
    { rejectValue: string }
>(
    "assistant/sendMessage",
    async ({ message, chatId }, thunkApi) => {
        try {
            const responseMessage = await assistantService.sendMessage({
                message: message,
                chatId: chatId
            })
            console.log("log in assistant slice")
            console.log("send message ok")
            return {
                userMessage: {
                    role: "user",
                    message: message,
                    recommend_products: []
                },
                assistantResponse: {
                    role: "assistant",
                    message: responseMessage.message,
                    recommend_products: responseMessage.recommend_products
                }
            }
        } catch (error) {
            return thunkApi.rejectWithValue("sendMessage error")
        }
    }
)

const assistantSlice = createSlice({
    name: "assistant",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            //  create chat
            .addCase(createChat.pending, (state) => {
                state.create_status = "loading"
            })
            .addCase(createChat.fulfilled, (state, action: PayloadAction<AssistantChat>) => {
                state.create_status = "succeeded"
                state.assistantChat = action.payload
                state.assistantMessages = []
            })
            .addCase(createChat.rejected, (state, action) => {
                state.create_status = "failed"
                state.error = action.error.message || "createChat error"
            })

            // send message
            .addCase(sendMessage.pending, (state) => {
                state.send_status = "loading"
            })
            .addCase(sendMessage.fulfilled, (state, action: PayloadAction<{
                userMessage: AssistantMessage,
                assistantResponse: AssistantMessage
            }>) => {
                state.send_status = "succeeded"
                // push new message
                if (state.assistantMessages) {
                    state.assistantMessages = [
                        ...state.assistantMessages,
                        action.payload.userMessage,
                        action.payload.assistantResponse,
                    ]
                } else {
                    state.assistantMessages = [
                        action.payload.userMessage,
                        action.payload.assistantResponse
                    ]
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.send_status = "failed"
                state.error = action.error.message || "createChat error"
            })
    }

})

export default assistantSlice.reducer