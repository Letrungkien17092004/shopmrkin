import { REPO_ERROR, REPO_ERROR_CODE } from "../interfaces/repositories/errors.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../interfaces/usecases/errors.js";
import IMediaRepository, { IncludeOption, OrderByOption } from "../interfaces/repositories/IMediaRepository.js";
import IMediaUsecase from "../interfaces/usecases/IMediaUsecase.js";
import { Media } from "../../../core/entities/index.js"

/**
 * @class MediaUsecase
 * @implements {IMediaUsecase}
 * @description Implements the business logic (use cases) related to Media.
 * It interacts with the MediaRepository to perform CRUD operations and handles error translation from the Repository layer.
 */
export default class MediaUsecase implements IMediaUsecase {
    /**
     * @private
     * @type {IMediaRepository}
     * @description Reference to the Media Repository for data interaction.
     */
    private repo: IMediaRepository
    
    /**
     * @constructor
     * @param {IMediaRepository} repo - The instance of the Media Repository.
     */
    constructor(repo: IMediaRepository) {
        this.repo = repo
    }

    /**
     * @async
     * @method create
     * @description Creates a new Media record.
     * @param {object} options - Options for creating the Media.
     * @param {Omit<Media, "id">} options.data - The Media data, excluding the ID.
     * @param {IncludeOption} [options.include] - Optional inclusion of related relations.
     * @returns {Promise<Media>} A Promise that resolves to the created Media object.
     * @throws {USECASE_ERROR} If an error occurs during creation (e.g., database error, unique constraint violation).
     */
    async create(options: {
        data: {
            fileName: string,
            filePath: string,
            hostname: string,
            media_type: "IMAGE" | "VIDEO",
            size: number,
            userId: string
        },
        include?: IncludeOption
    }): Promise<Media> {
        try {
            return await this.repo.create(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: "Database error",
                            code: USECASE_ERROR_CODE.INITIAL
                        })
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

    /**
     * @async
     * @method findMany
     * @description Finds multiple Media records based on provided criteria.
     * @param {object} options - Options for the search.
     * @param {Partial<Media>} options.where - The filter conditions for the records.
     * @param {IncludeOption} [options.include] - Optional inclusion of related relations.
     * @param {OrderByOption | OrderByOption[]} [options.orderBy] - Optional sorting criteria.
     * @returns {Promise<Media[]>} A Promise that resolves to an array of Media objects.
     * @throws {USECASE_ERROR} If a database or unknown repository error occurs during the search.
     */
    async findMany(options: {
        where: Partial<Omit<Media, 'user'>>,
        include?: IncludeOption,
        orderBy?: OrderByOption | OrderByOption[]
    }): Promise<Media[]> {
        try {
            return await this.repo.findMany(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: "Database error",
                            code: USECASE_ERROR_CODE.INITIAL
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

    /**
     * @async
     * @method findOneById
     * @description Finds a single Media record by its ID.
     * @param {object} options - Options for the search.
     * @param {{ id: string }} options.where - The ID to filter by.
     * @param {IncludeOption} [options.include] - Optional inclusion of related relations.
     * @returns {Promise<Media | null>} A Promise that resolves to the Media object or null if not found.
     * @throws {USECASE_ERROR} If a database or unknown repository error occurs during the search.
     */
    async findOneById(options: {
        where: { id: string },
        include?: IncludeOption
    }): Promise<Media | null> {
        try {
            return this.repo.findOneById(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: "Database error",
                            code: USECASE_ERROR_CODE.INITIAL
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

    /**
     * @async
     * @method updateById
     * @description Updates a Media record identified by its ID.
     * @param {object} options - Options for the update.
     * @param {{ id: string }} options.where - The ID of the record to update.
     * @param {Partial<Media>} options.data - The partial Media data to update.
     * @returns {Promise<void>} A Promise that resolves when the update is complete.
     * @throws {USECASE_ERROR} If an error occurs during the update (e.g., database error, record not found).
     */
    async updateById(options: {
        where: { id: string },
        data: Partial<Media>
    }): Promise<void> {
        try {
            return await this.repo.updateById(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: "Database error",
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                    case REPO_ERROR_CODE.NOTFOUND:
                        throw new USECASE_ERROR({
                            message: "Media not found",
                            code: USECASE_ERROR_CODE.NOTFOUND
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

    /**
     * @async
     * @method deleteById
     * @description Deletes a Media record by its ID and UserId (for ownership check).
     * @param {object} options - Options for the deletion.
     * @param {{ id: string, userId: string }} options.where - The ID of the Media and the User ID for deletion condition.
     * @returns {Promise<void>} A Promise that resolves when the deletion is complete.
     * @throws {USECASE_ERROR} If an error occurs during deletion (e.g., database error, record not found).
     */
    async deleteById(options: {
        where: { id: string, userId: string }
    }): Promise<void> {
        try {
            await this.repo.deleteById(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: "Database error",
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                    case REPO_ERROR_CODE.NOTFOUND:
                        throw new USECASE_ERROR({
                            message: "Media not found",
                            code: USECASE_ERROR_CODE.NOTFOUND
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
}