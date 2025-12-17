import { Message } from "../../entities/index.js";
import IMessageUsecase from "../interfaces/usecases/IMessageUsecase.js";
import IMessageRepository from "../interfaces/repositories/IMessageRepository.js";
import { REPO_ERROR, REPO_ERROR_CODE } from "../interfaces/repositories/errors.js"
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../interfaces/usecases/errors.js"


export default class MessageUsecase implements IMessageUsecase {
    private messRepo: IMessageRepository

    constructor(messRepo: IMessageRepository) {
        this.messRepo = messRepo
    }

    /**
     * Create new message
     * @param options 
     */
    async create(options: {
        data: {
            chatId: string,
            role: "USER" | "SYSTEM"
            message: string
        }
    }): Promise<Message> {
        try {
            return await this.messRepo.create(options)
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
     * Find unique message by Message's id
     * @param options 
     */
    async findOneById(options: {
        where: {
            id: string
        }
    }): Promise<Message | null> {
        try {
            return await this.messRepo.findOneById(options)
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
     * Find many messages by chat's id
     * @param options 
     */
    async findManyByChatId(options: {
        where: {
            chatId: string
        }
    }): Promise<Message[]> {
        try {
            return await this.messRepo.findManyByChatId(options)
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