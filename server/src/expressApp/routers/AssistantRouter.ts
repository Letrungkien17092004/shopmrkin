import { Router } from "express";
import AssistantController from "../../adapter/controllers/AssistantController.js";
import ChatRepository from "../../repositories/ChatRepository.js";
import MessageRepository from "../../repositories/MessageRepository.js";
import ProductEmbeddingRepository from "../../repositories/ProductEmbeddingRepository.js";
import ChatUsecase from "../../core/applications/usecases/ChatUsecase.js";
import MessageUsecase from "../../core/applications/usecases/MessageUsecase.js";
import ProductEmbeddingUsecase from "../../core/applications/usecases/ProductEmbeddingUsecase.js";
import AssistantService from "../../services/assistantService/AssistantService.js";
import EmbeddingService from "../../services/embeddingService/EmbeddingService.js";

const assistantRouter = Router()

const chatRepo = new ChatRepository()
const messRepo = new MessageRepository()
const productEmbeddingRepo = new ProductEmbeddingRepository()

const chatUsecase = new ChatUsecase(chatRepo)
const messUsecase = new MessageUsecase(messRepo)
const productEmbeddingUsecase = new ProductEmbeddingUsecase(productEmbeddingRepo)

const embeddingService = new EmbeddingService()
const assistantService = new AssistantService(productEmbeddingUsecase, embeddingService)

const controller = new AssistantController(
    chatUsecase,
    assistantService,
    messUsecase
)

assistantRouter.post("/chats", controller.create)
assistantRouter.post("/chats/:chatId/messages", controller.newMessage)

export default assistantRouter