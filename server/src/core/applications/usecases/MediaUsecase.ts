import { REPO_ERROR, REPO_ERROR_CODE } from "../interfaces/repositories/errors.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../interfaces/usecases/errors.js";
import IMediaRepository from "../interfaces/repositories/IMediaRepository.js";
import IMediaUsecase from "../interfaces/usecases/IMediaUsecase.js";
import { Media } from "core/entities/index.js"

export default class MediaUsecase implements IMediaUsecase {
    private repo: IMediaRepository
    constructor(repo: IMediaRepository) {
        this.repo = repo
    }

    async create(options: Omit<Media, "id">): Promise<Media> {
        try {
            return await this.repo.create(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "Media already exist",
                            code: USECASE_ERROR_CODE.EXISTED
                        })
                    case REPO_ERROR_CODE.UNKNOW:
                        throw new USECASE_ERROR({
                            message: "something wrong with repo",
                            code: USECASE_ERROR_CODE.UNKNOW
                        })
                }
            }
            throw new USECASE_ERROR({
                message: "Unable to determine the cause",
                code: USECASE_ERROR_CODE.UNKNOW
            })
        }
    }

    async getById(id: string): Promise<Media | null> {
        try {
            return await this.repo.getById(id)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: "Database error",
                            code: USECASE_ERROR_CODE.ENGINE
                        })
                    case REPO_ERROR_CODE.UNKNOW:
                        throw new USECASE_ERROR({
                            message: "something wrong with repo",
                            code: USECASE_ERROR_CODE.UNKNOW
                        })
                }
            }
            throw new USECASE_ERROR({
                message: "Unable to determine the cause",
                code: USECASE_ERROR_CODE.UNKNOW
            })
        }
    }

    async updateById(id: string, options: Partial<Media>): Promise<Media> {
        try {
            return await this.repo.updateById(id, options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: "Database error",
                            code: USECASE_ERROR_CODE.ENGINE
                        })
                    case REPO_ERROR_CODE.NOTFOUND:
                        throw new USECASE_ERROR({
                            message: "something wrong with repo",
                            code: USECASE_ERROR_CODE.NOTFOUND
                        })
                }
            }
            throw new USECASE_ERROR({
                message: "Unable to determine the cause",
                code: USECASE_ERROR_CODE.UNKNOW
            })
        }
    }

    async deleteById(id: string): Promise<void> {
        try {
            await this.repo.deleteById(id)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: "Database error",
                            code: USECASE_ERROR_CODE.ENGINE
                        })
                    case REPO_ERROR_CODE.NOTFOUND:
                        throw new USECASE_ERROR({
                            message: "something wrong with repo",
                            code: USECASE_ERROR_CODE.NOTFOUND
                        })
                }
            }
            throw new USECASE_ERROR({
                message: "Unable to determine the cause",
                code: USECASE_ERROR_CODE.UNKNOW
            })
        }
    }
}
