import { Chat } from "../../../entities/index.js";

export type SortOrder = "asc" | "desc"
export type IncludeOption = {
    messages?: boolean
}

export type OrderByOptions = Partial<
    Record<keyof Omit<Chat, "id" | "extractedData" | "messages">, SortOrder>
>

interface ExtractedSchema {
    username?: string
    phone?: string
    interest?: string
    category?: string
}

export default interface IChatRepository {

    /**
     * Create new Chat
     * @param options 
     */
    create(options: {}): Promise<Chat>

    /**
     * find unique chat by Chat's id
     * @param options 
     */
    findById(options: {
        where: {
            id: string
        }
    }): Promise<Chat | null>

    /**
     * find many chat by fillter (where)
     * @param options 
     */
    findMany(options: {
        where: {
            isExtracted?: boolean,
            isSpam?: boolean
        },
        orderBy?: OrderByOptions | OrderByOptions[],
        include?: IncludeOption
    }): Promise<Chat[]>

    /**
     * update a chat by Chat's id
     * @param options 
     */
    updateById(options: {
        where: {
            id: string
        },
        data: {
            isExtracted: boolean,
            extractedData: ExtractedSchema,
            isSpam: boolean,
        }
    }): Promise<void>
}