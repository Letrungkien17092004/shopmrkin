import Role from "./Role.js"

export type UserConstructorParam = {
    id: string | null
    username: string
    account: string
    password_hash: string
    email: string | null
    roleId: number
    role?: Role
}
/**
 * Represents a user entity in the system.
 *
 * @remarks
 * This class encapsulates user information such as credentials, contact details, and role association.
 */
export default class User {
    /**
     * The unique identifier of the user.
     * @remarks
     * May be null if the user has not been persisted yet.
     */
    id: string | null

    /**
     * The display name of the user.
     */
    username: string

    /**
     * The account name used for login.
     */
    account: string

    /**
     * The hashed password of the user.
     */
    password_hash: string

    /**
     * The email address of the user.
     * @remarks
     * May be null if not provided.
     */
    email: string | null

    /**
     * The identifier of the role assigned to the user.
     */
    roleId: number

    /**
     * the role object
     */
    role?: Role

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
    }
}