import { User, Product } from "./index.js"

type MediaConstructorParam = {
    id: string
    fileName: string
    filePath: string
    hostname: string
    media_type: "IMAGE" | "VIDEO"
    size: number
    status: "ORPHANED" | "ASSIGNED"
    productId?: string
    userId: string

    user?: User
    product?: Product
    createdAt?: Date
    updatedAt?: Date
}

export default class Media {
    id: string
    fileName: string
    filePath: string
    hostname: string
    media_type: "IMAGE" | "VIDEO"
    size: number
    status: "ORPHANED" | "ASSIGNED"
    productId?: string
    userId: string

    user?: User
    product?: Product
    createdAt?: Date
    updatedAt?: Date

    constructor(options: MediaConstructorParam) {
        this.id = options.id
        this.fileName = options.fileName
        this.filePath = options.filePath
        this.hostname = options.hostname
        this.media_type = options.media_type
        this.size = options.size
        this.status = options.status
        this.userId = options.userId
        this.productId = options.productId
        this.user = options.user
        this.product = options.product
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
    }
}