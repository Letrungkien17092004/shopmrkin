
export default interface Message {
    id: string
    chatId: string
    role: "USER" | "SYSTEM"
    message: string
    createdAt: Date
    updatedAt: Date
}