import { User, Order } from "./index.js"

interface PaymentConstructor {
    id: string
    transactionId: string
    amount: number
    orderId: string
    userId: string
    createdAt?: Date
    user?: User
    order?: Order
}

export default class Payment {
    id: string
    transactionId: string
    amount: number
    orderId: string
    userId: string
    createdAt?: Date
    user?: User
    order?: Order

    constructor(options: PaymentConstructor) {
        this.id = options.id
        this.transactionId = options.transactionId
        this.amount = options.amount
        this.orderId = options.orderId
        this.userId = options.userId
        
        this.createdAt = options.createdAt
        this.user = options.user
        this.order = options.order
    }
}