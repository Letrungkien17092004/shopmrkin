import IRolePerRepository from "core/applications/interfaces/repositories/IRolePerRepository.js";
import { RolePermission } from "core/entities/index.js"
import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js"
import { PrismaClient } from "services/postgresSQL/generated/prisma/client/index.js";
const prisma = new PrismaClient()

export default class RolePerRepository implements IRolePerRepository {
    async create(attributes: Pick<RolePermission, "roleId" | "permisId">): Promise<RolePermission> {
        try {
            const createdRolePer = await prisma.roles_Permissions.create({
                data: {
                    roleId: attributes.roleId,
                    permisId: attributes.permisId
                }
            })
            return new RolePermission({
                roleId: createdRolePer.roleId,
                permisId: createdRolePer.permisId
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
    async deleteWithPair(attributes: Pick<RolePermission, "roleId" | "permisId">): Promise<boolean> {
        try {
            const deletedResult = await prisma.roles_Permissions.delete({
                where: {
                    roleId_permisId: {
                        roleId: attributes.roleId,
                        permisId: attributes.permisId
                    }
                }
            })
            return true
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
}