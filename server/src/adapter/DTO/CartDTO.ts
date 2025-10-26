import Cart from "../../core/entities/Cart.js"
import CartItem from "../../core/entities/CartItem.js"

type InputParams = {
    userId: string
}

type ToOutput = {
    id: string,
    userId: string,
    cartItems?: {
        id: string,
        variantId: string,
        quantity: number,
        variant?: {
            id: string,
            name: string,
            sku: string,
            price: number,
            stock: number
        }
    }[],
    createdAt?: Date,
    updatedAt?: Date
}

export default class CartDTO {
    static toInputSingle(options: InputParams): Cart {
        return new Cart({
            id: "",
            userId: options.userId
        })
    }

    static toOutputSingle(cart: Cart): ToOutput {
        const items = cart.cartItems ? cart.cartItems.map(ci => ({
            id: ci.id,
            variantId: ci.variantId,
            quantity: (ci as any).quantity || 1,
            variant: ci.variant ? {
                id: ci.variant.id,
                name: ci.variant.name,
                sku: ci.variant.sku,
                price: ci.variant.price,
                stock: ci.variant.stock
            } : undefined
        })) : undefined

        return {
            id: cart.id,
            userId: cart.userId,
            cartItems: items,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt
        }
    }

    static toOutputMany(carts: Cart[]): ToOutput[] {
        return carts.map(c => CartDTO.toOutputSingle(c))
    }
}
