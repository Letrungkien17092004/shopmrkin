import User, { UserConstructorParam } from "../../../../core/entities/User.js"

export default interface IUserUsecase {

    /**
     * Create a new user
     * @param options 
     */
    create(options: {
        data: {
            username: string,
            account: string,
            password: string,
            email: string
        }
    }): Promise<User>

    /**
     * Retrieves an user with user's id
     * @param id 
     */
    getById(id: string): Promise<User | null>

    /**
     * Retrieves an user with user's email
     * @param email 
     */
    findByEmail(options: {
        where: {
            email: string
        }
    }): Promise<User | null>

    /**
     * Update an user
     * @param options 
     */
    update(options: Partial<UserConstructorParam>): Promise<User>

    /**
     * Delete an user with user's id
     * @param id 
     */
    deleteById(id: string): Promise<boolean>

    /**
     * check correct user with account and password
     * @param options 
     */
    login(options: { account: string, password: string }): Promise<User | null>
}