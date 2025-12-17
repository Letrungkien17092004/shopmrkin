import { Request, Response } from "express";
import AssistantService from "../../services/assistantService/AssistantService.js";
import { Chat } from "../../core/entities/index.js"
import IChatUsecase from "../../core/applications/interfaces/usecases/IChatUsecase.js";
import IMessageUsecase from "../../core/applications/interfaces/usecases/IMessageUsecase.js";
import { z, ZodError } from "zod"


export default class AssistantController {
    private chatUsecase: IChatUsecase
    private messageUsecase: IMessageUsecase
    private assistantService: AssistantService

    constructor(chatUsecase: IChatUsecase, assistantService: AssistantService, messageUsecase: IMessageUsecase) {
        this.chatUsecase = chatUsecase
        this.messageUsecase = messageUsecase
        this.assistantService = assistantService
    }

    /**
     * Start new chat
     * POST: /chats
     * @param req 
     * @param res 
     */
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const chat = await this.chatUsecase.create({})
            res.status(201).json({
                chatId: chat.id
            })
        } catch (error) {
            res.status(500).json({
                message: "Server internal error!"
            })
        }
    }

    /**
     * add new message to chat
     * POST: /chats/:chatId/messages
     * @param req 
     * @param res 
     */
    newMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const chatId = req.params.chatId
            const BodySchema = z.object({
                message: z.string()
            })
            const parsedBody = BodySchema.parse(req.body)
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
                    message: "chat not found"
                })
                return
            }

            // convert message in DB to history message
            const historyMessages: {
                role: "user" | "assistant",
                content: string
            }[] = chat.messages.map(mess => {
                const role = mess.role === "SYSTEM" ? "assistant" : "user"
                return {
                    role: role,
                    content: mess.message
                }
            })

            // call assistant
            const assistantResult = await this.assistantService.chat(
                parsedBody.message,
                historyMessages
            )

            // push newest user message to db
            const createdUserMessage = await this.messageUsecase.create({
                data: {
                    chatId: chatId,
                    role: "USER",
                    message: parsedBody.message
                }
            })

            // push newest assistant response to db
            const createdSystemMessage = await this.messageUsecase.create({
                data: {
                    chatId: chatId,
                    role: "SYSTEM",
                    message: assistantResult.message
                }
            })

            res.status(200).json({
                message: assistantResult.message,
                recommend_products: assistantResult.recommend_products
            })

        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: "invalid body, require {message: string}"
                })
                return
            }
            res.status(500).json({
                message: "Server internal error!"
            })
        }
    }
}
