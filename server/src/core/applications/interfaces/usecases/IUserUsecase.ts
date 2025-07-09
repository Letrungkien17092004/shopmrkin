import User, {UserConstructorParam} from "core/entities/User.js"

export default interface IUserUsecase {
    create(options: UserConstructorParam): Promise<User>
    getById(id: string): Promise<User | null>
    update(options: Partial<UserConstructorParam>): Promise<User>
    deleteById(id: string): Promise<boolean>
}