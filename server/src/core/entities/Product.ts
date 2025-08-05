import { User, Category, Variant } from "core/entities/index.js"
type ProductConstructorParam = {
    id: string,
    product_code: number,
    name: string,
    description: string,
    // relation
    authorId: number,
    author?: User,
    categoryId: number,
    category?: Category,
    variants?: Variant[]

    // time
    createdAt: Date,
    updatedAt: Date
}

export default class Product {
    id: string
    product_code: number
    name: string
    description: string
    authorId: number
    author?: User
    categoryId: number
    category?: Category
    variants?: Variant[]
    createdAt: Date
    updatedAt: Date

    constructor(options: ProductConstructorParam) {
        this.id = options.id
        this.product_code = options.product_code
        this.name = options.name
        this.description = options.description
        this.authorId = options.authorId
        this.author = options.author
        this.categoryId = options.categoryId
        this.category = options.category
        this.variants = options.variants
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
    }
}