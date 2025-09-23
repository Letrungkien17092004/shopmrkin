import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js"
import { PrismaClient } from "services/postgresSQL/generated/prisma/client/client.js";
import { User, Role, Permission } from "core/entities/index.js"
import IUsersRepository from "core/applications/interfaces/repositories/IUsersRepository.js";
import crypto from 'crypto';

const prisma = new PrismaClient()

export default class UserRepository implements IUsersRepository {

    /**
     * Creates a new user with the provided attributes (excluding id and roleId).
     * @param attributes - Information of the user to be created.
     * @returns The newly created User.
     * @throws REPO_ERROR
     */
    async create(attributes: Omit<User, "id" | "roleId">): Promise<User> {
        try {
            const createdUser = await prisma.users.create({
                data: {
                    username: attributes.username,
                    account: attributes.account,
                    password_hash: attributes.password_hash,
                    email: attributes.email,
                    roleId: 2
                },
                include: {
                    role: true
                }
            })

            return new User(createdUser)
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
     * Retrieves User by email
     * @param email the email of user to retrieve
     * 
     * @returns The User if found, otherwise null
     * @throws REPO_ERROR
     */
    async getOrCreate(options: { account: string, email: string, username: string }): Promise<User> {
        try {
            const searchedUser = await prisma.users.findUnique({
                where: {
                    email: options.email
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
            if (searchedUser) {
                const permission: Permission[] = searchedUser.role.permissions.map(per => new Permission({
                    id: per.permission.id,
                    perName: per.permission.perName
                }))
                const role: Role = new Role({
                    id: searchedUser.role.id,
                    roleName: searchedUser.role.roleName,
                    description: searchedUser.role.description,
                    permissions: permission
                })
                return new User({
                    id: searchedUser.id,
                    username: searchedUser.username,
                    account: searchedUser.account,
                    email: searchedUser.email,
                    password_hash: searchedUser.password_hash,
                    roleId: searchedUser.role.id,
                    role: role
                })
            }

            // generate random password
            let randomPassword = crypto.randomUUID().replace("-", "")

            const newUser = await prisma.users.create({
                data: {
                    username: options.username,
                    account: options.account,
                    password_hash: randomPassword,
                    email: options.email,
                    roleId: 2
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
            const permission: Permission[] = newUser.role.permissions.map(per => new Permission({
                id: per.permission.id,
                perName: per.permission.perName
            }))
            const role: Role = new Role({
                id: newUser.role.id,
                roleName: newUser.role.roleName,
                description: newUser.role.description,
                permissions: permission
            })
            return new User({
                id: newUser.id,
                username: newUser.username,
                account: newUser.account,
                email: newUser.email,
                password_hash: newUser.password_hash,
                roleId: newUser.role.id,
                role: role
            })
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
    async update(attributes: Partial<User>): Promise<User> {
        try {
            const updated = await prisma.users.update({
                where: {
                    id: attributes.id
                },
                relationLoadStrategy: "join",
                data: {
                    username: attributes.username,
                    account: attributes.account,
                    email: attributes.email,
                    password_hash: attributes.password_hash,
                    roleId: attributes.roleId
                },
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


    /**
     * Finds a user by their account identifier and loads related role and permissions.
     *
     * @param {Pick<User, "account">} param0 - An object containing the account identifier to search for.
     * @returns {Promise<User | null>} A promise that resolves to the found user with populated role and permissions,
     * or `null` if no user is found.
     * @throws REPO_ERROR
     */
    async findWithAccount({ account }: Pick<User, "account">): Promise<User | null> {
        try {
            const searchedUser = await prisma.users.findUnique({
                where: {
                    account: account
                },
                relationLoadStrategy: "join",
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

            // not found
            if (!searchedUser) {
                return null
            }


            const permissions = searchedUser.role.permissions.map(per => new Permission({
                id: per.permission.id,
                perName: per.permission.perName,
                description: per.permission.description
            }))

            const role = new Role({
                id: searchedUser.role.id,
                roleName: searchedUser.role.roleName,
                description: searchedUser.role.description,
                permissions: permissions
            })

            return {
                ...searchedUser,
                role: role,
            }
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
}

