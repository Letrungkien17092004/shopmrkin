import { Variant } from "./index.ts"

export interface CartItem {
    id: string
    cartId: string
    variantId: string
    quantity: number
    variant: {
        id: string
        name: string
        sku: string
        productId: string
        price: number
        stock: number
    }
    productName: string
    media: {
        filePath: string,
        hostname: string,
        type: string
    }
}