import Product from "./Product.js"

type VariantConstructorParam = {
    id: string,
    name: string,
    sku: string,
    productId: string,
    product: Product,
    price: number,
    stock: number,
    createdAt: Date,
    updatedAt: Date
}

export default class Variant {
    id: string
    name: string
    sku: string
    productId: string
    product: Product
    price: number
    stock: number
    createdAt: Date
    updatedAt: Date

    constructor(options: VariantConstructorParam) {
    this.id = options.id
    this.name = options.name
    this.sku = options.sku
    this.productId = options.productId
    this.product = options.product
    this.price = options.price
    this.stock = options.stock
    this.createdAt = options.createdAt
    this.updatedAt = options.updatedAt
    }
}