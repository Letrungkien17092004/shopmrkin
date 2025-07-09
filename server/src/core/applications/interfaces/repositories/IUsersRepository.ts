import { User } from "core/entities/index.js"

export default interface IUsersRepository {
    create(newUser: User): Promise<User>
    getById(id: string): Promise<User | null>
    update(user: Partial<User>): Promise<User>
    deleteById(id: string): Promise<boolean>
}