import { Auth } from "./index.ts"

export default interface Variant {
    id: string
    name: string
    sku: string
    productId: string
    userId: string
    price: number
    stock: number
    user?: Auth
    createdAt?: Date
    updatedAt?: Date
}