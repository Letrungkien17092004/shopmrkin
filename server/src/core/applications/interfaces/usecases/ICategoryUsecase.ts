import { Category } from "core/entities/index.js"



export default interface ICategoryUsecase {
    create(options: Omit<Category, "id">): Promise<Category>
    getBySlug(slug: string): Promise<Category>
    update(options: Omit<Partial<Category>, "id">): Promise<Category>
    deleteBySlug(Slug: String): Promise<void>
}