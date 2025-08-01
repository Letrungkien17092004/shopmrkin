import { User } from "core/entities/index.js"

export default interface IUsersRepository {
    create(attributes: Omit<User, "id" | "roleId">): Promise<User>
    getById(id: number): Promise<User | null>
    update(attributes: Partial<User> & Pick<User, "id">): Promise<User>
    deleteById(id: number): Promise<boolean>
}