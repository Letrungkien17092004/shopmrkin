import { Message } from "./index.ts"

interface ExtractType {
    username?: string
    phone?: string
    interest?: string
    category?: string
}

export default interface Chat {
    id: string
    isExtracted: boolean
    extractedData: ExtractType
    isSpam: boolean
    createdAt: Date
    updatedAt: Date
    messages: Message[]
}