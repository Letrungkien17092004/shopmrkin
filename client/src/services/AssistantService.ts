import axios from "axios";
import { ENV } from "../config/ENV.ts";
import { AssistantChat, AssistantMessage } from "../types/chat/index.ts"

interface StartNewChatResponse {
    chatId: string
}

interface SendMessageResponse {
    message: string,
    recommend_products: {
        productId: string
    }[]
}

export default class AssistantService {
    private baseUrl = `${ENV.BACK_END_HOST}/api`

    /**
     * Start a chat session
     */
    startNewChat = async (): Promise<AssistantChat> => {
        const response = await axios.post<StartNewChatResponse>(`${this.baseUrl}/chats`)
        return {
            id: response.data.chatId,
            messages: []
        }
    }


    /**
     * Send message to server
     * @param param0 
     * @returns 
     */
    sendMessage = async ({ message, chatId }: { message: string, chatId: string }): Promise<AssistantMessage> => {
        const response = await axios.post<SendMessageResponse>(
            `${this.baseUrl}/chats/${chatId}/messages`,
            {
                message: message
            }
        )

        return {
            ...response.data,
            role: "user"
        }
    }
}