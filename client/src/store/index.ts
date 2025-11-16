import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice.ts";
import cartReducer from "./cartSlice.ts";


export const store = configureStore({
    reducer: {
        counter: counterReducer,
        cart: cartReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch