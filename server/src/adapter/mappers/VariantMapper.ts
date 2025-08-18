import { Variant } from "core/entities/index.js"
import { ProductMapper, ProductOutputSafe } from "./ProductMapper.js"



export type VariantOutputSafe = {
    id: string,
    name: string,
    sku: string,
    productId: string,
    product?: ProductOutputSafe,
    price: number,
    stock: number,
    createdAt: Date,
    updatedAt: Date
}
export class VariantMapper {

    static toOutputSafe(variant: Variant): VariantOutputSafe {
        return {
            id: variant.id,
            name: variant.name,
            sku: variant.sku,
            productId: variant.productId,
            product: variant.product ? ProductMapper.toOutputSafe(variant.product) : undefined,
            price: variant.price,
            stock: variant.stock,
            createdAt: variant.createdAt,
            updatedAt: variant.updatedAt

        }
    }
}