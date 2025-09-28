import { Product, User } from "./index.js"

type VariantConstructorParam = {
    id: string,
    name: string,
    sku: string,
    productId: string,
    product?: Product,
    userId: string
    user?: User
    price: number,
    stock: number,
    createdAt?: Date,
    updatedAt?: Date
}

export default class Variant {
    id: string
    name: string
    sku: string
    productId: string
    userId: string
    price: number
    stock: number
    
    product?: Product
    user?: User
    
    createdAt?: Date
    updatedAt?: Date

    constructor(options: VariantConstructorParam) {
        this.id = options.id
        this.name = options.name
        this.sku = options.sku
        this.productId = options.productId
        this.product = options.product
        this.userId = options.userId
        this.user = options.user
        this.price = options.price
        this.stock = options.stock
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
    }
}