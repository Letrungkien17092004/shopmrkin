import { Variant } from "../../core/entities/index.js"

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
    product?: {
        id: string,
        produce_code: number,
        name: string,
        description: string,
        categoryId?: number | null,
        createdAt?: Date,
        updatedAt?: Date
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

        var product: {
            id: string,
            produce_code: number,
            name: string,
            description: string,
            categoryId?: number | null,
            createdAt?: Date,
            updatedAt?: Date
        } | undefined = undefined

        if (variant.user) {
            user = {
                username: variant.user.username,
                role: variant.user.role?.roleName || "null"
            }
        }

        if (variant.product) {
            product = {
                id: variant.product.id,
                produce_code: variant.product.product_code,
                name: variant.product.name,
                description: variant.product.description,
                categoryId: variant.product.categoryId,
                createdAt: variant.product.createdAt,
                updatedAt: variant.product.updatedAt,
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
            product: product,

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