import { Product } from "../../core/entities/index.js";
import { MediaDTO } from "./index.js"
import { Request } from "express";
type InputParams = {
    product_code: number,
    name: string,
    description: string,
    categoryId: number | null,
    userId: string,
}

type ToOutput = {
    id: string,
    product_code: number,
    name: string,
    description: string,
    // relation
    user?: {
        username: string,
        role: string
    },
    category?: string,
    media?: MediaDTO.OutputType[],
    variants?: {
        id: string,
        name: string,
        sku: string,
        price: number,
        stock: number,
        createdAt?: Date,
        updatedAt?: Date,
    }[],

    // time
    createdAt?: Date,
    updatedAt?: Date
}
export default class ProductDTO {

    /**
     * Transfer to input data
     * @param options 
     * @returns 
     */
    static toInputSingle(options: InputParams): Product {
        return new Product({
            ...options,
            id: ""
        })
    }

    /**
     * Transfer to output
     * @param options
     * @param options.isSafe hide sensitive data (default true)
     */
    static toOutputSingle(product: Product, req: Request): ToOutput {
        var user: {
            username: string,
            role: string
        } | undefined = undefined

        var variants: {
            id: string,
            name: string,
            sku: string,
            price: number,
            stock: number,
            createdAt?: Date,
            updatedAt?: Date,
        }[] = []

        var media: MediaDTO.OutputType[] = []

        if (product.user) {
            user = {
                username: product.user.username,
                role: product.user.role?.roleName || "null"
            }
        }

        if (product.variants) {
            variants = product.variants.map(v => ({
                id: v.id,
                name: v.name,
                sku: v.sku,
                price: v.price,
                stock: v.stock,
                createdAt: v.createdAt,
                updatedAt: v.updatedAt,

            }))
        }

        if (product.media) {
            media = MediaDTO.toOutputMany(product.media, req)
        }
        return {
            id: product.id,
            product_code: product.product_code,
            name: product.name,
            description: product.description,
            // relation
            user: user,
            category: product.category?.name,
            media: media,
            variants: variants,

            // time
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }
    }

    /**
     * Transfer to output
     * @param options
     * @param options.isSafe hide sensitive data (default true)
     */
    static toOutputMany(products: Product[], req: Request): ToOutput[] {
        return products.map(p => ProductDTO.toOutputSingle(p, req))
    }
}