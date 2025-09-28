import { Product } from "core/entities/index.js"
import IProductUsecase from "../interfaces/usecases/IProductUsecase.js"
import IProductRepository from "../interfaces/repositories/IProductRepository.js"
import { REPO_ERROR, REPO_ERROR_CODE } from "../interfaces/repositories/errors.js"
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../interfaces/usecases/errors.js"

export default class ProductUsecase implements IProductUsecase {
    private productRepo: IProductRepository

    constructor(productRepo: IProductRepository) {
        this.productRepo = productRepo
    }

    async create(options: Omit<Product, "id" | "product_code" | "createdAt" | "updatedAt"> & { include?: boolean }): Promise<Product> {
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
                            code: USECASE_ERROR_CODE.EXISTED
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

    async findMany(options: { fields: Partial<Pick<Product, "userId" | "categoryId">>, orderBy?: [{createdAt: "asc"} | {createdAt: "desc"} | {updatedAt: "asc"} | {updatedAt: "desc"}], limit?: number, offset?: number, include?: boolean }): Promise<Product[]> {
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
    
    async findOneByCode(options: { product_code: number, include?: boolean }): Promise<Product | null> {
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

    async findOneById(options: { id: string, include?: boolean }): Promise<Product | null> {
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

    async updateById(options: { id: string, userId: string, fields: Partial<Omit<Product, "id">>, include?: boolean }): Promise<Product> {
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
                            code: USECASE_ERROR_CODE.EXISTED
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

    async deleteById(options: { id: string, userId: string }): Promise<void> {
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

