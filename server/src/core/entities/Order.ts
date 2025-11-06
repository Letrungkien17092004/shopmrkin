import { User, OrderItem, Payment } from "./index.js"

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

interface OrderConstructor {
    id: string
    userId: string
    totalAmount: number
    status: OrderStatus

    user?: User
    orderItems?: OrderItem[]
    payments?: Payment[]
    createdAt?: Date
    updatedAt?: Date
}

export default class Order {
    id: string
    userId: string
    totalAmount: number
    status: OrderStatus

    user?: User
    orderItems?: OrderItem[]
    payments?: Payment[]
    createdAt?: Date
    updatedAt?: Date

    constructor(options: OrderConstructor) {
        this.id = options.id
        this.userId = options.userId
        this.totalAmount = options.totalAmount
        this.status = options.status

        this.user = options.user
        this.orderItems = options.orderItems
        this.payments = options.payments
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
    }
}