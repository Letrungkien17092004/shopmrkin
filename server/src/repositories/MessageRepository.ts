import IMessageRepository from "../core/applications/interfaces/repositories/IMessageRepository.js";
import { Message } from "../core/entities/index.js";
import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js";
import { PrismaClient } from "@prisma/client/index.js";

const prisma = new PrismaClient()

export default class MessageRepository implements IMessageRepository {

    /**
     * Creates a new message in the database.
     * @param options Message data.
     * @param options.data The data for the new Message.
     * @returns The created Message entity.
     * @throws Throws if an error occurs during creation.
     */
    async create(options: {
        data: {
            chatId: string,
            role: "USER" | "SYSTEM"
            message: string
        }
    }): Promise<Message> {
        try {
            const createdMessage = await prisma.messages.create({
                data: options.data
            })
            return new Message({
                ...createdMessage,
                role: createdMessage.role as "USER" | "SYSTEM"
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Retrieves a message by its unique id.
     * @param options The options for querying the message.
     * @param options.where The filter conditions with id.
     * @returns The Message entity if found, otherwise null.
     * @throws Throws if an error occurs during retrieval.
     */
    async findOneById(options: {
        where: {
            id: string
        }
    }): Promise<Message | null> {
        try {
            const message = await prisma.messages.findUnique({
                where: options.where
            })

            return message
                ? new Message({
                    ...message,
                    role: message.role as "USER" | "SYSTEM"
                })
                : null
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Retrieves a list of messages by chat's id.
     * @param options The options for querying the messages.
     * @param options.where The filter conditions with chatId.
     * @returns A Promise that resolves to an array of Message objects.
     * @throws Throws if an error occurs during retrieval.
     */
    async findManyByChatId(options: {
        where: {
            chatId: string
        }
    }): Promise<Message[]> {
        try {
            const messages = await prisma.messages.findMany({
                where: options.where
            })

            return messages.map(m => new Message({
                ...m,
                role: m.role as "USER" | "SYSTEM"
            }))
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
}

