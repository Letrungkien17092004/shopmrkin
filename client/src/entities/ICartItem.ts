import { Variant } from "./index.ts"

export interface ICartItem {
    id: string
    cartId: string
    variantId: string
    quantity: number
    variant: {
        id: string
        name: string
        sku: string
        productId: string
        userId: string
        price: number
        stock: number

        user?: {
            username: string
            role?: string
        }

        createdAt?: Date
        updatedAt?: Date
    }
    productName: string
}