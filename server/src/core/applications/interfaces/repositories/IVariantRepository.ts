import { Variant } from "core/entities/index.js";


export default interface IVariantRepository {
    create(options: Omit<Variant, "id" | "createdAt" | "updatedAt">): Promise<Variant>
    getById(id: string): Promise<Variant | null>
    updateById(id: string, authorId: number, options: Omit<Partial<Variant>, "id">): Promise<Variant>
    deleteById(id: string, authorId: number): Promise<void>
}