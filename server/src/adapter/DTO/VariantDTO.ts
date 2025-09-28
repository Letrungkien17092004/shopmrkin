import { Variant } from "core/entities/index.js"

type InputParams = {
    name: string,
    sku: string,
    productId: string,
    userId: string,
    price: number,
    stock: number
}

type ToOutput = {
    id: string,
    name: string,
    sku: string,
    productId: string,
    userId: string,
    price: number,
    stock: number,
    
    user?: {
        username: string,
        role: string
    },
    
    createdAt?: Date,
    updatedAt?: Date
}
export default class VariantDTO {

    /**
     * Transfer to input data
     * @param options 
     * @returns 
     */
    static toInputSingle(options: InputParams): Variant {
        return new Variant({
            ...options,
            id: ""
        })
    }

    /**
     * Transfer to output
     * @param options
     * @param options.isSafe hide sensitive data (default true)
     */
    static toOutputSingle(variant: Variant): ToOutput {
        var user: {
            username: string,
            role: string
        } | undefined = undefined

        if (variant.user) {
            user = {
                username: variant.user.username,
                role: variant.user.role?.roleName || "null"
            }
        }
        return {
            id: variant.id,
            name: variant.name,
            sku: variant.sku,
            productId: variant.productId,
            price: variant.price,
            stock: variant.stock,
            userId: variant.userId,
            user: user,

            // time
            createdAt: variant.createdAt,
            updatedAt: variant.updatedAt
        }
    }

    /**
     * Transfer array to output
     * @param options
     * @param options.isSafe hide sensitive data (default true)
     */
    static toOutputMany(variants: Variant[]): ToOutput[] {
        return variants.map(v => VariantDTO.toOutputSingle(v))
    }
}