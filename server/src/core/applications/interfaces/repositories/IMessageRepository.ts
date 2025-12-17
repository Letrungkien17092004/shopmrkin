import { Message } from "../../../entities/index.js";

export default interface IMessageRepository {

    /**
     * Create new message
     * @param options 
     */
    create(options: {
        data: {
            chatId: string,
            role: "USER" | "SYSTEM"
            message: string
        }
    }): Promise<Message>

    /**
     * Find unique message by Message's id
     * @param options 
     */
    findOneById(options: {
        where: {
            id: string
        }
    }): Promise<Message | null>

    /**
     * Find many messages by chat's id
     * @param options 
     */
    findManyByChatId(options: {
        where: {
            chatId: string
        }
    }): Promise<Message[]>

}