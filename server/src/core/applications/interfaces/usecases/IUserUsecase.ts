import User, {UserConstructorParam} from "core/entities/User.js"

export default interface IUserUsecase {
    create(options: Omit<User, "id" | "roleId">): Promise<User>
    getById(id: number): Promise<User | null>
    update(options: Partial<UserConstructorParam>): Promise<User>
    deleteById(id: number): Promise<boolean>
}