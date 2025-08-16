import { Product } from "core/entities/index.js"



// all property
export type ProductOutputSafe = {
    id: string,
    name: string,
    description: string,
    categoryId: number,
    variants?: object[],
    createdAt: Date,
    updatedAt: Date
}

// convert Product entity to Framework output
export function ToOutputSafe(product: Product): ProductOutputSafe {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        variants: product.variants,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
    }
}