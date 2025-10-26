import { PrismaClient } from "@prisma/client"
import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js"
import Cart from "../core/entities/Cart.js"
import CartItem from "../core/entities/CartItem.js"
import User from "../core/entities/User.js"
import Variant from "../core/entities/Variant.js"
import ICartRepository from "../core/applications/interfaces/repositories/ICartRepository.js"

const prisma = new PrismaClient()

export default class CartRepository implements ICartRepository {

    async create(options: Omit<Cart, "id">): Promise<Cart> {
        try {
            const created = await prisma.carts.create({ data: { userId: options.userId } })
            return new Cart({ ...created })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    async findOneByUserId(options: { userId: string, include?: boolean }): Promise<Cart | null> {
        try {
            const include = options.include || false
            if (!include) {
                const found = await prisma.carts.findUnique({ where: { userId: options.userId } })
                return found ? new Cart({ ...found }) : null
            }

            const found = await prisma.carts.findUnique({
                where: { userId: options.userId },
                include: {
                    user: true,
                    cartItems: {
                        include: {
                            variant: true
                        }
                    }
                }
            })

            if (!found) return null

            const cartItems = found.cartItems.map(ci => new CartItem({
                id: ci.id,
                cartId: ci.cartId,
                variantId: ci.variantId,
                quantity: ci.quantity,
                variant: ci.variant ? new Variant({ ...ci.variant, price: Number((ci.variant as any).price) }) : undefined
            }))

            const user = found.user ? new User({ ...found.user }) : undefined

            return new Cart({ ...found, cartItems: cartItems, user: user })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    async addItem(options: { cartId: string, variantId: string, quantity: number }): Promise<void> {
        try {
            await prisma.cartItems.create({ data: { cartId: options.cartId, variantId: options.variantId, quantity: options.quantity } })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    async removeItem(options: { cartId: string, variantId: string }): Promise<void> {
        try {
            // use deleteMany to avoid needing composite key input name
            await prisma.cartItems.deleteMany({ where: { cartId: options.cartId, variantId: options.variantId } })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    async deleteById(options: { id: string, userId: string }): Promise<void> {
        try {
            await prisma.carts.delete({ where: { id: options.id, userId: options.userId } as any })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
}
