import { Request, Response } from "express";
import IChatUsecase from "../../core/applications/interfaces/usecases/IChatUsecase.js";
import ExtractorService from "../../services/extractorService/ExtractorService.js";
export default class ChatController {
    private chatUsecase: IChatUsecase
    private extractorService: ExtractorService

    constructor(chatUsecase: IChatUsecase, extractorService: ExtractorService) {
        this.chatUsecase = chatUsecase
        this.extractorService = extractorService
    }

    /**
     * get all chat and its message
     * GET: /chats
     * @param req 
     * @param res 
     */
    findMany = async (req: Request, res: Response): Promise<void> => {
        try {
            const listChat = await this.chatUsecase.findMany({
                where: {},
                include: {
                    messages: true
                }
            })

            res.status(200).json({
                length: listChat.length,
                chats: listChat
            })
        } catch (error) {
            res.status(500).json({
                message: "Server Internal Error!"
            })
        }
    }

    /**
     * find a chat and its message by id
     * GET: /chats/:chatId
     * @param req 
     * @param res 
     */
    findById = async (req: Request, res: Response): Promise<void> => {
        try {
            const chatId = req.params.chatId
            const chat = await this.chatUsecase.findById({
                where: {
                    id: chatId
                },
                include: {
                    messages: true
                }
            })
            if (!chat) {
                res.status(404).json({
                    message: "Chat not found"
                })
                return
            }

            res.status(200).json({
                chat: chat
            })
        } catch (error) {
            res.status(500).json({
                message: "Server Internal Error!"
            })
        }
    }

    /**
     * TODO: need delete this method
     * extract all chat
     * GET: /chats/extract
     * @param req 
     * @param res 
     */
    extract = async (req: Request, res: Response): Promise<void> => {
        try {
            const chats = await this.chatUsecase.findMany({
                where: {},
                include: {
                    messages: true
                }
            })

            for (let i = 0; i < chats.length; i++) {
                const chat = chats[i]
                if (chat.isExtracted) { continue }
                const parsedMess: { role: "user" | "assistant", content: string }[] = chat.messages.map(mess => ({
                    role: mess.role === "USER" ? "user" : "assistant",
                    content: mess.message
                }))

                const extractResult = await this.extractorService.extract(parsedMess)
                if (extractResult.isSpam === false) {
                    await this.chatUsecase.updateById({
                        where: {
                            id: chat.id
                        },
                        data: {
                            isExtracted: true,
                            isSpam: false,
                            extractedData: extractResult.extracted_data
                        }
                    })
                } else {
                    await this.chatUsecase.updateById({
                        where: {
                            id: chat.id
                        },
                        data: {
                            isExtracted: true,
                            isSpam: true,
                            extractedData: {}
                        }
                    })
                }
            }
            res.status(200).json({
                message: "extract chat ok"
            })
        } catch (error) {
            res.status(500).json({
                message: "Server Internal Error!"
            })
        }
    }
}
