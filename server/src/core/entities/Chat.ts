import { Message } from "./index.js"

interface ExtractType {
    username?: string
    phone?: string
    interest?: string
    category?: string
}

interface ChatContructorParam {
    id: string
    isExtracted: boolean
    extractedData: ExtractType
    isSpam: boolean
    createdAt: Date
    updatedAt: Date
    messages: Message[]
}

export default class Chat {
    id: string
    isExtracted: boolean
    extractedData: ExtractType
    isSpam: boolean
    createdAt: Date
    updatedAt: Date
    messages: Message[]

    constructor(options: ChatContructorParam) {
        this.id = options.id
        this.isExtracted = options.isExtracted
        this.extractedData = options.extractedData
        this.isSpam = options.isSpam
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
        this.messages = options.messages
    }
}