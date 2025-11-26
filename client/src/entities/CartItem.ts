import { Variant } from "./index.ts"

interface CartItemConstructParam {
    id: string
    cartId: string
    variantId: string
    quantity: number
    variant: Variant
    productName: String
}

export class CartItem {
    id: string
    cartId: string
    variantId: string
    quantity: number
    variant: Variant
    productName: String

    constructor(options: CartItemConstructParam) {
        this.id = options.id
        this.cartId = options.cartId
        this.variantId = options.variantId
        this.quantity = options.quantity
        this.variant = options.variant
        this.productName = options.productName
    }

    /**
     * Get price of the variant
     * @returns 
     */
    getPrice() {
        return this.variant.price
    }


    /**
     * Get the price after multiplying by quantity
     */
    getTotalPrice() {
        return this.variant.price * this.quantity
    }
}