import { Product } from "core/entities/index.js"
import { VariantMapper, VariantOutputSafe } from "./VariantMapper.js"


// all property
export type ProductOutputSafe = {
    id: string,
    name: string,
    description: string,
    categoryId: number,
    variants?: VariantOutputSafe[],
    createdAt: Date,
    updatedAt: Date
}

export class ProductMapper {

    // convert Product entity to Framework output
    static toOutputSafe(product: Product): ProductOutputSafe {
        const variants = product.variants?.map(v => VariantMapper.toOutputSafe(v))
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            categoryId: product.categoryId,
            variants: variants,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }
    }

    // convert Product entity to Framework output
    static toOutputSafeArr(products?: Product[]): ProductOutputSafe[] | undefined {
        if (!products) {
            return undefined
        }
        return products.map(p => ProductMapper.toOutputSafe(p))
    }
}
