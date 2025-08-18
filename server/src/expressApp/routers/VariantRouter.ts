import { Router } from "express";
import VariantController from "adapter/controllers/VariantController.js";
import { authorAccessToken } from "expressApp/middlewares/author.middlewares.js";
import VariantRepository from "repositories/VariantRepository.js";
import VariantUsecase from "core/applications/usecases/VariantUsecase.js";

const repo = new VariantRepository()
const usecase = new VariantUsecase(repo)
const controller = new VariantController(usecase)

const variantRouter = Router()


variantRouter.post('/variant', [authorAccessToken, controller.create])
variantRouter.get('/variant/:id', controller.findWithId)
variantRouter.put("/variant/:id", [authorAccessToken, controller.updateById])
variantRouter.delete("/variant/:id", [authorAccessToken, controller.deleteById])

export default variantRouter







