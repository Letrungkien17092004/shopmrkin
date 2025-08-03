import { Variant } from "core/entities/index.js";


export default interface IVariantRepository {
    create(options: Omit<Variant, "id">): Promise<Variant>
    getById(id: string): Promise<Variant>
    updateById(id: string, authorId: number): Promise<Variant>
    deleteByID(id: string, authorId: number): Promise<void>
}