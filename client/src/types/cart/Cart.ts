import { CartItem } from "./index.ts"

export interface Cart {
    id: string
    userId: string
    items: CartItem[]
}