import { User, Role } from "../../../../core/entities/index.js"

export default interface IUsersRepository {
    create(options: {
        data: {
            username: string,
            account: string,
            password_hashed: string,
            email: string
        }
    }): Promise<User & {role: Role}>

    /**
     * find a user by user's id
     * @param id 
     */
    getById(id: string): Promise<User | null>

    /**
     * find a user by user's email and includes related role, cart
     * @param options 
     */
    findByEmail(options: {
        where: {
            email: string
        }
    }): Promise<User & { role: Role } | null>

    /**
     * Finds a user by their account identifier and loads related role cart.
     *
     * @param options
     * @returns {Promise<User | null>} A promise that resolves to the found user with populated role and permissions,
     * or `null` if no user is found.
     * @throws REPO_ERROR
     */
    findByAccount(options: {
        where: {
            account: string
        }
    }): Promise<User & { role: Role } | null>

    /**
     * Update an user
     * @param options 
     */
    update(options: {
        where: {
            id: string
        },
        data: {
            username?: string
            account?: string
            password_hash?: string
            email?: string
            roleId?: number
        }
    }): Promise<User>

    /**
     * Delete user by user's id
     * @param id 
     */
    deleteById(id: string): Promise<boolean>
}