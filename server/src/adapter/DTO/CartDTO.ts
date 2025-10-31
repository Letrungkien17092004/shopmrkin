import { Cart, CartItem, Product } from "../../core/entities/index.js"

type InputParams = {
    userId: string
}
type Item = {
    id: string,
    variantId: string,
    quantity: number,
    variant_name?: string,
    variant_sku?: string,
    variant_price?: number,
    variant_stock?: number,
    product_id?: string,
    product_name?: string,
    product_description?: string,
}
type ToOutput = {
    id: string,
    userId: string,
    cartItems?: Item[],
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
        var items: Item[] = []
        if (cart.cartItems) {
            items = cart.cartItems.map(ci => {
                const variant = ci.variant
                const product = ci.variant?.product

                return {
                    id: ci.id,
                    variantId: ci.variantId,
                    quantity: ci.quantity,
                    variant_name: variant?.name,
                    variant_sku: variant?.sku,
                    variant_price: variant?.price,
                    variant_stock: variant?.stock,
                    product_id: variant?.product?.id,
                    product_name: variant?.product?.name,
                    product_description: variant?.product?.description,
                }
            })
        }
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
