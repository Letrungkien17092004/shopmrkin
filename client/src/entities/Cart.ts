import { CartItem } from "./index.ts"

interface CartConstructorParam {
    id: string
    userId: string
    items: CartItem[]
}

export class Cart {
    id: string
    userId: string
    items: CartItem[]

    constructor(options: CartConstructorParam) {
        this.id = options.id
        this.userId = options.userId
        this.items = options.items
    }

    /**
     * Get total order value
     */
    getTotalOrder() {
        let total = this.items.reduce((acc, curItem) => {
            return acc + curItem.getTotalPrice();
        }, 0)
        return total
    }
}