import OrderRepository from "../../repositories/OrderRepository.js";
import VariantRepository from "../../repositories/VariantRepository.js";
import OrderUsecase from "../../core/applications/usecases/OrderUsecase.js";
import OrderController from "../../adapter/controllers/OrderController.js";
import { Router } from "express";

const orderRepo = new OrderRepository()
const variantRepo = new VariantRepository()
const usecase = new OrderUsecase(orderRepo, variantRepo)
const controller = new OrderController(usecase)

const orderRouter = Router()
orderRouter.post("/cart", controller.create) // create new order
orderRouter.get("/cart/:id", controller.findOneById) // find one
orderRouter.get("/carts", controller.findMany) // find many
orderRouter.put("/cart/:id", controller.updateById) // update

export default orderRouter
