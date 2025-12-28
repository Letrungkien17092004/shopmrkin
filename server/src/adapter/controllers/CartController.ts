import { Request, Response } from "express"
import ICartUsecase from "../../core/applications/interfaces/usecases/ICartUsecase.js"
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../../core/applications/interfaces/usecases/errors.js"
import { z, ZodError } from "zod"
import { CartDTO } from "../../adapter/DTO/index.js"

export default class CartController {
    private usecase: ICartUsecase

    constructor(usecase: ICartUsecase) {
        this.usecase = usecase
    }


    /**
     * Retrieves a cart by cartId  
     * GET: /cart/:cartId
     * @param req 
     * @param res 
     * @returns 
     */
    findOneById = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized" })
                return
            }
            const QuerySchema = z.object({
                include: z.object({
                    user: z.string().optional(),
                    cartItem: z.string().optional()
                }).optional()
            }).optional()

            const FindOptionsSchema = z.object({
                where: z.object({
                    id: z.string()
                }),
                include: z.object({
                    user: z.boolean().optional(),
                    cartItem: z.boolean().optional()
                }).optional()
            })

            const queryParsed = QuerySchema.parse(req.query)
            const findOptionsParsed = FindOptionsSchema.parse({
                where: {
                    id: req.params['cartId']
                },
                include: queryParsed && queryParsed.include
                    ? {
                        user: queryParsed.include.user === "true",
                        cartItem: queryParsed.include.cartItem === "true",
                    }
                    : undefined
            })
            if (req.user.role === "administrator") {
                const cart = await this.usecase.findOneById(findOptionsParsed)
                if (!cart) {
                    res.status(404).json({
                        message: "Cart is not found"
                    })
                    return
                }
                res.status(200).json({
                    cart: CartDTO.toOutputSingle(cart, req)
                })
                return
            }
            // verify cart ownership
            const cart = await this.usecase.findOneById(findOptionsParsed)

            if (!cart) {
                res.status(404).json({
                    message: "Cart not found"
                })
                return
            }

            if (cart.userId !== req.user.id) {
                res.status(403).json({
                    message: "Forbidden: you can't update items in other people's cart"
                })
                return
            }
            res.status(200).json({
                cart: CartDTO.toOutputSingle(cart, req)
            })
        } catch (error) {
            if (error instanceof z.ZodError) return void res.status(400).json({ message: "Invalid input" })
            if (error instanceof USECASE_ERROR && error.code === USECASE_ERROR_CODE.INITIAL) return void res.status(500).json({ message: "Server Internal Error!" })
            res.status(500).json({ message: "Server Internal Error!" })
        }
    }

    /**
    * Adds an item to the cart  
    * POST: /cart/:cartId/items
    * @param req 
    * @param res 
    * @returns 
    */
    addItem = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized" })
                return
            }

            const ParamsSchema = z.object({
                cartId: z.string()
            })

            const BodySchema = z.object({
                variantId: z.string(),
                quantity: z.number().int().positive()
            })

            const paramsParsed = ParamsSchema.parse({ cartId: req.params['cartId'] })
            const bodyParsed = BodySchema.parse(req.body)

            // verify cart ownership
            const cart = await this.usecase.findOneById({
                where: {
                    id: req.params['cartId']
                }
            })

            if (!cart) {
                res.status(404).json({
                    message: "Cart not found"
                })
                return
            }

            if (cart.userId !== req.user.id) {
                res.status(403).json({
                    message: "Forbidden: you can't add items to other people's cart"
                })
                return
            }

            await this.usecase.createOrUpdateItem({
                data: {
                    cartId: paramsParsed.cartId,
                    variantId: bodyParsed.variantId,
                    quantity: bodyParsed.quantity
                }
            })

            res.status(201).json({ message: "Item added" })
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: "Invalid input" })
                return
            }
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.INITIAL:
                        res.status(500).json({ message: "Server Internal Error!" })
                        return
                    case USECASE_ERROR_CODE.FK_CONSTRAINT:
                        res.status(404).json({ message: "Cart or Variant not found" })
                        return
                }
            }
            res.status(500).json({ message: "Server Internal Error!" })
        }
    }

    /**
    * Updates item quantity in the cart
    * PUT: /carts/:cartId/items/:cartItemId
    * @param req 
    * @param res 
    * @returns 
    */
    updateItem = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized" })
                return
            }

            const ParamsSchema = z.object({
                cartId: z.string(),
                cartItemId: z.string()
            })

            const BodySchema = z.object({
                quantity: z.number().int().positive(),
            })

            const paramsParsed = ParamsSchema.parse({
                cartId: req.params['cartId'],
                cartItemId: req.params['cartItemId']
            })
            const bodyParsed = BodySchema.parse(req.body)

            // verify cart ownership
            const cart = await this.usecase.findOneById({
                where: {
                    id: paramsParsed.cartId
                }
            })

            if (!cart) {
                res.status(404).json({
                    message: "Cart not found"
                })
                return
            }

            if (cart.userId !== req.user.id) {
                res.status(403).json({
                    message: "Forbidden: you can't update items in other people's cart"
                })
                return
            }


            await this.usecase.updateCartItem({
                where: {
                    cartItemId: paramsParsed.cartItemId,
                    cartId: paramsParsed.cartId
                },
                data: {
                    quantity: bodyParsed.quantity
                }
            })
            res.status(200).json({ message: "Quantity updated" })
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: "Invalid input" })
                return
            }
            if (error instanceof USECASE_ERROR) {
                if (error.code === USECASE_ERROR_CODE.FK_CONSTRAINT) {
                    res.status(404).json({ message: "Cart or Variant not found" })
                    return
                }
                if (error.code === USECASE_ERROR_CODE.INITIAL) {
                    res.status(500).json({ message: "Server Internal Error!" })
                    return
                }
            }
            res.status(500).json({ message: "Server Internal Error!" })
        }
    }

    /**
     * Delete item
     * DELETE: /carts/:cartId/items/:cartItemId
     * @param req 
     * @param res 
     * @returns 
     */
    deleteItem = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) return void res.status(401).json({ message: "Unauthorized" })


            const ownCart = await this.usecase.findOneById({
                where: {
                    id: req.params["cartId"]
                }
            })

            if (!ownCart) {
                res.status(404).json({
                    message: "Cart is not found"
                })
                return
            }
            if (ownCart.userId !== req.user.id) {
                res.status(403).json({ message: "Forbidden" })
                return
            }

            await this.usecase.removeItem({
                where: {
                    cartId: req.params["cartId"],
                    userId: req.user.id,
                    cartItemId: req.params["cartItemId"]
                }
            })
            res.status(200).json({ message: "Item removed" })
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: "Invalid input" })
                return
            }
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.INITIAL:
                        res.status(500).json({
                            message: "Server Internal Error"
                        })
                        return
                    case USECASE_ERROR_CODE.NOTFOUND:
                        res.status(404).json({
                            message: "cartItem is not found or you aren't owner"
                        })
                        return
                }
            }
            res.status(500).json({ message: "Server Internal Error!" })
        }
    }

    /**
     * Clear all cartItem with cartId
     * DELETE: /carts/:cartId/items
     * @param req 
     * @param res 
     */
    clearCart = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized" })
                return
            }

            const ParamsSchema = z.object({
                cartId: z.string()
            })

            const paramsParsed = ParamsSchema.parse(req.params)

            const ownCart = await this.usecase.findOneById({
                where: {
                    id: paramsParsed.cartId
                }
            })

            if (!ownCart) {
                res.status(404).json({
                    message: "Cart is not found"
                })
                return
            }
            if (ownCart.userId !== req.user.id) {
                res.status(403).json({ message: "Forbidden" })
                return
            }

            this.usecase.clear({
                where: {
                    cartId: ownCart.id
                }
            })
            res.status(200).json({
                message: "Delete successful"
            })
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: "invalid params"
                })
            }
            res.status(500).json({
                message: "Something went wrong"
            })
        }
    }
}
