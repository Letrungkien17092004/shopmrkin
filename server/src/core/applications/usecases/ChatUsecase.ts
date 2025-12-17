import { Chat } from "../../entities/index.js";
import IChatUsecase from "../interfaces/usecases/IChatUsecase.js";
import IChatRepository, { OrderByOptions, IncludeOption, ExtractedSchema } from "../interfaces/repositories/IChatRepository.js";
import { REPO_ERROR, REPO_ERROR_CODE } from "../interfaces/repositories/errors.js"
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../interfaces/usecases/errors.js"

export default class ChatUsecase implements IChatUsecase {
    private chatRepo: IChatRepository

    constructor(chatRepo: IChatRepository) {
        this.chatRepo = chatRepo
    }

    /**
     * Create new Chat
     * @param options 
     */
    async create(options: {}): Promise<Chat> {
        try {
            return await this.chatRepo.create(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                }
            }
            throw new USECASE_ERROR({
                message: (error as Error).message || "",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    /**
     * find unique chat by Chat's id
     * @param options 
     */
    async findById(options: {
        where: {
            id: string
        },
        include?: IncludeOption
    }): Promise<Chat | null> {
        try {
            return await this.chatRepo.findById(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                }
            }
            throw new USECASE_ERROR({
                message: (error as Error).message || "",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    /**
     * find many chat by fillter (where)
     * @param options 
     */
    async findMany(options: {
        where: {
            isExtracted?: boolean,
            isSpam?: boolean
        },
        orderBy?: OrderByOptions | OrderByOptions[],
        include?: IncludeOption
    }): Promise<Chat[]> {
        try {
            return await this.chatRepo.findMany(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                }
            }
            throw new USECASE_ERROR({
                message: (error as Error).message || "",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    /**
     * update a chat by Chat's id
     * @param options 
     */
    async updateById(options: {
        where: {
            id: string
        },
        data: {
            isExtracted: boolean,
            extractedData: ExtractedSchema,
            isSpam: boolean,
        }
    }): Promise<void> {
        try {
            return await this.chatRepo.updateById(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                }
            }
            throw new USECASE_ERROR({
                message: (error as Error).message || "",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

}
