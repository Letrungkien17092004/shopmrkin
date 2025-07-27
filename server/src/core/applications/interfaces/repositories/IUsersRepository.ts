import { User } from "core/entities/index.js"

export default interface IUsersRepository {
    create(attributes: User): Promise<User>
    getById(id: number): Promise<User | null>
    update(attributes: Partial<User>): Promise<User>
    deleteById(id: number): Promise<boolean>
}