import { Product } from "../../../../core/entities/index.js";

export type SortOrder = 'asc' | 'desc';

export type IncludeOption = {
    variants?: boolean,
    media?: boolean,
    category?: boolean,
    user?: boolean,
    productEmbeddings?: boolean
};

export type OrderByOption = Partial<Record<keyof Omit<Product, "user" | "category" | "media" | "variants">, SortOrder>>;


export default interface IProductRepository {
    /**
     * Creates a new Product entity in the database.
     * @param options The options for creating the Product.
     * @param options.field The data for the new Product, excluding 'id' and 'product_code'. Equivalent to Prisma's 'data'.
     * @param options.include The relations (variant, media, category, user) to load along with the created result.
     * @returns A Promise that resolves to the newly created Product object.
     */
    create(options: {
        data: { name: string, description: string, categoryId: number, userId: string },
        include?: IncludeOption
    }): Promise<Product>

    /**
     * Retrieves a list of Products based on filtering, sorting, and pagination options.
     * @param options The options for querying the list of Products.
     * @param options.where The filter conditions, equivalent to Prisma's 'where'. Supports filtering by userId and categoryId.
     * @param options.orderBy Sorts the results by one or more fields. E.g., [{ createdAt: 'desc' }, { name: 'asc' }].
     * @param options.take The maximum number of records to return (equivalent to 'limit').
     * @param options.skip The number of records to skip (equivalent to 'offset').
     * @param options.include The relations to load along with the list of Products.
     * @returns A Promise that resolves to an array of Product objects.
     */
    findMany(options: {
        where?: {
            product_code?: number, 
            name?: string, 
            description?: string, 
            categoryId?: number, 
            userId?: string
        },
        orderBy?: OrderByOption | OrderByOption[],
        limit?: number,
        offset?: number,
        include?: IncludeOption
    }): Promise<Product[]>

    /**
     * Finds a single Product by its unique product_code.
     * @param options The search options.
     * @param options.product_code The unique product code to search for.
     * @param options.include The relations to load along with the result.
     * @returns A Promise that resolves to the Product object if found, or null otherwise.
     */
    findOneByCode(options: {
        where: { product_code: number },
        include?: IncludeOption
    }): Promise<Product | null>

    /**
     * Finds a single Product by its unique ID.
     * @param options The search options.
     * @param options.id The ID of the Product to find.
     * @param options.include The relations to load along with the result.
     * @returns A Promise that resolves to the Product object if found, or null otherwise.
     */
    findOneById(options: {
        where: {
            id: string
        },
        include?: IncludeOption
    }): Promise<Product | null>

    /**
     * Updates the information of a Product based on its ID and a userId for ownership validation.
     * @param options The update options.
     * @param options.where The condition to find the Product to update (id and userId).
     * @param options.data The data fields to update. Equivalent to Prisma's 'data'.
     * @param options.include The relations to load along with the updated result.
     * @returns A Promise that resolves to the updated Product object.
     */
    updateById(options: {
        where: { id: string, userId: string },
        data: { name?: string, description?: string, categoryId?: number },
    }): Promise<void>

    /**
     * Deletes a Product based on its ID and a userId for ownership validation.
     * @param options The deletion options.
     * @param options.where The condition to find the Product to delete (id and userId).
     * @returns A Promise that resolves to void upon successful deletion.
     */
    deleteById(options: {
        where: { id: string, userId: string }
    }): Promise<void>
}