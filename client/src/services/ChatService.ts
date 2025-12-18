import axios from "axios"
import { ENV } from "../config/ENV.ts"
import { Chat } from "../types/chat/index.ts"

interface FindManyResponse {
    length: number
    chats: Chat[]
}

interface FindByIdResponse {
    chat: Chat
}

export default class ChatService {
    private baseUrl = `${ENV.BACK_END_HOST}/api`

    /**
     * Get all chats with their messages
     * @returns List of all chats
     */
    findMany = async (): Promise<Chat[]> => {
        try {
            const response = await axios.get<FindManyResponse>(`${this.baseUrl}/chats`)
            return response.data.chats
        } catch (error) {
            console.error("Error fetching chats:", error)
            return []
        }
    }

    /**
     * Find a specific chat by ID
     * @param chatId Chat ID to find
     * @returns Chat object or null if not found
     */
    findById = async (chatId: string): Promise<Chat | null> => {
        try {
            const response = await axios.get<FindByIdResponse>(
                `${this.baseUrl}/chats/${chatId}`
            )
            return response.data.chat
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.warn(`Chat with ID ${chatId} not found`)
                return null
            }
            console.error("Error fetching chat:", error)
            return null
        }
    }

    /**
     * Extract data from unextracted chats
     * @returns Success message
     */
    extractor = async (): Promise<void> => {
        try {
            await axios.get(`${this.baseUrl}/extract-chat`)
        } catch (error) {
            console.error("Error extracting chat data:", error)
            throw error
        }
    }
}