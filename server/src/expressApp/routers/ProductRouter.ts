import { Router } from "express";
import ProductController from "adapter/controllers/ProductController.js";
import ProductRepository from "repositories/ProductRepository.js";
import ProductUsecase from "core/applications/usecases/ProductUsecase.js";
import { authorAccessToken } from "expressApp/middlewares/author.middlewares.js";

const repo = new ProductRepository()
const usecase = new ProductUsecase(repo)
const controller = new ProductController(usecase)

const productRouter = Router()


productRouter.post("/product", [authorAccessToken, controller.addProduct])
productRouter.get("/product/:id", controller.findProductWithId)
productRouter.put("/product/:id", [authorAccessToken, controller.updateProduct])
productRouter.delete("/product/:id", [authorAccessToken, controller.deleteProduct])

export default productRouter

