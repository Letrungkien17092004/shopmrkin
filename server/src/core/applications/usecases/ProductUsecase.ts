import { Product } from "../../../core/entities/index.js"
import IProductUsecase from "../interfaces/usecases/IProductUsecase.js"
import IProductRepository, {IncludeOption, OrderByOption} from "../interfaces/repositories/IProductRepository.js"
import { REPO_ERROR, REPO_ERROR_CODE } from "../interfaces/repositories/errors.js"
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../interfaces/usecases/errors.js"

export default class ProductUsecase implements IProductUsecase {
    private productRepo: IProductRepository

    constructor(productRepo: IProductRepository) {
        this.productRepo = productRepo
    }

    /**
     * Creates a new Product entity in the database.
     * @param options The options for creating the Product.
     * @param options.field The data for the new Product, excluding 'id' and 'product_code'. Equivalent to Prisma's 'data'.
     * @param options.include The relations (variant, media, category, user) to load along with the created result.
     * @returns A Promise that resolves to the newly created Product object.
     */
    async create(options: {
            data: { name: string, description: string, categoryId: number, userId: string },
            include?: IncludeOption
        }): Promise<Product> {
        try {
            const createdProduct = await this.productRepo.create(options)
            return createdProduct
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "Product already exist",
                            code: USECASE_ERROR_CODE.CONFLIX
                        })
                    
                    case REPO_ERROR_CODE.FOREIGNKEY_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "author or category is wrong",
                            code: USECASE_ERROR_CODE.CONSTRAINT
                        })

                }
            }
            throw new USECASE_ERROR({
                message: (error as Error).message || "",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

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
    async findMany(options: {
        where?: { product_code?: number, name?: string, description?: string, categoryId?: number, userId?: string },
        orderBy?: OrderByOption | OrderByOption[],
        limit?: number,
        offset?: number,
        include?: IncludeOption
    }): Promise<Product[]> {
        try {
            return await this.productRepo.findMany(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                }
            }
            throw new USECASE_ERROR({
                message: (error as Error).message || "",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }
    
    /**
     * Finds a single Product by its unique product_code.
     * @param options The search options.
     * @param options.product_code The unique product code to search for.
     * @param options.include The relations to load along with the result.
     * @returns A Promise that resolves to the Product object if found, or null otherwise.
     */
    async findOneByCode(options: {
        where: { product_code: number },
        include?: IncludeOption
    }): Promise<Product | null> {
        try {
            const searchedProduct = await this.productRepo.findOneByCode(options)
            return searchedProduct
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                }
            }
            throw new USECASE_ERROR({
                message: (error as Error).message || "",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    /**
     * Finds a single Product by its unique ID.
     * @param options The search options.
     * @param options.id The ID of the Product to find.
     * @param options.include The relations to load along with the result.
     * @returns A Promise that resolves to the Product object if found, or null otherwise.
     */
    async findOneById(options: {
        where: {
            id: string
        },
        include?: IncludeOption
    }): Promise<Product | null> {
        try {
            const searchedProduct = await this.productRepo.findOneById(options)
            return searchedProduct
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                }
            }
            throw new USECASE_ERROR({
                message: (error as Error).message || "",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    /**
     * Updates the information of a Product based on its ID and a userId for ownership validation.
     * @param options The update options.
     * @param options.where The condition to find the Product to update (id and userId).
     * @param options.data The data fields to update. Equivalent to Prisma's 'data'.
     * @param options.include The relations to load along with the updated result.
     * @returns A Promise that resolves to the updated Product object.
     */
    async updateById(options: {
        where: { id: string, userId: string },
        data: { name?: string, description?: string, categoryId?: number },
    }): Promise<void> {
        try {
            const updatedProduct = await this.productRepo.updateById(options)
            return updatedProduct
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "Product already exist",
                            code: USECASE_ERROR_CODE.CONFLIX
                        })
                    case REPO_ERROR_CODE.NOTFOUND:
                        throw new USECASE_ERROR({
                            message: "No product was found for an update",
                            code: USECASE_ERROR_CODE.NOTFOUND
                        })
                    case REPO_ERROR_CODE.FOREIGNKEY_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "User or Category not found",
                            code: USECASE_ERROR_CODE.CONSTRAINT
                        })

                }
            }
            throw new USECASE_ERROR({
                message: (error as Error).message || "",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    /**
     * Deletes a Product based on its ID and a userId for ownership validation.
     * @param options The deletion options.
     * @param options.where The condition to find the Product to delete (id and userId).
     * @returns A Promise that resolves to void upon successful deletion.
     */
    async deleteById(options: {
        where: { id: string, userId: string }
    }): Promise<void> {
        try {
            const status = await this.productRepo.deleteById(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                    case REPO_ERROR_CODE.NOTFOUND: 
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.NOTFOUND
                        })
                }
            }
            throw new USECASE_ERROR({
                message: "Undefined error object",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }
}

