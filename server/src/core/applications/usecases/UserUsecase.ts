import IUserUsecase from "../interfaces/usecases/IUserUsecase.js";
import IUserRepository from "../interfaces/repositories/IUserRepository.js";
import { User, UserConstructorParam } from "core/entities/index.js";

export default class UserUsecase implements IUserUsecase {
    private repository: IUserRepository

    constructor(repo: IUserRepository) {
        this.repository = repo;
    }

    async create(options: UserConstructorParam): Promise<User> {
        try {
            const newUser = await this.repository.create(options)
            return newUser
        } catch (error) {
            throw new Error("User usecase error!")
        }
    }

    async getAll(): Promise<User[]> {
        try {
            const users = await this.repository.getAll()
            return users
        } catch (error) {
            throw new Error("User usecase error!")
        }
    }

    async getById(id: string): Promise<User | null> {
        try {
            const user = await this.repository.getById(id)
            return user
        } catch (error) {
            throw new Error("User usecase error!")
        }
    }

    async update(options: Partial<UserConstructorParam>): Promise<User> {
        try {
            const user = await this.repository.update(options)
            return user
        } catch (error) {
            throw new Error("User usecase error!")
        }
    }

    async deleteById(id: string): Promise<boolean> {
        try {
            return this.repository.deleteById(id)
        } catch (error) {
            throw new Error("User usecase error!")
        }

    }

}