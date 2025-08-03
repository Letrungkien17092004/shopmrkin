import { Product } from "core/entities/index.js";


export default interface IProductRepository {
    create(options: Omit<Product, "id">): Promise<Product>
    getByProductCode(productCode: number): Promise<Product>
    getById(id: string): Promise<Product>
    updateById(id: string, authorId: number): Promise<Product>
    deleteById(id: string, authorId: number): Promise<void>
}