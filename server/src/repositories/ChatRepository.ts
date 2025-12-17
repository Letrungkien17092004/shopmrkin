import { Chat, Message } from "../core/entities/index.js"
import IChatRepository, { IncludeOption, OrderByOptions } from "../core/applications/interfaces/repositories/IChatRepository.js"
import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js"
import { PrismaClient } from "@prisma/client/index.js"
import { z } from "zod"

interface ExtractType {
    username?: string
    phone?: string
    interest?: string
    category?: string
}

const ExtractSchema = z.object({
    username: z.string().optional(),
    phone: z.string().optional(),
    interest: z.string().optional(),
    category: z.string().optional()
})

const prisma = new PrismaClient()

export default class ChatRepository implements IChatRepository {

    /**
     * Creates a new chat in the database.
     * @param options Chat data.
     * @param options.data The data for the new Chat.
     * @param options.include whether it include messages when returning (default false).
     * @returns The created Chat entity.
     * @throws Throws if an error occurs during creation.
     */
    async create(options: {}): Promise<Chat> {
        try {
            const createdChat = await prisma.chats.create({
                data: {}
            })
            return new Chat({
                ...createdChat,
                extractedData: {},
                messages: []
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Retrieves a list of Chats based on filtering, sorting, and pagination options.
     * @param options The options for querying the list of Chats.
     * @param options.where The filter conditions, equivalent to Prisma's 'where'. Supports filtering by isExtracted and isSpam.
     * @param options.orderBy Sorts the results by one or more fields. E.g., [{ createdAt: 'desc' }].
     * @param options.limit The maximum number of records to return (equivalent to 'limit').
     * @param options.offset The number of records to skip (equivalent to 'offset').
     * @param options.include The relations to load along with the list of Chats.
     * @returns A Promise that resolves to an array of Chat objects.
     */
    async findMany(options: {
        where?: { isExtracted?: boolean, isSpam?: boolean },
        orderBy?: OrderByOptions | OrderByOptions[],
        limit?: number,
        offset?: number,
        include?: IncludeOption
    }): Promise<Chat[]> {
        try {
            if (options.include) {
                const chats = await prisma.chats.findMany({
                    where: options.where,
                    relationLoadStrategy: "join",
                    include: {
                        messages: true
                    },
                    take: options.limit,
                    skip: options.offset,
                    orderBy: options.orderBy
                })

                return chats.map(c => {
                    const messages: Message[] = c.messages
                        ? c.messages.map(m => new Message({
                            ...m,
                            role: m.role as "USER" | "SYSTEM"
                        }))
                        : []

                    return new Chat({
                        ...c,
                        messages: messages,
                        extractedData: c.extractedData as ExtractType
                    })
                })
            }

            const chats = await prisma.chats.findMany({
                where: options.where,
                take: options.limit,
                skip: options.offset,
                orderBy: options.orderBy
            })

            return chats.map(c => new Chat({
                ...c,
                extractedData: c.extractedData as ExtractType,
                messages: []
            }))
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Retrieves a chat by its unique id.
     * @param id The id of the chat.
     * @returns The Chat entity if found, otherwise null.
     * @throws Throws if an error occurs during retrieval.
     */
    async findById(options: {
        where: {
            id: string
        },
        include?: IncludeOption
    }): Promise<Chat | null> {
        try {
            if (options.include) {
                const chat = await prisma.chats.findUnique({
                    where: options.where,
                    relationLoadStrategy: "join",
                    include: {
                        messages: true
                    }
                })

                if (!chat) return null

                const messages: Message[] = chat.messages.map(m => new Message({
                    ...m,
                    role: m.role as "USER" | "SYSTEM"
                }))

                return new Chat({
                    ...chat,
                    messages: messages,
                    extractedData: chat.extractedData as ExtractType
                })
            }

            const searchedChat = await prisma.chats.findUnique({
                where: options.where
            })

            return searchedChat
                ? new Chat({
                    ...searchedChat,
                    extractedData: searchedChat.extractedData as ExtractType,
                    messages: []
                })
                : null
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Updates a chat by its id.
     * @param id The id of the chat to update.
     * @param options Partial chat data to update.
     * @returns void
     * @throws Throws if an error occurs during update.
     */
    async updateById(options: {
        where: { id: string },
        data: {
            isExtracted?: boolean,
            extractedData?: ExtractType,
            isSpam?: boolean
        }
    }): Promise<void> {
        try {
            const data = options.data
            const parsedExtractData = ExtractSchema.parse(options.data)
            await prisma.chats.update({
                where: options.where,
                data: {
                    isExtracted: data.isExtracted,
                    extractedData: {
                        username: parsedExtractData?.username,
                        phone: parsedExtractData?.phone,
                        interest: parsedExtractData?.interest,
                        category: parsedExtractData?.category
                    },
                    isSpam: data.isSpam
                }
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
}