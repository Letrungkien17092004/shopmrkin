import { Category } from "core/entities/index.js";
import { PrismaClient } from "services/postgresSQL/generated/prisma/client/index.js";
import ICategoryRepository from "core/applications/interfaces/repositories/ICategoryRepository.js";
import { baseExceptionHandler } from "core/applications/interfaces/repositories/errors.js";

const prisma = new PrismaClient()
export default class CategoryRepository implements ICategoryRepository {

    /**
     * Creates a new category in the database.
     *
     * @param options - The category data excluding the `id` property.
     * @returns A promise that resolves to the newly created `Category` instance.
     * @throws Will throw an error if the creation fails.
     */
    async create(options: Omit<Category, "id">): Promise<Category> {
        try {
            const createdCategory = await prisma.categories.create({
                data: {
                    name: options.name,
                    slug: options.slug
                }
            })
            return new Category(createdCategory)

        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
    * Retrieves a category from the database by its slug.
    *
    * @param slug - The unique slug identifier of the category.
    * @returns A promise that resolves to the `Category` instance if found, or `null` if not found.
    * @throws Will throw an error if the retrieval fails.
    */
    async getBySlug(slug: string): Promise<Category | null> {
        try {
            const getResult = await prisma.categories.findUnique({
                where: {
                    slug: slug
                }
            })

            if (getResult) {
                return new Category(getResult)
            } return null
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }


    /**
     * Updates an existing category in the database by its ID.
     *
     * @param id - The unique identifier of the category to update.
     * @param options - An object containing the fields to update (excluding the `id` property).
     * @returns A promise that resolves to the updated `Category` instance.
     * @throws Will throw an error if the update fails.
     */
    async updateById(id: number, options: Omit<Partial<Category>, "id">): Promise<Category> {
        try {
            const updatedCategory = await prisma.categories.update({
                where: {
                    id: id
                },
                data: {
                    name: options.name,
                    slug: options.slug
                }
            })
            return new Category(updatedCategory)
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }


    /**
     * Deletes a category from the database by its ID.
     *
     * @param id - The unique identifier of the category to delete.
     * @returns A promise that resolves when the category has been deleted.
     * @throws Will throw an error if the deletion fails.
     */
    async deleteById(id: number): Promise<void> {
        try {
            const status = await prisma.categories.delete({
                where: {
                    id: id
                }
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
}