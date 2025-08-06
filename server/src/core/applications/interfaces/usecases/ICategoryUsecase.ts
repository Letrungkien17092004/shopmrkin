import { Category } from "core/entities/index.js"



export default interface ICategoryUsecase {
    create(options: Omit<Category, "id">): Promise<Category>
    getBySlug(slug: string): Promise<Category | null>
    updateById(id: number, options: Omit<Partial<Category>, "id">): Promise<Category>
    deleteById(id: number): Promise<void>
}