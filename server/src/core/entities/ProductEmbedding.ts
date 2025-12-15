import { Product } from "./index.js"

interface ProductEmbeddingContructorParam {
    id: string
    productId: string
    origin_text: string
    embedding: number[]
    product: Product
    createdAt: Date
    updatedAt: Date
}

export default class ProductEmbedding {
    id: string
    productId: string
    origin_text: string
    embedding: number[]
    product: Product
    createdAt: Date
    updatedAt: Date

    constructor(options: ProductEmbeddingContructorParam) {
        this.id = options.id
        this.productId = options.productId
        this.origin_text = options.origin_text
        this.embedding = options.embedding
        this.product = options.product
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
    }
}