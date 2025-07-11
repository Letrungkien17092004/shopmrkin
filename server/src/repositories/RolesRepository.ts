import IRolesRepository from "core/applications/interfaces/repositories/IRolesRepository.js";
import Role from "core/entities/Role";
import { PrismaClient } from "services/postgresSQL/generated/prisma/client/client";

const prisma = new PrismaClient()

export default class RolesRepository implements IRolesRepository {

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
            throw new Error(`Error: ${error}`)
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
            throw new Error(`Error: ${error}`)
        }
    }


    async getById(id: number): Promise<Role | null> {
        try {
            const getResult = await prisma.roles.findUnique({
                where: {
                    id: id
                }
            })

            if (getResult) {
                return new Role({
                    id: getResult.id,
                    roleName: getResult.roleName,
                    description: getResult.description,
                })
            }
            return null
        } catch (error) {
            throw new Error(`Error: ${error}`)
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
                }
            })

            return new Role({
                id: updatedRole.id,
                roleName: updatedRole.roleName,
                description: updatedRole.description
            })
        } catch (error) {
            throw new Error(`Error: ${error}`)
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
            console.log(`Error: ${error}`)
            return false
        }
    }
}