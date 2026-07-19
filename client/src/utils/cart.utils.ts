import { Cart, CartItem } from "../types/cart/index.ts"

export function getCartItemByVariantId(cart: Cart, variantId: string): CartItem | null {
    const items = cart.items

    for (let i = 0; i < items.length; i++) {
        let item = items[i]!
        if (item.variantId === variantId) {
            return { ...item }
        }
    }
    return null
}
