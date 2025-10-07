import axios from "axios"
import { ENV } from "../config/ENV.ts"
import AuthService from "./AuthService.ts"

const authService = new AuthService()

export function validVariant(variant: Variant): boolean {
    if (variant.name.length < 5) return false
    if (variant.sku.length < 5) return false
    if (variant.price < 0) return false
    if (variant.stock < 0) return false
    return true
}


type VariantResponse = {
    id: string
    name: string
    sku: string
    productId: string
    userId: string
    price: number
    stock: number

    user?: {
        username: string
        role?: string
    }

    createdAt?: string
    updatedAt?: string
}

type VariantConstructorParam = {
    id: string
    name: string
    sku: string
    productId: string
    userId: string
    price: number
    stock: number

    user?: {
        username: string
        role?: string
    }

    createdAt?: Date
    updatedAt?: Date
}

export class Variant {
    id: string
    name: string
    sku: string
    productId: string
    userId: string
    price: number
    stock: number

    user?: {
        username: string
        role?: string
    }

    createdAt?: Date
    updatedAt?: Date

    constructor(options: VariantConstructorParam) {
        this.id = options.id
        this.name = options.name
        this.sku = options.sku
        this.price = options.price
        this.stock = options.stock
        this.userId = options.userId
        this.user = options.user
        this.productId = options.productId
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
    }
}


export default class VariantService {

    /**
     * Create a Variant
     * @param options 
     */
    async create(options: Omit<Variant, "id">): Promise<Variant> {
        try {
            if (authService.accessIsExpired()) {
                await authService.refeshAccess()
            }
            const response = await axios.post<{ variant: VariantResponse }>(`${ENV.BACK_END_HOST}/api/variant`,
                {
                    name: options.name,
                    sku: options.sku,
                    price: options.price,
                    stock: options.stock,
                    productId: options.productId,

                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authService.getAccessToken()}`
                    }
                }
            )
            console.log("variant response: ", response.data)
            const variant = response.data.variant
            return new Variant({
                id: variant.id,
                name: variant.name,
                sku: variant.sku,
                price: variant.price,
                stock: variant.stock,
                productId: variant.productId,
                userId: variant.userId,
                createdAt: new Date(variant.createdAt || ""),
                updatedAt: new Date(variant.updatedAt || "")
            })
        } catch (error) {
            console.log(error)
            throw error
        }
    }


    /**
     * Retrieve variant of product by productId
     * @param productId 
     * @returns 
     */
    async getManyByProductId(productId: string): Promise<Variant[]> {
        try {
            const response = await axios.get<{variants: VariantResponse[]}>(`${ENV.BACK_END_HOST}/api/variant?productId=${productId}`)
            const variants = response.data.variants
            return variants.map(v => new Variant({
                id: v.id,
                name: v.name,
                sku: v.sku,
                price: v.price,
                stock: v.stock,
                productId: v.productId,
                userId: v.userId
            }))
        } catch (error) {
            throw error
        }
    }

    /**
     * Update a variant by variant's ID, SKU can't be changed for now
     * @param id 
     * @param options 
     * @returns 
     */
    async updateById(id: string, options: Partial<Omit<Variant, "id" | "productId">>): Promise<Variant> {
        try {
            if (authService.accessIsExpired()) {
                await authService.refeshAccess()
            }
            const response = await axios.put<{variant: VariantResponse}>(`${ENV.BACK_END_HOST}/api/variant/${id}`,
                {
                    name: options.name,
                    price: options.price,
                    stock: options.stock

                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authService.getAccessToken()}`
                    }
                }
            )
            const variantData = response.data.variant
            return new Variant({
                id: variantData.id,
                name: variantData.name,
                sku: variantData.sku,
                price: variantData.price,
                stock: variantData.stock,
                productId: variantData.productId,
                userId: variantData.userId
            })
        } catch (error) {
            throw error
        }
    }

    async deleteById(id: string): Promise<void> {
        try {
            const response = await axios.delete(`${ENV.BACK_END_HOST}/api/variant/${id}`, 
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`
                    }
                }
            )
            console.log("Delete Variant response: ", response)
        } catch (error) {
            throw error
        }
    }
}

