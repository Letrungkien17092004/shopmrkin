import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import CartService from "../services/CartService.ts";

const cartService = new CartService()
// Minimal types to represent cart and items returned by API
export type CartItem = {
    id: string;
    cartId?: string;
    variantId?: string;
    quantity: number;
    // optional product fields if backend returns embedded product info
    productId?: string;
    productName?: string;
    productImage?: string;
    price?: number;
}

export type Cart = {
    id: string;
    userId?: string;
    items?: CartItem[];
}

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

export const fetchCart = createAsyncThunk("cart/fetchCart", async (cartId: string, thunkAPI) => {
    try {
        const result = await cartService.getCart(cartId, true);
        // backend returns { cart: ... }
        return result.cart as Cart;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err?.message || "Failed to fetch cart");
    }
});

export const addCartItem = createAsyncThunk(
    "cart/addItem",
    async ({ cartId, variantId, quantity }: { cartId: string; variantId: string; quantity: number }, thunkAPI) => {
        try {
            await cartService.addItem(cartId, variantId, quantity);
            // refresh cart
            const action = await thunkAPI.dispatch(fetchCart(cartId));
            return action.payload as Cart;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err?.message || "Failed to add item");
        }
    }
);

export const updateCartItem = createAsyncThunk(
    "cart/updateItem",
    async ({ cartId, cartItemId, quantity }: { cartId: string; cartItemId: string; quantity: number }, thunkAPI) => {
        try {
            await cartService.updateItem(cartId, cartItemId, quantity);
            const action = await thunkAPI.dispatch(fetchCart(cartId));
            return action.payload as Cart;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err?.message || "Failed to update item");
        }
    }
);

export const removeCartItem = createAsyncThunk(
    "cart/removeItem",
    async ({ cartId, cartItemId }: { cartId: string; cartItemId: string }, thunkAPI) => {
        try {
            await cartService.removeItem(cartId, cartItemId);
            const action = await thunkAPI.dispatch(fetchCart(cartId));
            return action.payload as Cart;
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
                state.error = (action.payload as string) || action.error.message || "Failed to fetch cart";
            })

            .addCase(addCartItem.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(addCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.status = "succeeded";
                state.cart = action.payload;
            })
            .addCase(addCartItem.rejected, (state, action) => {
                state.status = "failed";
                state.error = (action.payload as string) || action.error.message || "Failed to add item";
            })

            .addCase(updateCartItem.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.status = "succeeded";
                state.cart = action.payload;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.status = "failed";
                state.error = (action.payload as string) || action.error.message || "Failed to update item";
            })

            .addCase(removeCartItem.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(removeCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.status = "succeeded";
                state.cart = action.payload;
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.status = "failed";
                state.error = (action.payload as string) || action.error.message || "Failed to remove item";
            });
    }
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCart = (state: any) => state.cart.cart as Cart | null;
export const selectCartItems = (state: any) => state.cart.cart?.items ?? [];
