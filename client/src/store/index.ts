import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice.ts";
import cartReducer from "./cartSlice.ts";
import assistantReducer from "./assistantSlice.ts"

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        cart: cartReducer,
        assistant: assistantReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch