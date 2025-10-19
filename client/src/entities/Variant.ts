interface VariantConstructorParam  {
    id: string
    name: string
    sku: string
    productId: string
    userId: string
    price: number
    stock: number

    user?: {
        username: string
        role?: string
    }

    createdAt?: Date
    updatedAt?: Date
}

export class Variant {
    id: string
    name: string
    sku: string
    productId: string
    userId: string
    price: number
    stock: number

    user?: {
        username: string
        role?: string
    }

    createdAt?: Date
    updatedAt?: Date

    constructor(options: VariantConstructorParam) {
        this.id = options.id
        this.name = options.name
        this.sku = options.sku
        this.price = options.price
        this.stock = options.stock
        this.userId = options.userId
        this.user = options.user
        this.productId = options.productId
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
    }
}