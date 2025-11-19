import { User } from "../../../../core/entities/index.js"

export default interface IUsersRepository {
    create(options: {
        data: {
            username: string,
            account: string,
            password_hashed: string,
            email: string
        }
    }): Promise<User>

    getById(id: string): Promise<User | null>

    findByEmail(options: {
        where: {
            email: string
        }
    }): Promise<User | null>

    update(attributes: Partial<User> & Pick<User, "id">): Promise<User>

    deleteById(id: string): Promise<boolean>


    /**
     * Finds a user by their account identifier and loads related role and permissions, cart.
     *
     * @param options
     * @returns {Promise<User | null>} A promise that resolves to the found user with populated role and permissions,
     * or `null` if no user is found.
     * @throws REPO_ERROR
     */
    findWithAccount(options: {
        where: {
            account: string
        }
    }): Promise<User | null>
}