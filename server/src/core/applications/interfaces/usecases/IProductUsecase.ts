import { Product } from "core/entities/index.js";

export default interface IProductUsecase {
    create(options: Omit<Product, "id" | "productCode" | "createdAt" | "updatedAt">): Promise<Product>
    getByProductCode(productCode: number): Promise<Product | null>
    getById(id: string): Promise<Product | null>
    updateById(id: string, authorId: number, options: Omit<Partial<Product>, "id">): Promise<Product>
    deleteById(id: string, authorId: number): Promise<void>
}