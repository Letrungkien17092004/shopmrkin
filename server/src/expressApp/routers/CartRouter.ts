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
// cartRouter.post('/cart', [requireAccessToken, controller.create]) // create new cart
cartRouter.get('/cart/:cartId', [requireAccessToken, controller.findOneById]) // Read a cart
cartRouter.post('/cart/:cartId/item', [requireAccessToken, controller.addItem]) // Add cartItem to Cart
cartRouter.patch('/cart/:cartId/item/:cartItemId', [requireAccessToken, controller.updateItem]) // Update cartItem to Cart
cartRouter.delete('/cart/:cartId/item/:cartItemId', [requireAccessToken, controller.destroyItem])
// cartRouter.delete('/cart/:id', [requireAccessToken, controller.destroy])

export default cartRouter
