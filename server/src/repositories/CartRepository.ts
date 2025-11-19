import { Prisma, PrismaClient } from "@prisma/client"
import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js"
import { Cart, CartItem, Product, User, Variant } from "../core/entities/index.js"
import ICartRepository, { IncludeOption } from "../core/applications/interfaces/repositories/ICartRepository.js"

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
    }): Promise<Cart> {
        try {
            const created = await prisma.carts.create({
                data: options.data,
            })
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
    async findOneById(options: {
        where: { id: string },
        include?: IncludeOption
    }): Promise<Cart | null> {
        try {
            if (options.include) {
                if (options.include.cartItem) {
                    const found = await prisma.carts.findUnique({
                        where: options.where,
                        relationLoadStrategy: "join",
                        include: {
                            user: options.include.user,
                            cartItems: {
                                include: {
                                    variant: {
                                        include: {
                                            product: true
                                        }
                                    }
                                }
                            }
                        }
                    });
                    if (!found) return null;
                    const cartItems = found.cartItems.map(ci => new CartItem({
                        id: ci.id,
                        cartId: ci.cartId,
                        variantId: ci.variantId,
                        quantity: ci.quantity,
                        variant: new Variant({
                            id: ci.variant.id,
                            name: ci.variant.name,
                            sku: ci.variant.sku,
                            price: Number(ci.variant.price),
                            stock: ci.variant.stock,
                            productId: ci.variant.productId,
                            userId: ci.variant.userId,
                            product: new Product(ci.variant.product)
                        })
                    }))
                    return new Cart({
                        ...found,
                        cartItems: cartItems
                    })
                } // end if
                const found = await prisma.carts.findUnique({
                    where: options.where,
                    relationLoadStrategy: "join",
                    include: {
                        user: options.include.user,
                    }
                });

                console.log("log in cartRepo 1")
                console.log(found)
                if (!found) return null;
                return new Cart(found);
            }

            const found = await prisma.carts.findUnique({
                where: options.where
            })
            console.log("log in cartRepo 2")
            console.log(found)
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
     * Finds a single Cart by the unique ID of the owning user.
     * @param options 
     */
    async findOneByUserId(options: {
        where: { userId: string },
        include?: IncludeOption
    }): Promise<Cart | null> {
        try {
            const found = await prisma.carts.findUnique({
                where: options.where
            })

            if (!found) { return null }
            return new Cart({
                id: found.id,
                userId: found.userId
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Adds a new item (CartItem) to the Cart or updates the quantity if the item already exists.  
     * NOTE: this is upsert query
     * @param options The options for adding the item.
     * @param options.cartId The ID of the Cart to add the item to.
     * @param options.variantId The ID of the ProductVariant to add.
     * @param options.quantity The quantity to add/update.
     * @returns A Promise that resolves to void.
     */
    async createOrUpdateItem(options: {
        data: {
            cartId: string,
            variantId: string,
            quantity: number
        }
    }): Promise<void> {
        try {
            await prisma.cartItems.upsert({
                where: {
                    cartId_variantId: {
                        cartId: options.data.cartId,
                        variantId: options.data.variantId
                    },
                },
                update: {
                    quantity: options.data.quantity
                },
                create: {
                    cartId: options.data.cartId,
                    variantId: options.data.variantId,
                    quantity: options.data.quantity,
                }
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }


    async updateCartItem(options: {
        where: {
            cartId: string
            cartItemId: string,
        },
        data: { quantity: number; },
    }): Promise<void> {
        try {
            await prisma.cartItems.update({
                where: {
                    id: options.where.cartItemId,
                    cartId: options.where.cartId
                },
                data: options.data
            })
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
    async removeItem(options: {
        where: {
            cartId: string,
            cartItemId: string,
            userId: string
        }
    }): Promise<void> {
        try {
            await prisma.cartItems.delete({
                where: {
                    cart: {
                        id: options.where.cartId,
                        userId: options.where.userId
                    },
                    id: options.where.cartItemId,
                    cartId: options.where.cartId
                }
            })
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
