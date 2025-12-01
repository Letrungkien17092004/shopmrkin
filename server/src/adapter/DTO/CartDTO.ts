import { Cart, CartItem, Product } from "../../core/entities/index.js"
import { ENV } from "../../config/env.js"

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
    media?: { filePath: string, hostname: string, type: string }
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
                if (variant && product && product.media) {
                    return {
                        id: ci.id,
                        variantId: variant.id,
                        quantity: ci.quantity,
                        variant_name: variant.name,
                        variant_sku: variant.sku,
                        variant_price: variant.price,
                        variant_stock: variant.stock,
                        product_id: product.id,
                        product_name: product.name,
                        product_description: product.description,
                        media: {
                            filePath: product.media[0].filePath,
                            hostname: ENV.SERVER_NAME,
                            type: product.media[0].media_type
                        }
                    }
                }
                return {
                    id: ci.id,
                    variantId: ci.variantId,
                    quantity: ci.quantity,
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
