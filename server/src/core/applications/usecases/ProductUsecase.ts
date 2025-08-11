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

    async create(options: Omit<Product, "id" | "productCode" | "createdAt" | "updatedAt">): Promise<Product> {
        try {
            const createdProduct = await this.productRepo.create(options)
            return createdProduct
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.ENGINE
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
    
    async getByProductCode(productCode: number): Promise<Product | null> {
        try {
            const searchedProduct = await this.productRepo.getByProductCode(productCode)
            return searchedProduct
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.ENGINE
                        })
                }
            }
            throw new USECASE_ERROR({
                message: (error as Error).message || "",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    async getById(id: string): Promise<Product | null> {
        try {
            const searchedProduct = await this.productRepo.getById(id)
            return searchedProduct
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.ENGINE
                        })
                }
            }
            throw new USECASE_ERROR({
                message: (error as Error).message || "",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    async updateById(id: string, authorId: number, options: Omit<Partial<Product>, "id">): Promise<Product> {
        try {
            const updatedProduct = await this.productRepo.updateById(id, authorId, options)
            return updatedProduct
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.ENGINE
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

                }
            }
            throw new USECASE_ERROR({
                message: (error as Error).message || "",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    async deleteById(id: string, authorId: number): Promise<void> {
        try {
            const status = await this.productRepo.deleteById(id, authorId)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.ENGINE
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

