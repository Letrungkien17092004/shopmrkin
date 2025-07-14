import IRolesRepository from "core/applications/interfaces/repositories/IRolesRepository.js";
import { Role, Permission } from "core/entities/index.js";
import { PrismaClient } from "services/postgresSQL/generated/prisma/client/client";
import { baseExceptionHandler } from "./errors.js"

const prisma = new PrismaClient()


export default class RolesRepository implements IRolesRepository {

    /**
     * Creates a new role in the database with the specified role name and description.
     *
     * @param {Pick<Role, "roleName" | "description">} param0 - An object containing the role's name and description.
     * @param {string} param0.roleName - The name of the role to be created.
     * @param {string} param0.description - The description of the role.
     * @returns {Promise<Role>} A promise that resolves to the newly created Role instance.
     * @throws {Error} Throws an error if the role creation fails.
     */
    async create({ roleName, description }: Pick<Role, "roleName" | "description">): Promise<Role> {
        try {
            const role = await prisma.roles.create({
                data: {
                    roleName: roleName,
                    description: description
                }
            })
            return new Role({
                id: role.id,
                roleName: role.roleName,
                description: role.description
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }


    async getAll(): Promise<Role[]> {
        try {
            const allResult = await prisma.roles.findMany()

            const roles = allResult.map(item => {
                return new Role({
                    id: item.id,
                    roleName: item.roleName,
                    description: item.description
                })
            })

            return roles

        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }


    async getById(id: number): Promise<Role | null> {
        try {
            const getResult = await prisma.roles.findUnique({
                where: {
                    id: id
                },
                relationLoadStrategy: 'join',
                include: {
                    permissions: {
                        include: {
                            permission: true
                        }
                    }
                }
            })

            if (getResult) {
                const permissions = getResult.permissions.map(per => {
                    return new Permission({
                        id: per.permission.id,
                        perName: per.permission.perName,
                        description: per.permission.description
                    })
                })
                return new Role({
                    id: getResult.id,
                    roleName: getResult.roleName,
                    description: getResult.description,
                    permissions: permissions
                })
            }
            return null
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }


    async update(attributes: Omit<Partial<Role>, "id"> & Pick<Role, "id">): Promise<Role> {
        try {
            const updatedRole = await prisma.roles.update({
                where: {
                    id: attributes.id
                },
                data: {
                    roleName: attributes.roleName,
                    description: attributes.description
                },
                include: {
                    permissions: {
                        include: {
                            permission: true
                        }
                    }
                }
            })

            // convert prisma data to entity
            const permissions = updatedRole.permissions.map(per => {
                return new Permission({
                    id: per.permission.id,
                    perName: per.permission.perName,
                    description: per.permission.description
                })
            })

            return new Role({
                id: updatedRole.id,
                roleName: updatedRole.roleName,
                description: updatedRole.description,
                permissions: permissions
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    async deleteById(id: number): Promise<boolean> {
        try {
            const deleteRole = await prisma.roles.delete({
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