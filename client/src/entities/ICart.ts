import { ICartItem } from "./index.ts"

export interface ICart {
    id: string
    userId: string
    items: ICartItem[]
}