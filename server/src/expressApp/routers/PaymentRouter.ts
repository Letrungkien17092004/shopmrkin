import PaymentRepository from "../../repositories/PaymentRepository.js";
import OrderRepository from '../../repositories/OrderRepository.js';
import PaymentUsecase from "../../core/applications/usecases/PaymentUsecase.js";
import PaymentController from "../../adapter/controllers/PaymentController.js";
import { Router } from "express";

const paymentRepo = new PaymentRepository()
const orderRepo = new OrderRepository()
const usecase = new PaymentUsecase(paymentRepo, orderRepo)
const controller = new PaymentController(usecase)
const paymentRouter = Router()

paymentRouter.post("/payment", controller.create) // create new
paymentRouter.get("/payment/:id", controller.findOneById) // find by id
paymentRouter.get("/payments", controller.findMany) // find all
paymentRouter.put("/payment/:id", controller.updateById) // update (can only update payment status)

export default paymentRouter

