import IUserUsecase from "../interfaces/usecases/IUserUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../interfaces/usecases/errors.js";
import { REPO_ERROR, REPO_ERROR_CODE } from "../interfaces/repositories/errors.js";
import IUsersRepository from "../interfaces/repositories/IUsersRepository.js";
import { User, Role } from "../../../core/entities/index.js";


export default class UserUsecase implements IUserUsecase {
    private repository: IUsersRepository

    constructor(repo: IUsersRepository) {
        this.repository = repo;
    }

    /**
     * Create a new user
     * @param options 
     */
    async create(options: {
        data: {
            username: string,
            account: string,
            password_hashed: string,
            email: string
        }
    }): Promise<User & { role: Role }> {
        try {
            const newUser = await this.repository.create({
                data: {
                    username: options.data.username,
                    account: options.data.account,
                    password_hashed: options.data.password_hashed,
                    email: options.data.email,
                }
            })
            return newUser
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.DATABASE_NOT_EXIST:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                    case REPO_ERROR_CODE.FOREIGNKEY_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "role is invalid",
                            code: USECASE_ERROR_CODE.FK_CONSTRAINT
                        })
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "User is already exist",
                            code: USECASE_ERROR_CODE.CONFLIX
                        })
                }
            }
            throw new USECASE_ERROR({
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    /**
     * Retrieves an user with user's id
     * @param id 
     */
    async getById(id: string): Promise<User | null> {
        try {
            const user = await this.repository.getById(id)
            return user
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.DATABASE_NOT_EXIST:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                    case REPO_ERROR_CODE.NOTFOUND:
                        throw new USECASE_ERROR({
                            message: "user not  found",
                            code: USECASE_ERROR_CODE.NOTFOUND
                        })
                }
            }
            throw new USECASE_ERROR({
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    /**
     * Retrieves an user with user's email
     * @param email 
     */
    async findByEmail(options: {
        where: {
            email: string
        }
    }): Promise<User & { role: Role } | null> {
        try {
            const searchedUser = await this.repository.findByEmail(options)
            return searchedUser
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.DATABASE_NOT_EXIST:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                }
            }
            throw new USECASE_ERROR({
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    /**
     * Update an user
     * @param options 
     */
    async update(options: {
        where: {
            id: string
        },
        data: {
            username?: string
            account?: string
            password_hash?: string
            email?: string
            roleId?: number
        }
    }): Promise<User> {
        try {
            const user = await this.repository.update(options)
            return user
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.DATABASE_NOT_EXIST:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                    case REPO_ERROR_CODE.NOTFOUND:
                        throw new USECASE_ERROR({
                            message: "user not  found",
                            code: USECASE_ERROR_CODE.NOTFOUND
                        })
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "the new data to be updated already exists",
                            code: USECASE_ERROR_CODE.CONFLIX
                        })
                }
            }
            throw new USECASE_ERROR({
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    /**
     * Delete an user with user's id
     * @param id 
     */
    async deleteById(id: string): Promise<boolean> {
        try {
            return this.repository.deleteById(id)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.DATABASE_NOT_EXIST:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                    case REPO_ERROR_CODE.NOTFOUND:
                        throw new USECASE_ERROR({
                            message: "user not  found",
                            code: USECASE_ERROR_CODE.NOTFOUND
                        })
                }
            }
            throw new USECASE_ERROR({
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }

    }

    /**
     * check correct user with account and password
     * @param options 
     */
    async findByAccount(options: {
        where: {
            account: string
        }
    }): Promise<User & { role: Role } | null> {
        try {
            const searchedUser = await this.repository.findByAccount({
                where: options.where
            })
            return searchedUser
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
                message: (error as Error).message,
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

}