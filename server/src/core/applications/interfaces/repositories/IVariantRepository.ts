import { Variant } from "../../../../core/entities/index.js";

export type SortOrder = "asc" | "desc"

export type IncludeOption = {
    user?: boolean,
    product?: boolean
}

export type OrderByOption = Partial<Record<keyof Omit<Variant, "user" | "product">, SortOrder>>

export default interface IVariantRepository {

    /**
     * Create a Variant
     * @param options 
     */
    create(options: {
        data: Omit<Variant, "id">,
        include?: IncludeOption
    }): Promise<Variant>

    /**
     * Find many variant by attribute name
     * @param options 
     */
    findMany(options: {
        where: Partial<Pick<Variant, "name" | "sku" | "productId" | "userId">>,
        orderBy?: OrderByOption | OrderByOption[],
        include?: IncludeOption,
        limit?: number,
        offset?: number
    }): Promise<Variant[]>

    /**
     * Find one variant by sku value
     * @param options 
     */
    findOneBySku(options: {
        where: { sku: string },
        include?: IncludeOption
    }): Promise<Variant | null>

    /**
     * Find one variant by id value
     * @param options 
     */
    findOneById(options: {
        where: { id: string },
        include?: IncludeOption
    }): Promise<Variant | null>

    /**
     * Update one variant 
     * @param options 
     */
    updateById(options: {
        where: { id: string, userId: string },
        data: { name?: string, sku?: string, price?: number, stock?: number },
    }): Promise<void>

    /**
     * Delete a variant by variant's id and user's id
     * @param options 
     */
    deleteById(options: {
        where: { id: string, userId: string }
    }): Promise<void>
}