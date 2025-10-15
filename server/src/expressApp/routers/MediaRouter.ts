import { Router } from "express";
import MediaRepository from "repositories/MediaRepository.js";
import MediaUsecase from "core/applications/usecases/MediaUsecase.js";
import MediaController from "adapter/controllers/MediaController.js";
import uploadMiddleware from "expressApp/middlewares/upload.middleware.js";
import {authorAccessToken} from "expressApp/middlewares/author.middlewares.js"
import bodyParser from "body-parser";
const mediaRepo = new MediaRepository()
const mediaUsecase = new MediaUsecase(mediaRepo)
const mediaController = new MediaController(mediaUsecase)

const mediaRouter = Router()

mediaRouter.post("/media/upload", authorAccessToken, uploadMiddleware.array("media"), mediaController.createMany)
mediaRouter.post("/media/assign-to-product", bodyParser.json(), authorAccessToken, mediaController.assignMediaToProduct)

export default mediaRouter

