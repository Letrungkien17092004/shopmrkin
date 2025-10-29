import { Router } from "express";
import ProductController from "../../adapter/controllers/ProductController.js";
import ProductRepository from "../../repositories/ProductRepository.js";
import ProductUsecase from "../../core/applications/usecases/ProductUsecase.js";
import { requireAccessToken } from "../../expressApp/middlewares/author.middlewares.js";

const repo = new ProductRepository()
const usecase = new ProductUsecase(repo)
const controller = new ProductController(usecase)

const productRouter = Router()

// RESTful
productRouter.post("/product", [requireAccessToken, controller.create])
productRouter.get("/product", controller.findMany) // get-all
productRouter.get("/product/:id", controller.findOneById) // get-by-id
productRouter.put("/product/:id", [requireAccessToken, controller.updateById])
productRouter.delete("/product/:id", [requireAccessToken, controller.deleteById])

export default productRouter

