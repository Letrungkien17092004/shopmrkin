import Cart from "../../../../core/entities/Cart.js"

export default interface ICartRepository {
    create(options: Omit<Cart, "id">): Promise<Cart>
    findOneByUserId(options: { userId: string, include?: boolean }): Promise<Cart | null>
    addItem(options: { cartId: string, variantId: string, quantity: number }): Promise<void>
    removeItem(options: { cartId: string, variantId: string }): Promise<void>
    deleteById(options: { id: string, userId: string }): Promise<void>
}
