import { Router } from "express";
import ChatRepository from "../../repositories/ChatRepository.js";
import ChatUsecase from "../../core/applications/usecases/ChatUsecase.js";
import ExtractorService from "../../services/extractorService/ExtractorService.js";
import ChatController from "../../adapter/controllers/ChatController.js";

const chatRepo = new ChatRepository()
const chatUsecase = new ChatUsecase(chatRepo)
const extractorService = new ExtractorService()
const chatController = new ChatController(chatUsecase, extractorService)

const chatRouter = Router()

chatRouter.get("/chats", chatController.findMany)
chatRouter.get("/chats/:chatId", chatController.findById)
chatRouter.get("/extract-chat", chatController.extract)

export default chatRouter

