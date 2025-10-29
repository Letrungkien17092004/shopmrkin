import { Request, Response } from "express"
import ICartUsecase from "../../core/applications/interfaces/usecases/ICartUsecase.js"
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../../core/applications/interfaces/usecases/errors.js"
import { z } from "zod"
import { CartDTO } from "../../adapter/DTO/index.js"

/**
 * RESTful CartController
 *
 * Routes mapping suggestion (register in router):
 * POST   /cart                       -> store
 * GET    /cart                       -> showCurrent (or index for admin)
 * POST   /cart/:cartId/items         -> storeItem
 * PATCH  /cart/:cartId/items/:variantId -> updateItem
 * DELETE /cart/:cartId/items/:variantId -> destroyItem
 * DELETE /cart/:id                  -> destroy
 */
export default class CartController {
    private usecase: ICartUsecase

    constructor(usecase: ICartUsecase) {
        this.usecase = usecase
    }

    // POST /cart
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) return void res.status(401).json({ message: "Unauthorized" })

            const created = await this.usecase.create({ userId: req.user.id })
            res.status(201).json({ cart: CartDTO.toOutputSingle(created) })
        } catch (error) {
            if (error instanceof USECASE_ERROR && error.code === USECASE_ERROR_CODE.INITIAL) {
                return void res.status(500).json({ message: "Server Internal Error!" })
            }
            res.status(500).json({ message: "Server Internal Error!" })
        }
    }

    // GET /cart (current user's cart) or admin can pass ?userId=
    getOneByUserId = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) return void res.status(401).json({ message: "Unauthorized" })


            const rawInclude = req.query.include as Object as { user: string, cartItem: string }
            let include: { user: boolean, cartItem: boolean } | undefined
            if (rawInclude && typeof rawInclude === "object") {
                include = {
                    user: rawInclude.user === "true",
                    cartItem: rawInclude.cartItem === "true"
                }
            }
            const FindSchema = z.object({
                userId: z.string().optional(),
                include: z.object({
                    user: z.boolean(),
                    cartItem: z.boolean()
                }).optional()
            })
            const parsed = FindSchema.parse({ userId: req.query.userId, include: include })

            const targetUserId = (req.user.role.toLowerCase() === "administrator" && parsed.userId) ? parsed.userId : req.user.id

            const cart = await this.usecase.findOneByUserId({ userId: targetUserId, include: parsed.include })
            if (!cart) return void res.status(404).json({ message: "Cart not found" })

            res.status(200).json({ cart: CartDTO.toOutputSingle(cart) })
        } catch (error) {
            if (error instanceof z.ZodError) return void res.status(400).json({ message: "Invalid input" })
            if (error instanceof USECASE_ERROR && error.code === USECASE_ERROR_CODE.INITIAL) return void res.status(500).json({ message: "Server Internal Error!" })
            res.status(500).json({ message: "Server Internal Error!" })
        }
    }

    // POST /cart/:cartId/items
    addItem = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) return void res.status(401).json({ message: "Unauthorized" })

            const Schema = z.object({ cartId: z.string(), variantId: z.string(), quantity: z.number().int().positive().optional() })
            const parsed = Schema.parse({ cartId: req.params.cartId, variantId: req.body.variantId, quantity: req.body.quantity })

            // ownership check: non-admin must operate on their own cart
            if (req.user.role.toLowerCase() !== "administrator") {
                const ownCart = await this.usecase.findOneByUserId({ userId: req.user.id })
                if (!ownCart || ownCart.id !== parsed.cartId) return void res.status(403).json({ message: "Forbidden" })
            }

            await this.usecase.addItem({ cartId: parsed.cartId, variantId: parsed.variantId, quantity: parsed.quantity || 1 })
            res.status(201).json({ message: "Item added" })
        } catch (error) {
            if (error instanceof z.ZodError) return void res.status(400).json({ message: "Invalid input" })
            if (error instanceof USECASE_ERROR) {
                if (error.code === USECASE_ERROR_CODE.CONSTRAINT) return void res.status(404).json({ message: "Cart or Variant not found" })
                if (error.code === USECASE_ERROR_CODE.INITIAL) return void res.status(500).json({ message: "Server Internal Error!" })
            }
            res.status(500).json({ message: "Server Internal Error!" })
        }
    }

    // PATCH /cart/:cartId/items/:variantId
    // update quantity (if quantity <=0 => remove)
    updateItem = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) return void res.status(401).json({ message: "Unauthorized" })

            const Schema = z.object({ cartId: z.string(), variantId: z.string(), quantity: z.number().int().optional() })
            const parsed = Schema.parse({ cartId: req.params.cartId, variantId: req.params.variantId, quantity: req.body.quantity })

            if (req.user.role.toLowerCase() !== "administrator") {
                const ownCart = await this.usecase.findOneByUserId({ userId: req.user.id })
                if (!ownCart || ownCart.id !== parsed.cartId) return void res.status(403).json({ message: "Forbidden" })
            }

            const qty = parsed.quantity ?? 1
            if (qty <= 0) {
                await this.usecase.removeItem({ cartId: parsed.cartId, variantId: parsed.variantId })
                return void res.status(200).json({ message: "Item removed" })
            }

            // simple approach: remove existing then add with new quantity
            await this.usecase.removeItem({ cartId: parsed.cartId, variantId: parsed.variantId })
            await this.usecase.addItem({ cartId: parsed.cartId, variantId: parsed.variantId, quantity: qty })
            res.status(200).json({ message: "Quantity updated" })
        } catch (error) {
            if (error instanceof z.ZodError) return void res.status(400).json({ message: "Invalid input" })
            res.status(500).json({ message: "Server Internal Error!" })
        }
    }

    // DELETE /cart/:cartId/items/:variantId
    destroyItem = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) return void res.status(401).json({ message: "Unauthorized" })

            const Schema = z.object({ cartId: z.string(), variantId: z.string() })
            const parsed = Schema.parse({ cartId: req.params.cartId, variantId: req.params.variantId })

            if (req.user.role.toLowerCase() !== "administrator") {
                const ownCart = await this.usecase.findOneByUserId({ userId: req.user.id })
                if (!ownCart || ownCart.id !== parsed.cartId) return void res.status(403).json({ message: "Forbidden" })
            }

            await this.usecase.removeItem({ cartId: parsed.cartId, variantId: parsed.variantId })
            res.status(200).json({ message: "Item removed" })
        } catch (error) {
            if (error instanceof z.ZodError) return void res.status(400).json({ message: "Invalid input" })
            res.status(500).json({ message: "Server Internal Error!" })
        }
    }

    // DELETE /cart/:id
    destroy = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) return void res.status(401).json({ message: "Unauthorized" })

            const id = req.params['id']
            await this.usecase.deleteById({ id: id, userId: req.user.id })
            res.status(200).json({ message: "OK" })
        } catch (error) {
            if (error instanceof USECASE_ERROR && error.code === USECASE_ERROR_CODE.NOTFOUND) return void res.status(404).json({ message: "Cart not found or you don't own this resource" })
            res.status(500).json({ message: "Server Internal Error!" })
        }
    }
}
