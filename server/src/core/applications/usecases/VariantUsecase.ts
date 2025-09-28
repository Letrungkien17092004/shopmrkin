import { Variant } from "core/entities/index.js"
import IVariantRepository from "core/applications/interfaces/repositories/IVariantRepository.js"
import IVariantUsecase from "core/applications/interfaces/usecases/IVariantUsecase.js"
import { REPO_ERROR, REPO_ERROR_CODE } from "core/applications/interfaces/repositories/errors.js"
import { USECASE_ERROR, USECASE_ERROR_CODE } from "core/applications/interfaces/usecases/errors.js"


export default class VariantUsecase implements IVariantUsecase {
    private repo: IVariantRepository

    constructor(repo: IVariantRepository) {
        this.repo = repo
    }

    /**
     * Create a Variant
     * @param options 
     * @returns 
     */
    async create(options: Omit<Variant, "id"> & { include?: boolean }): Promise<Variant> {
        try {
            const createdVariant = await this.repo.create(options)
            return createdVariant
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
                            message: "Variant already exist",
                            code: USECASE_ERROR_CODE.EXISTED
                        })
                    
                    case REPO_ERROR_CODE.FOREIGNKEY_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "author or parent product is wrong",
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
     * Retrieves a list of Variant
     * @param options 
     * @returns 
     */
    async findMany(options: { fields: Partial<Pick<Variant, "name" | "sku" | "productId" | "userId">>, orderBy?: [{createdAt: "asc"} | {createdAt: "desc"} | {updatedAt: "asc"} | {updatedAt: "desc"}], limit?: number, offset?: number, include?: boolean }): Promise<Variant[]> {
        try {
            const searchedVariant = await this.repo.findMany(options)
            return searchedVariant
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
     * Retrieves a Variant by SKU
     * @param options 
     * @returns 
     */
    async findOneBySku(options: { sku: string, include?: boolean }): Promise<Variant | null> {
        try {
            const updatedVariant = await this.repo.findOneBySku(options)
            return updatedVariant
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
                            message: "Variant already exist",
                            code: USECASE_ERROR_CODE.EXISTED
                        })
                    case REPO_ERROR_CODE.NOTFOUND:
                        throw new USECASE_ERROR({
                            message: "No variant was found for update",
                            code: USECASE_ERROR_CODE.NOTFOUND
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
     * Retrieves a Variant by ID
     * @param id 
     * @param authorId 
     */
    async findOneById(options: { id: string, include?: boolean }): Promise<Variant | null> {
        try {
            return await this.repo.findOneById(options)
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

    /**
     * Update a variant by ID
     * @param options 
     */
    async updateById(options: { id: string; userId: string; fields: Partial<Omit<Variant, "id">>; include?: boolean; }): Promise<Variant> {
        try {
            return await this.repo.updateById(options)
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
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.EXISTED
                        })
                    
                    case REPO_ERROR_CODE.FOREIGNKEY_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.CONSTRAINT
                        })
                }
            }
            throw new USECASE_ERROR({
                message: "Undefined error object",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    /**
     * Delete a Variant by ID
     * @param options 
     */
    async deleteById(options: { id: string; userId: string; }): Promise<void> {
        try {
            await this.repo.deleteById(options)
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

