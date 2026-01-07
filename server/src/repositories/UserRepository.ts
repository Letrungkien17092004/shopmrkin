import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js"
import { PrismaClient, Users as PrismaUser, Roles as PrismaRoles, Carts as PrismaCarts } from "@prisma/client";
import { User, Role, Permission, Cart } from "../core/entities/index.js"
import IUsersRepository from "../core/applications/interfaces/repositories/IUsersRepository.js";

const prisma = new PrismaClient()

type UserWithRoleAndCart = PrismaUser & {
    role: PrismaRoles,
    cart: PrismaCarts | null
}

export default class UserRepository implements IUsersRepository {

    /**
     * Creates a new user and add role and cart.
     * @param attributes - Information of the user to be created.
     * @returns The newly created User.
     * @throws REPO_ERROR
     */
    async create(options: {
        data: {
            username: string,
            account: string,
            password_hashed: string,
            email: string
        }
    }): Promise<User & { role: Role }> {
        try {
            const createdUser: UserWithRoleAndCart = await prisma.users.create({
                data: {
                    username: options.data.username,
                    account: options.data.account,
                    password_hash: options.data.password_hashed,
                    email: options.data.email,
                    roleId: 2,
                    cart: {
                        create: {}
                    }
                },
                include: {
                    role: true,
                    cart: true
                }
            })

            const user = new User({
                ...createdUser,
                role: new Role({ ...createdUser.role }),
                cart: createdUser.cart ? new Cart({ ...createdUser.cart }) : undefined
            })

            return user as User & { role: Role }
        } catch (error) {
            console.log("log in Repo")
            console.table(error)
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Retrieves user information by id, including related role and permissions.
     * @param id - The id of the user to retrieve.
     * @returns The User if found, otherwise null.
     * @throws REPO_ERROR
     */
    async getById(id: string): Promise<User | null> {
        try {
            const findResult = await prisma.users.findUnique({
                where: {
                    id: id
                },
                relationLoadStrategy: 'join',
                include: {
                    role: {
                        include: {
                            permissions: {
                                include: {
                                    permission: true
                                }
                            }
                        }
                    }
                }
            })
            if (findResult) {
                const pers = findResult.role.permissions.map(per => new Permission({
                    id: per.permission.id,
                    perName: per.permission.perName,
                    description: per.permission.description
                }))
                const role = new Role({
                    id: findResult.role.id,
                    roleName: findResult.role.roleName,
                    description: findResult.role.description,
                    permissions: pers
                })

                const finalCombine = {
                    ...findResult,
                    role: role
                }
                return new User(finalCombine)
            }
            return null
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Find a user by user's email
     * @param email the email of user to retrieve
     * 
     * @returns The User if found, otherwise null
     * @throws REPO_ERROR
     */
    async findByEmail(options: {
        where: {
            email: string
        }
    }): Promise<User & { role: Role } | null> {
        try {
            const searchedUser: UserWithRoleAndCart | null = await prisma.users.findUnique({
                where: options.where,
                relationLoadStrategy: 'join',
                include: {
                    role: true,
                    cart: true
                }
            })
            if (!searchedUser) { return null }

            const user = new User({
                ...searchedUser,
                role: new Role({
                    id: searchedUser.role.id,
                    roleName: searchedUser.role.roleName,
                    description: searchedUser.role.description
                }),
                cart: searchedUser.cart
                    ? new Cart({
                        id: searchedUser.cart.id,
                        userId: searchedUser.cart.userId,
                    })
                    : undefined
            })
            return user as User & { role: Role }
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Finds a user by their account identifier and loads related role and permissions, cart.
     *
     * @param options
     * @returns {Promise<User | null>} A promise that resolves to the found user with populated role and permissions,
     * or `null` if no user is found.
     * @throws REPO_ERROR
     */
    async findByAccount(options: {
        where: {
            account: string
        }
    }): Promise<User & { role: Role } | null> {
        try {
            const searchedUser = await prisma.users.findUnique({
                where: options.where,
                relationLoadStrategy: "join",
                include: {
                    role: true,
                    cart: true
                }
            })

            // not found
            if (!searchedUser) {
                return null
            }

            const cart: Cart | undefined = searchedUser.cart
                ? new Cart({ id: searchedUser.cart.id, userId: searchedUser.id })
                : undefined

            const role = new Role({
                id: searchedUser.role.id,
                roleName: searchedUser.role.roleName,
                description: searchedUser.role.description,
                permissions: []
            })

            const user = new User({
                ...searchedUser,
                role: role,
                cart: cart
            })

            return user as User & { role: Role }
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Updates user information with the provided attributes.
     * @param attributes - The attributes to update for the user.
     * @returns The updated User.
     * @throws REPO_ERROR
     */
    async update(options: {
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
    }): Promise<User> {
        try {
            const updated = await prisma.users.update({
                where: options.where,
                relationLoadStrategy: "join",
                data: options.data,
                include: {
                    role: {
                        include: {
                            permissions: {
                                include: {
                                    permission: true
                                }
                            }
                        }
                    }
                }
            })
            const permission: Permission[] = updated.role.permissions.map(per => new Permission({
                id: per.permission.id,
                perName: per.permission.perName
            }))

            const role: Role = new Role({
                id: updated.role.id,
                roleName: updated.role.roleName,
                description: updated.role.description,
                permissions: permission
            })

            return new User({
                id: updated.id,
                username: updated.username,
                account: updated.account,
                email: updated.email,
                password_hash: updated.password_hash,
                roleId: updated.role.id,
                role: role
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Deletes a user by id.
     * @param id - The id of the user to delete.
     * @returns true if deletion is successful.
     * @throws REPO_ERROR
     */
    async deleteById(id: string): Promise<boolean> {
        try {
            const deleteStatus = await prisma.users.delete({
                where: {
                    id: id
                }
            })

            return true
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }


    
}

