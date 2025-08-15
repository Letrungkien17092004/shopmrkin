import User, {UserConstructorParam} from "core/entities/User.js"

export default interface IUserUsecase {
    create(options: Omit<User, "id" | "roleId">): Promise<User>
    getById(id: string): Promise<User | null>
    update(options: Partial<UserConstructorParam>): Promise<User>
    deleteById(id: string): Promise<boolean>
    login(options: {account: string, password: string}): Promise<User | null>
}