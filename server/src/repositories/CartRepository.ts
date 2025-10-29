import { Prisma, PrismaClient } from "@prisma/client"
import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js"
import Cart from "../core/entities/Cart.js"
import CartItem from "../core/entities/CartItem.js"
import User from "../core/entities/User.js"
import Variant from "../core/entities/Variant.js"
import ICartRepository, {CartIncludeOption} from "../core/applications/interfaces/repositories/ICartRepository.js"

const prisma = new PrismaClient()

export default class CartRepository implements ICartRepository {

    /**
     * Creates a new Cart entity in the database for a User.
     * @param options The options for creating the Cart.
     * @param options.data The data for the new Cart, excluding 'id'. Typically contains only 'userId'.
     * @param options.include The relations (user, cartItem) to load along with the created result.
     * @returns A Promise that resolves to the newly created Cart object.
     */
    async create(options: { 
            data: { userId: string },
            include?: CartIncludeOption
        }): Promise<Cart> {
        try {
            const created = await prisma.carts.create(options)
            return new Cart({ ...created })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Finds a single Cart by the unique ID of the owning user.
     * @param options The search options.
     * @param options.userId The ID of the user to find the Cart for.
     * @param options.include The relations to load along with the result.
     * @returns A Promise that resolves to the Cart object if found, or null otherwise.
     */
    async findOneByUserId(options: {
        userId: string,
        include?: CartIncludeOption
    }): Promise<Cart | null> {
        try {
            if (options.include) {
                const found = await prisma.carts.findUnique({
                    where: { userId: options.userId },
                    relationLoadStrategy: "join",
                    include: {
                        user: options.include.user,
                        cartItems: options.include.cartItem
                            ? { include: { variant: true } }
                            : false
                    }
                });
                if (!found) return null;

                type CartItemWithVariant = Prisma.CartItemsGetPayload<{
                    include: { variant: true }
                }>

                const cartItems = options.include.cartItem && found.cartItems
                    ? (found.cartItems as CartItemWithVariant[]).map(ci => new CartItem({
                        id: ci.id,
                        cartId: ci.cartId,
                        variantId: ci.variantId,
                        quantity: ci.quantity,
                        variant: ci.variant ? new Variant({
                            id: ci.variant.id,
                            name: ci.variant.name,
                            sku: ci.variant.id,
                            productId: ci.variant.productId,
                            userId: ci.variant.userId,
                            price: Number(ci.variant.price),
                            stock: ci.variant.stock
                        })
                            : undefined
                    }))
                    : undefined

                // Map user if included
                const user = found.user
                    ? new User({ ...found.user })
                    : undefined;

                return new Cart({
                    ...found,
                    cartItems: cartItems,
                    user: user
                });
            }

            const found = await prisma.carts.findUnique({
                where: {
                    userId: options.userId
                }
            })

            if (!found) { return null }
            return new Cart({
                id: found.id,
                userId: found.userId
            })


        } catch (error) {
            throw baseExceptionHandler(error);
        }
    }

    /**
     * Adds a new item (CartItem) to the Cart or updates the quantity if the item already exists.
     * @param options The options for adding the item.
     * @param options.cartId The ID of the Cart to add the item to.
     * @param options.variantId The ID of the ProductVariant to add.
     * @param options.quantity The quantity to add/update.
     * @returns A Promise that resolves to void.
     */
    async addItem(options: { cartId: string, variantId: string, quantity: number }): Promise<void> {
        try {
            await prisma.cartItems.create({ data: { cartId: options.cartId, variantId: options.variantId, quantity: options.quantity } })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Removes a specific item (CartItem) from the Cart.
     * @param options The options for removing the item.
     * @param options.cartId The ID of the Cart containing the item.
     * @param options.variantId The ID of the ProductVariant to remove.
     * @returns A Promise that resolves to void.
     */
    async removeItem(options: { cartId: string, variantId: string }): Promise<void> {
        try {
            // use deleteMany to avoid needing composite key input name
            await prisma.cartItems.deleteMany({ where: { cartId: options.cartId, variantId: options.variantId } })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Deletes a Cart based on its ID and a userId for ownership validation.
     * @param options The deletion options.
     * @param options.where The condition to find the Cart to delete (id and userId).
     * @returns A Promise that resolves to void upon successful deletion.
     */
    async deleteById(options: {
        where: { id: string, userId: string }
    }): Promise<void> {
        try {
            await prisma.carts.delete(options)
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
}
