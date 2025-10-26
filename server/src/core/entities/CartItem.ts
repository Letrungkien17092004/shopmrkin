import { Variant } from "./index.js"

type CartItemConstructorParam = {
    id: string
    cartId: string
    variantId: string
    quantity: number
    variant?: Variant
}

export default class CartItem {
    id: string
    cartId: string
    variantId: string
    quantity: number
    variant?: Variant

    constructor(options: CartItemConstructorParam) {
        this.id = options.id
        this.cartId = options.cartId
        this.variantId = options.variantId
        this.quantity = options.quantity
        this.variant = options.variant
    }
}
