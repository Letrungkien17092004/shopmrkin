import User from "./User.js"
import CartItem from "./CartItem.js"

type CartConstructorParam = {
    id: string
    userId: string
    user?: User
    cartItems?: CartItem[]
    createdAt?: Date
    updatedAt?: Date
}

export default class Cart {
    id: string
    userId: string
    user?: User
    cartItems?: CartItem[]

    createdAt?: Date
    updatedAt?: Date

    constructor(options: CartConstructorParam) {
        this.id = options.id
        this.userId = options.userId
        this.user = options.user
        this.cartItems = options.cartItems
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
    }
}
