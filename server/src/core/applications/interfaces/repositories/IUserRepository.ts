import User from "core/entities/User.js"

export default interface IUserRepository {
        create(newUser: User): Promise<User>
        getAll(): Promise<User[]>
        getById(id: string): Promise<User | null>
        update(user: Partial<User>): Promise<User>
        deleteById(id: string): Promise<boolean>
}