import { Order, Variant } from "./index.js"

interface OrderItemConstructor {
    id: string
    orderId: string
    variantId: string
    quantity: number
    unitPrice: number

    order?: Order
    variant?: Variant
}

export default class OrderItem {
    id: string
    orderId: string
    variantId: string
    quantity: number
    unitPrice: number

    order?: Order
    variant?: Variant

    constructor(options: OrderItemConstructor) {
        this.id = options.id
        this.orderId = options.orderId
        this.variantId = options.variantId
        this.quantity = options.quantity
        this.unitPrice = options.unitPrice

        this.order = options.order
        this.variant = options.variant
    }
}