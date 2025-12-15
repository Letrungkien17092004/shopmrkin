import { Router } from "express";
import ProductController from "../../adapter/controllers/ProductController.js";
import ProductRepository from "../../repositories/ProductRepository.js";
import ProductUsecase from "../../core/applications/usecases/ProductUsecase.js";
import ProductEmbeddingUsecase from "../../core/applications/usecases/ProductEmbeddingUsecase.js";
import ProductEmbeddingRepository from "../../repositories/ProductEmbeddingRepository.js";
import EmbeddingService from "../../services/embeddingService/EmbeddingService.js";
import { requireAccessToken } from "../../expressApp/middlewares/author.middlewares.js";

const embeddingService = new EmbeddingService()
const productRepo = new ProductRepository()
const embeddingRepo = new ProductEmbeddingRepository()
const embeddingUsecase = new ProductEmbeddingUsecase(embeddingRepo)
const productUsecase = new ProductUsecase(productRepo)
const controller = new ProductController(productUsecase, embeddingUsecase, embeddingService)

const productRouter = Router()

// RESTful
productRouter.post("/product", [requireAccessToken, controller.create])
productRouter.get("/products", controller.findMany) // get-all
productRouter.get("/product/:id", controller.findOneById) // get-by-id
productRouter.put("/product/:id", [requireAccessToken, controller.updateById])
productRouter.delete("/product/:id", [requireAccessToken, controller.deleteById])

export default productRouter

