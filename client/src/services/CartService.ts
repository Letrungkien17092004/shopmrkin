import axios from "axios";
import { ENV } from "../config/ENV.ts";
import AuthService from "./AuthService.ts";
import { Cart, CartItem, Variant } from "../entities/index.ts"
const auth = new AuthService();
interface GetCartResponse {
    cart: {
        id: string,
        userId: string,
        cartItems: {
            id: string,
            variantId: string,
            quantity: number,
            variant_name: string,
            variant_sku: string,
            variant_price: number,
            variant_stock: number,
            product_id: string,
            product_name: string,
            product_description: string,
        }[],
        createdAt: Date,
        updatedAt: Date
    }
}
export default class CartService {
    baseUrl = `${ENV.BACK_END_HOST}/api`;

    async getCart(cartId: string) {
        const token = auth.getAccessToken();
        const response = await axios.get<GetCartResponse>(`${this.baseUrl}/cart/${cartId}?include[user]=true&include[cartItem]=true`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const cartResponse = response.data.cart
        const cartItems: CartItem[] = cartResponse.cartItems.map((ci) => {
            const variant = new Variant({
                id: ci.variantId,
                name: ci.variant_name,
                sku: ci.variant_sku,
                productId: ci.product_id,
                userId: "",
                price: ci.variant_price,
                stock: ci.variant_stock,
            })

            return new CartItem({
                id: ci.id,
                cartId: cartResponse.id,
                variantId: ci.variantId,
                quantity: ci.quantity,
                variant: variant,
                productName: ci.product_name
            })
        })
        return new Cart({
            id: cartResponse.id,
            userId: cartResponse.userId,
            items: cartItems
        });
    }

    async addItem(cartId: string, variantId: string, quantity: number) {
        throw new Error("NO CODE")
    }

    async updateItem(cartId: string, cartItemId: string, quantity: number) {
        throw new Error("NO CODE")
    }

    async removeItem(cartId: string, cartItemId: string) {
        throw new Error("NO CODE")
    }
}
