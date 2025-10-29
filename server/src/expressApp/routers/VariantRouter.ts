import { Router } from "express";
import VariantController from "../../adapter/controllers/VariantController.js";
import { requireAccessToken } from "../../expressApp/middlewares/author.middlewares.js";
import VariantRepository from "../../repositories/VariantRepository.js";
import VariantUsecase from "../../core/applications/usecases/VariantUsecase.js";

const repo = new VariantRepository()
const usecase = new VariantUsecase(repo)
const controller = new VariantController(usecase)

const variantRouter = Router()

// RESTful
variantRouter.post('/variant', [requireAccessToken, controller.create])
variantRouter.get('/variant', controller.findMany) // get-all
variantRouter.get('/variant/:id', controller.findOneById) // get by id
variantRouter.put("/variant/:id", [requireAccessToken, controller.updateById])
variantRouter.delete("/variant/:id", [requireAccessToken, controller.deleteById])

export default variantRouter







