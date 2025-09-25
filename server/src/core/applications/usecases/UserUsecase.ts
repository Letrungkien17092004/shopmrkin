import IUserUsecase from "../interfaces/usecases/IUserUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../interfaces/usecases/errors.js";
import { REPO_ERROR, REPO_ERROR_CODE } from "../interfaces/repositories/errors.js";
import IUsersRepository from "../interfaces/repositories/IUsersRepository.js";
import { User } from "core/entities/index.js";
import bcrypt from 'bcrypt';

export default class UserUsecase implements IUserUsecase {
    private repository: IUsersRepository

    constructor(repo: IUsersRepository) {
        this.repository = repo;
    }

    async create(options: Omit<User, "id" | "roleId">): Promise<User> {
        try {
            // hash password
            const password_hashed = await bcrypt.hash(options.password_hash, 10)
            
            // asign hashed password
            options.password_hash = password_hashed

            const newUser = await this.repository.create(options)
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
                            code: USECASE_ERROR_CODE.CONSTRAINT
                        })
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "User is already exist",
                            code: USECASE_ERROR_CODE.EXISTED
                        })
                }
            }
            throw new USECASE_ERROR({
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

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

    async getOrCreate(options: { account: string, email: string, username: string }): Promise<User> {
        try {
            const searchedUser = await this.repository.getOrCreate(options)
            return searchedUser
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.DATABASE_NOT_EXIST:
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

    async update(options: Partial<User> & Pick<User, "id">): Promise<User> {
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
                            code: USECASE_ERROR_CODE.EXISTED
                        })
                }
            }
            throw new USECASE_ERROR({
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

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

    async login({account, password}: { account: string; password: string; }): Promise<User | null> {
        try {
            const searchedUser = await this.repository.findWithAccount({
                account: account
            })
            if (!searchedUser) return null
            let isMatch = await bcrypt.compare(password, searchedUser.password_hash)
            if (!isMatch) return null
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