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

    async create(options: Omit<Variant, "id" | "createdAt" | "updatedAt">): Promise<Variant> {
        try {
            const createdVariant = await this.repo.create(options)
            return createdVariant
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

    async getById(id: string): Promise<Variant | null> {
        try {
            const searchedVariant = await this.repo.getById(id)
            return searchedVariant
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

    async updateById(id: string, authorId: number, options: Omit<Partial<Variant>, "id">): Promise<Variant> {
        try {
            const updatedVariant = await this.repo.updateById(id, authorId, options)
            return updatedVariant
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

    async deleteByID(id: string, authorId: number): Promise<void> {
        try {
            const status = await this.repo.deleteById(id, authorId)
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

