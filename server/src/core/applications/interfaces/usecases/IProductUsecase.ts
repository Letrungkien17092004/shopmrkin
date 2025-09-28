import { Product } from "core/entities/index.js";

export default interface IProductUsecase {
    create(options: Omit<Product, "id" | "product_code" | "createdAt" | "updatedAt"> & { include?: boolean }): Promise<Product>
    findMany(options: { fields: Partial<Pick<Product, "userId" | "categoryId">>, orderBy?: [{createdAt: "asc"} | {createdAt: "desc"} | {updatedAt: "asc"} | {updatedAt: "desc"}], limit?: number, offset?: number, include?: boolean }): Promise<Product[]>
    findOneByCode(options: { product_code: number, include?: boolean }): Promise<Product | null>
    findOneById(options: { id: string, include?: boolean }): Promise<Product | null>
    updateById(options: { id: string, userId: string, fields: Partial<Omit<Product, "id">>, include?: boolean }): Promise<Product>
    deleteById(options: { id: string, userId: string }): Promise<void>
}