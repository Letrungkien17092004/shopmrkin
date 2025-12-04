import { Variant } from "../product/index.ts"
import { Media } from "../media/index.ts"

export interface CartItem {
    id: string
    cartId: string
    variantId: string
    quantity: number
    variant: Omit<Variant, "user" | "userId">
    productName: string
    media: Media
}