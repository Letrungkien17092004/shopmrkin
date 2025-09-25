import ICategoryUsecase from "../interfaces/usecases/ICategoryUsecase.js";
import ICategoryRepository from "../interfaces/repositories/ICategoryRepository.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../interfaces/usecases/errors.js";
import { REPO_ERROR, REPO_ERROR_CODE } from "../interfaces/repositories/errors.js";
import { Category } from "core/entities/index.js"


export default class CategoryUsecase implements ICategoryUsecase {
    private categoryRepo: ICategoryRepository

    constructor(categoryRepo: ICategoryRepository) {
        this.categoryRepo = categoryRepo
    }


    async create(options: Omit<Category, "id">): Promise<Category> {
        try {
            const createdCategory = await this.categoryRepo.create(options)
            return createdCategory
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
                            message: "category already exist",
                            code: USECASE_ERROR_CODE.EXISTED
                        })

                }
            }
            throw new USECASE_ERROR({
                message: (error as Error).message || "",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }
    async getBySlug(slug: string): Promise<Category | null> {
        try {
            const searchedCategory = await this.categoryRepo.getBySlug(slug)
            return searchedCategory
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
    async updateById(id: number, options: Omit<Partial<Category>, "id">): Promise<Category> {
        try {
            const updatedCategory = await this.categoryRepo.updateById(id, options)
            return updatedCategory
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
                            message: "Category is not found",
                            code: USECASE_ERROR_CODE.NOTFOUND
                        })
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "data existed",
                            code: USECASE_ERROR_CODE.EXISTED
                        })
                }
            }
            
            throw new USECASE_ERROR({
                message: (error as Error).message || "",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }
    async deleteById(id: number): Promise<void> {
        try {
            const status = await this.categoryRepo.deleteById(id)
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
                            message: "Category is not found",
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
}