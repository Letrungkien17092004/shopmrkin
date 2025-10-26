import { Router } from "express"
import CartController from "../../adapter/controllers/CartController.js"
import { authorAccessToken } from "../../expressApp/middlewares/author.middlewares.js"
import CartRepository from "../../repositories/CartRepository.js"
import CartUsecase from "../../core/applications/usecases/CartUsecase.js"

const repo = new CartRepository()
const usecase = new CartUsecase(repo)
const controller = new CartController(usecase)

const cartRouter = Router()

// RESTful
cartRouter.post('/cart', [authorAccessToken, controller.store])
cartRouter.get('/cart', [authorAccessToken, controller.showCurrent])
cartRouter.post('/cart/:cartId/items', [authorAccessToken, controller.storeItem])
cartRouter.patch('/cart/:cartId/items/:variantId', [authorAccessToken, controller.updateItem])
cartRouter.delete('/cart/:cartId/items/:variantId', [authorAccessToken, controller.destroyItem])
cartRouter.delete('/cart/:id', [authorAccessToken, controller.destroy])

export default cartRouter
