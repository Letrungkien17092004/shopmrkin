import Role from "./Role.js"
import Product from "./Product.js"
import Variant from "./Variant.js"
import Media from "./Media.js"

export type UserConstructorParam = {
    id: string
    username: string
    account: string
    password_hash: string
    email: string
    roleId: number
    role?: Role

    createdAt?: Date
    updatedAt?: Date
}
/**
 * Represents a user entity in the system.
 *
 * @remarks
 * This class encapsulates user information such as credentials, contact details, and role association.
 */
export default class User {

    id: string
    username: string
    account: string
    password_hash: string
    email: string
    roleId: number
    
    role?: Role

    createdAt?: Date
    updatedAt?: Date

    /**
     * Creates a new instance of the User class.
     * @param options - The initialization parameters for the user.
     */
    constructor(options: UserConstructorParam) {
        this.id = options.id
        this.username = options.username
        this.account = options.account
        this.password_hash = options.password_hash
        this.email = options.email
        this.roleId = options.roleId
        this.role = options.role
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
    }
}