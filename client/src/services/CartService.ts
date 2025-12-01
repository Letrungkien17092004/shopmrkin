import axios from "axios";
import { ENV } from "../config/ENV.ts";
import AuthService from "./AuthService.ts";
import { ICart, ICartItem, Variant } from "../entities/index.ts"
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
    baseUrl = `${ENV.BACK_END_HOST}/api/carts`;

    /**
     * Retrieves a cart from server by cartId
     * @param cartId 
     * @returns 
     */
    async getCart(cartId: string): Promise<ICart> {
        if (auth.accessIsExpired()) {
            await auth.refeshAccess()
        }
        const token = auth.getAccessToken();
        const response = await axios.get<GetCartResponse>(`${this.baseUrl}/${cartId}?include[user]=true&include[cartItem]=true`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const cartResponse = response.data.cart
        const cartItems: ICartItem[] = cartResponse.cartItems.map((ci) => {
            const variant = {
                id: ci.variantId,
                name: ci.variant_name,
                sku: ci.variant_sku,
                productId: ci.product_id,
                userId: "",
                price: ci.variant_price,
                stock: ci.variant_stock,
            }

            return {
                id: ci.id,
                cartId: cartResponse.id,
                variantId: ci.variantId,
                quantity: ci.quantity,
                variant: variant,
                productName: ci.product_name
            }
        })
        return {
            id: cartResponse.id,
            userId: cartResponse.userId,
            items: cartItems
        };
    }

    /**
     * Add a item into cart by cart's id
     * @param cartId 
     * @param variantId 
     * @param quantity 
     */
    async addItem(cartId: string, variantId: string, quantity: number) {
        try {
            if (auth.accessIsExpired()) {
                await auth.refeshAccess()
            }
            const token = auth.getAccessToken()
            const response = await axios.post<{ message: string }>(
                `${this.baseUrl}/${cartId}/items`,
                {
                    variantId: variantId,
                    quantity: quantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            console.log("CartService.addItem response\n", response)
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Update a item in a cart by cart's id and cartItemId
     * @param cartId 
     * @param cartItemId 
     * @param quantity 
     */
    async updateItem(cartId: string, cartItemId: string, quantity: number) {
        try {
            if (auth.accessIsExpired()) {
                await auth.refeshAccess()
            }
            const token = auth.getAccessToken()
            const response = await axios.put<{ message: string }>(
                `${this.baseUrl}/${cartId}/items/${cartItemId}`,
                {
                    quantity: quantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            console.log("CartService.updateItem response\n", response)
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Delete an item in a cart by cart's id and cartItemId
     * @param cartId
     * @param variantId
     */
    async removeItem(cartId: string, cartItemId: string) {
        try {
            if (auth.accessIsExpired()) {
                await auth.refeshAccess()
            }
            const token = auth.getAccessToken()
            const response = await axios.delete<{ message: string }>(
                `${this.baseUrl}/${cartId}/items/${cartItemId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            console.log("CartService.removeItem response\n", response)
        } catch (error) {
            console.log(error)
        }
    }
}
