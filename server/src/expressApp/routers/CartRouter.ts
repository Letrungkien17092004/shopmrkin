import { Router } from "express"
import { requireAccessToken } from "../../expressApp/middlewares/author.middlewares.js"
import CartController from "../../adapter/controllers/CartController.js"
import CartRepository from "../../repositories/CartRepository.js"
import CartUsecase from "../../core/applications/usecases/CartUsecase.js"

const repo = new CartRepository()
const usecase = new CartUsecase(repo)
const controller = new CartController(usecase)

const cartRouter = Router()

// RESTful
cartRouter.post('/cart', [requireAccessToken, controller.create])
cartRouter.get('/cart', [requireAccessToken, controller.getOneByUserId])
cartRouter.post('/cart/:cartId/items', [requireAccessToken, controller.addItem])
cartRouter.patch('/cart/:cartId/items/:variantId', [requireAccessToken, controller.updateItem])
cartRouter.delete('/cart/:cartId/items/:variantId', [requireAccessToken, controller.destroyItem])
cartRouter.delete('/cart/:id', [requireAccessToken, controller.destroy])

export default cartRouter
