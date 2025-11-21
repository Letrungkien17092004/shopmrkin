// Rewritten ICartRepository
import Cart from "../../../../core/entities/Cart.js"


/**
 * Defines the relations (includes) that can be loaded along with the Cart.
 * Used for findOne/findMany methods.
 */
export type IncludeOption = {
    cartItem?: boolean
    user?: boolean
};

export default interface ICartRepository {

    /**
     * Finds a single Cart by the unique ID of the cart
     * @param options The search options.
     * @param options.userId The ID of the user to find the Cart for.
     * @param options.include The relations to load along with the result.
     * @returns A Promise that resolves to the Cart object if found, or null otherwise.
     */
    findOneById(options: {
        where: { id: string },
        include?: IncludeOption
    }): Promise<Cart | null>

    /**
     * Finds a single Cart by the unique ID of the owning user.
     * @param options 
     */
    findOneByUserId(options: {
        where: { userId: string },
        include?: IncludeOption
    }): Promise<Cart | null>

    /**
     * Adds a new item (CartItem) to the Cart or updates the quantity if the item already exists.
     * @param options The options for adding the item.
     * @param options.cartId The ID of the Cart to add the item to.
     * @param options.variantId The ID of the ProductVariant to add.
     * @param options.quantity The quantity to add/update.
     * @returns A Promise that resolves to void.
     */
    createOrUpdateItem(options: {
        data: {
            cartId: string,
            variantId: string,
            quantity: number
        }
    }): Promise<void>

    /**
     * Update a cart item (can only change quantity)
     * @param options 
     */
    updateCartItem(options: {
        where: {
            cartId: string
            cartItemId: string,
        },
        data: { quantity: number; },
    }): Promise<void>

    /**
     * Removes a specific item (CartItem) from the Cart.
     * @param options The options for removing the item.
     * @param options.cartId The ID of the Cart containing the item.
     * @param options.variantId The ID of the ProductVariant to remove.
     * @returns A Promise that resolves to void.
     */
    removeItem(options: {
        where: {
            cartId: string,
            cartItemId: string,
            userId: string
        }
    }): Promise<void>

    /**
     * clear all item in cart
     * @returns A Promise that resolves to void upon successful deletion.
     */
    clear(options: {
        where: {
            cartId: string
        }
    }): Promise<void>
}