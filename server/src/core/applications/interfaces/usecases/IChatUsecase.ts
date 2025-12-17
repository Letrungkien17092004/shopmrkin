import { Chat } from "../../../entities/index.js"
import { OrderByOptions, IncludeOption, ExtractedSchema } from "../repositories/IChatRepository.js"

export default interface IChatUsecase {

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
        },
        include?: IncludeOption
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