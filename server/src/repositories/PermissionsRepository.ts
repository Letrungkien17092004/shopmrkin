import IPermissionsRepository from "core/applications/interfaces/repositories/IPermissionsRepository.js";
import { Permission } from "core/entities/index.js";
import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js"
import { PrismaClient } from "services/postgresSQL/generated/prisma/client/client";

const prisma = new PrismaClient()

export default class PermissionsRepository implements IPermissionsRepository {
    async create(options: Omit<Permission, "id">): Promise<Permission> {
        try {
            const createdPer = await prisma.permissions.create({
                data: {
                    perName: options.perName,
                    description: options.description
                }
            })
            return new Permission({
                id: createdPer.id,
                perName: createdPer.perName,
                description: createdPer.description
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
    async getById(id: number): Promise<Permission | null> {
        try {
            const getedPer = await prisma.permissions.findUnique({
                where: {
                    id: id
                }
            })
            if (getedPer) {
                return new Permission({
                    id: getedPer.id,
                    perName: getedPer.perName,
                    description: getedPer.description
                })
            } return null
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
    async update(options: Omit<Partial<Permission>, "id"> & Pick<Permission, "id">): Promise<Permission> {
        try {
            const updatedPer = await prisma.permissions.update({
                where: {
                    id: options.id
                },
                data: {
                    perName: options.perName,
                    description: options.description
                }
            })
            return new Permission({
                id: updatedPer.id,
                perName: updatedPer.perName,
                description: updatedPer.description
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
    async deleteById(id: number): Promise<boolean> {
        try {
            const deleted = await prisma.permissions.delete({
                where: {
                    id: id
                }
            })
            return true
        } catch (error) {
            throw baseExceptionHandler(error)
            return false
        }
    }
}