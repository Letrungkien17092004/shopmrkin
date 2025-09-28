import { Variant } from "core/entities/index.js";


export default interface IVariantUsecase {
    create(options: Omit<Variant, "id"> & { include?: boolean }): Promise<Variant>
    findMany(options: { fields: Partial<Pick<Variant, "name" | "sku" | "productId" | "userId">>, orderBy?: [{createdAt: "asc"} | {createdAt: "desc"} | {updatedAt: "asc"} | {updatedAt: "desc"}], limit?: number, offset?: number, include?: boolean }): Promise<Variant[]>
    findOneBySku(options: { sku: string, include?: boolean }): Promise<Variant | null>
    findOneById(options: { id: string, include?: boolean }): Promise<Variant | null>
    updateById(options: { id: string, userId: string, fields: Partial<Omit<Variant, "id">>, include?: boolean }): Promise<Variant>
    deleteById(options: { id: string, userId: string }): Promise<void>
}