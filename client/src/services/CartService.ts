import axios from "axios";
import { ENV } from "../config/ENV.ts";
import AuthService from "./AuthService.ts";

const auth = new AuthService();

export default class CartService {
    baseUrl = `${ENV.BACK_END_HOST}/api`;

    async getCart(cartId: string, includeItems = true) {
        const token = auth.getAccessToken();
        // const params = includeItems ? { include: { cartItem: "true" } } : undefined;
        const response = await axios.get(`${this.baseUrl}/cart/${cartId}`, {
            headers: { Authorization: `Bearer ${token}` },
            // params,
        });
        return response.data;
    }

    async addItem(cartId: string, variantId: string, quantity: number) {
        const token = auth.getAccessToken();
        const response = await axios.post(
            `${this.baseUrl}/cart/${cartId}/item`,
            { variantId, quantity },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }

    async updateItem(cartId: string, cartItemId: string, quantity: number) {
        const token = auth.getAccessToken();
        const response = await axios.put(
            `${this.baseUrl}/cart/${cartId}/item/${cartItemId}`,
            { quantity },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }

    async removeItem(cartId: string, cartItemId: string) {
        const token = auth.getAccessToken();
        const response = await axios.delete(
            `${this.baseUrl}/cart/${cartId}/item/${cartItemId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }
}
