import User, { UserConstructorParam } from "../../../../core/entities/User.js"

export default interface IUserUsecase {
    create(options: {
        data: {
            username: string,
            account: string,
            password: string,
            email: string
        }
    }): Promise<User>
    getById(id: string): Promise<User | null>
    findByEmail(options: {
        where: {
            email: string
        }
    }): Promise<User | null>
    update(options: Partial<UserConstructorParam>): Promise<User>
    deleteById(id: string): Promise<boolean>
    login(options: { account: string, password: string }): Promise<User | null>
}