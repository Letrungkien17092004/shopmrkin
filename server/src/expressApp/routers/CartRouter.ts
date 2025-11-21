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
cartRouter.get('/carts/:cartId', [requireAccessToken, controller.findOneById]) // Read a cart
cartRouter.post('/carts/:cartId/items', [requireAccessToken, controller.addItem]) // Add cartItem to Cart
cartRouter.put('/carts/:cartId/items/:cartItemId', [requireAccessToken, controller.updateItem]) // Update cartItem to Cart
cartRouter.delete('/carts/:cartId/items/:cartItemId', [requireAccessToken, controller.deleteItem])
cartRouter.delete('/carts/:cartId/items', [requireAccessToken, controller.clearCart]) // clear all cartItem

export default cartRouter
