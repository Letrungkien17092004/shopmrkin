import IUserUsecase from "../interfaces/usecases/IUserUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../interfaces/usecases/errors.js";
import { REPO_ERROR, REPO_ERROR_CODE } from "../interfaces/repositories/errors.js";
import IUsersRepository from "../interfaces/repositories/IUsersRepository.js";
import { User } from "core/entities/index.js";

export default class UserUsecase implements IUserUsecase {
    private repository: IUsersRepository

    constructor(repo: IUsersRepository) {
        this.repository = repo;
    }

    async create(options: Omit<User, "id" | "roleId">): Promise<User> {
        try {
            const newUser = await this.repository.create(options)
            return newUser
        } catch (error) {
            console.log("Log in Usecase")
            console.log(error)
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.DATABASE_NOT_EXIST:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.ENGINE
                        })
                    case REPO_ERROR_CODE.FOREIGNKEY_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "user already exist",
                            code: USECASE_ERROR_CODE.EXISTED
                        })
                }
            }
            throw new USECASE_ERROR({
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    async getById(id: number): Promise<User | null> {
        try {
            const user = await this.repository.getById(id)
            return user
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.DATABASE_NOT_EXIST:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.ENGINE
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
                            code: USECASE_ERROR_CODE.ENGINE
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

    async deleteById(id: number): Promise<boolean> {
        try {
            return this.repository.deleteById(id)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.DATABASE_NOT_EXIST:
                        throw new USECASE_ERROR({
                            message: error.message,
                            code: USECASE_ERROR_CODE.ENGINE
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

}