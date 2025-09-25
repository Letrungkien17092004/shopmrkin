import User from "./User.js"

type MediaConstructorParam = {
    id: string
    fileName: string
    filePath: string
    hostname: string
    media_type: "IMAGE" | "VIDEO"
    size: number
    status: "ORPHANED" | "ASSIGNED"
    userId: string
    author?: User
    createdAt: Date
    updatedAt: Date
}

export default class Media {
    id: string
    fileName: string
    filePath: string
    hostname: string
    media_type: "IMAGE" | "VIDEO"
    size: number
    status: "ORPHANED" | "ASSIGNED"
    userId: string
    author?: User

    createdAt: Date
    updatedAt: Date

    constructor(options: MediaConstructorParam) {
        this.id = options.id
        this.fileName = options.fileName
        this.filePath = options.filePath
        this.hostname = options.hostname
        this.media_type = options.media_type
        this.size = options.size
        this.status = options.status
        this.userId = options.userId
        this.author = options.author
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
    }
}