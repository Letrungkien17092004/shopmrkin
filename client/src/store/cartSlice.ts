import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import CartService from "../services/CartService.ts";
import { Cart } from "../entities/index.ts"
import axios from "axios";
const cartService = new CartService()

type CartState = {
    cart: Cart | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: CartState = {
    cart: null,
    status: "idle",
    error: null,
};

export const fetchCart = createAsyncThunk<
    Cart,
    string,
    { rejectValue: string }
>("cart/fetchCart", async (cartId: string, thunkAPI) => {
    try {
        const cart = await cartService.getCart(cartId);
        return cart
    } catch (err: any) {
        return thunkAPI.rejectWithValue("Failed to fetch cart");
    }
});

export const addCartItem = createAsyncThunk<
    void,
    { cartId: string; variantId: string; quantity: number },
    { rejectValue: string }
>(
    "cart/addItem",
    async ({ cartId, variantId, quantity }, thunkAPI) => {
        try {
            await cartService.addItem(cartId, variantId, quantity);
            // refesh cart
            const cart = await thunkAPI.dispatch(fetchCart(cartId)).unwrap();
        } catch (err: any) {
            return thunkAPI.rejectWithValue("Failed to add item");
        }
    }
);

export const updateCartItem = createAsyncThunk<
    void,
    { cartId: string; cartItemId: string; quantity: number },
    { rejectValue: string }
>(
    "cart/updateItem",
    async ({ cartId, cartItemId, quantity }, thunkAPI) => {
        try {
            await cartService.updateItem(cartId, cartItemId, quantity);
            // refesh cart
            const cart = await thunkAPI.dispatch(fetchCart(cartId)).unwrap();
        } catch (err: any) {
            return thunkAPI.rejectWithValue("Failed to update item");
        }
    }
);

export const removeCartItem = createAsyncThunk<
    void,
    { cartId: string; cartItemId: string },
    { rejectValue: string }
>(
    "cart/removeItem",
    async ({ cartId, cartItemId }, thunkAPI) => {
        try {
            await cartService.removeItem(cartId, cartItemId);
            // refesh cart
            const cart = await thunkAPI.dispatch(fetchCart(cartId)).unwrap();
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err?.message || "Failed to remove item");
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCartState(state) {
            state.cart = null;
            state.status = "idle";
            state.error = null;
        }
    },
    extraReducers(builder) {
        builder
            // fetchCart
            .addCase(fetchCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.status = "succeeded";
                state.cart = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || null;
            })

            // addCartItem
            .addCase(addCartItem.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(addCartItem.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(addCartItem.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || null;
            })

            // updateCartItem
            .addCase(updateCartItem.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || null;
            })

            // removeCartItem
            .addCase(removeCartItem.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(removeCartItem.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || null;
            });
    }
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCart = (state: any) => state.cart.cart as Cart | null;
export const selectCartItems = (state: any) => state.cart.cart?.items ?? [];
