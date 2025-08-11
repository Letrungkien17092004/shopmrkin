import { User } from "core/entities/index.js"

export default interface IUsersRepository {
    create(attributes: Omit<User, "id" | "roleId">): Promise<User>
    getById(id: string): Promise<User | null>
    update(attributes: Partial<User> & Pick<User, "id">): Promise<User>
    deleteById(id: string): Promise<boolean>
}