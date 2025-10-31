import { Router } from "express";
import MediaRepository from "../../repositories/MediaRepository.js";
import MediaUsecase from "../../core/applications/usecases/MediaUsecase.js";
import MediaController from "../../adapter/controllers/MediaController.js";
import uploadMiddleware from "../../expressApp/middlewares/upload.middleware.js";
import {requireAccessToken} from "../../expressApp/middlewares/author.middlewares.js"
import bodyParser from "body-parser";
const mediaRepo = new MediaRepository()
const mediaUsecase = new MediaUsecase(mediaRepo)
const mediaController = new MediaController(mediaUsecase)

const mediaRouter = Router()

mediaRouter.post("/media/upload", requireAccessToken, uploadMiddleware.array("media"), mediaController.upload)
// mediaRouter.post("/media", bodyParser.json(), requireAccessToken, mediaController.create)
mediaRouter.get("/media", mediaController.findMany)
mediaRouter.get("/media/:id", mediaController.findOneById)
mediaRouter.put("/media/:id", bodyParser.json(), requireAccessToken, mediaController.updateById)
mediaRouter.delete("/media/:id", bodyParser.json(), requireAccessToken, mediaController.deleteById)

export default mediaRouter

