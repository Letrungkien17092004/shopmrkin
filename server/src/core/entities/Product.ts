import { User, Category, Variant, Media, ProductEmbedding } from "../../core/entities/index.js"

type ProductConstructorParam = {
    id: string,
    product_code: number,
    name: string,
    description: string,
    categoryId: number | null,
    userId: string,
    // relation
    user?: User,
    category?: Category | null,
    media?: Media[]
    variants?: Variant[]
    productEmbedding?: ProductEmbedding

    // time
    createdAt?: Date,
    updatedAt?: Date
}

export default class Product {
    id: string
    product_code: number
    name: string
    description: string
    userId: string
    categoryId: number | null

    user?: User
    category?: Category | null
    media?: Media[]
    variants?: Variant[]
    productEmbedding?: ProductEmbedding

    createdAt?: Date
    updatedAt?: Date

    constructor(options: ProductConstructorParam) {
        this.id = options.id
        this.product_code = options.product_code
        this.name = options.name
        this.description = options.description
        this.userId = options.userId
        this.categoryId = options.categoryId
        
        this.user = options.user
        this.category = options.category
        this.media = options.media
        this.variants = options.variants
        this.productEmbedding = options.productEmbedding
        
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
    }
}