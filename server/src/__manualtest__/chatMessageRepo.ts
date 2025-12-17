import ChatRepository from "../repositories/ChatRepository";
import MessageRepository from "../repositories/MessageRepository";

const chatRepo = new ChatRepository()
const messRepo = new MessageRepository()

interface ExtractType {
    username?: string
    phone?: string
    interest?: string
    category?: string
}

/**
 * Creat chat and return chat's ID
 * @returns 
 */
async function createChat(): Promise<string> {
    const createdChat = await chatRepo.create({})
    console.log("create chat ok")
    return createdChat.id
}

async function addMessageToChat(options: {
    chatId: string,
    role: "USER" | "SYSTEM",
    content: string
}): Promise<void> {
    const createdMess = await messRepo.create({
        data: {
            chatId: options.chatId,
            role: options.role,
            message: options.content
        }
    })
    console.log("create mess ok")
}

async function showChat(chatId: string): Promise<void> {
    const chat = await chatRepo.findById({
        where: {
            id: chatId
        },
        include: {
            messages: true
        }
    })
    console.log(chat)
}

async function updateChat(options: {
    chatId: string,
    extractedFields?: ExtractType,
    isExtracted: boolean
    isSpam: boolean
}): Promise<void> {
    await chatRepo.updateById({
        where: {
            id: options.chatId
        },
        data: {
            isExtracted: options.isExtracted,
            extractedData: options.extractedFields,
            isSpam: options.isSpam
        }
    })
    console.log("update ok")
}

async function main() {
    console.log("start test")
    const chatId1 = await createChat()
    const chatId2 = await createChat()

    // add message to chat1
    await addMessageToChat({
        chatId: chatId1,
        role: "SYSTEM",
        content: "this is a content"
    })
    await addMessageToChat({
        chatId: chatId1,
        role: "USER",
        content: "this is a content"
    })

    // add message to chat2
    await addMessageToChat({
        chatId: chatId2,
        role: "SYSTEM",
        content: "this is a content"
    })
    await addMessageToChat({
        chatId: chatId2,
        role: "USER",
        content: "this is a content"
    })

    // update chat1
    await updateChat({
        chatId: chatId1,
        extractedFields: {
            username: "Le Trung Kien",
            phone: "123123",
            interest: "dien thoai samsung",
            category: "smartphone"
        },
        isExtracted: true,
        isSpam: false
    })

    // update chat2
    await updateChat({
        chatId: chatId2,
        isExtracted: true,
        isSpam: true
    })

    console.log("==== show chat 1 ====")
    await showChat(chatId1)
    console.log("==== show chat 2 ====")
    await showChat(chatId2)

    console.log("end test")
}

main()