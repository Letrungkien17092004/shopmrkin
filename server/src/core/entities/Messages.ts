
interface MessagesContructorParam {
    id: string
    chatId: string
    role: "USER" | "SYSTEM"
    message: string
    createdAt: Date
    updatedAt: Date
}

export default class Message {
    id: string
    chatId: string
    role: "USER" | "SYSTEM"
    message: string
    createdAt: Date
    updatedAt: Date

    constructor(options: MessagesContructorParam) {
        this.id = options.id
        this.chatId = options.chatId
        this.role = options.role
        this.message = options.message
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
    }
}