import { Router } from "express";
import ProductController from "adapter/controllers/ProductController.js";
import ProductRepository from "repositories/ProductRepository.js";
import ProductUsecase from "core/applications/usecases/ProductUsecase.js";
import { authorAccessToken } from "expressApp/middlewares/author.middlewares.js";

const repo = new ProductRepository()
const usecase = new ProductUsecase(repo)
const controller = new ProductController(usecase)

const productRouter = Router()

// RESTful
productRouter.post("/product", [authorAccessToken, controller.create])
productRouter.get("/product", controller.findMany) // get-all
productRouter.get("/product/:id", controller.findOneById) // get-by-id
productRouter.put("/product/:id", [authorAccessToken, controller.updateById])
productRouter.delete("/product/:id", [authorAccessToken, controller.deleteById])

export default productRouter

