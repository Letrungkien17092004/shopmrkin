import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js"
import { PrismaClient } from "services/postgresSQL/generated/prisma/client/client";
import { User } from "core/entities/index.js"
import IUsersRepository from "core/applications/interfaces/repositories/IUsersRepository.js";


const prisma = new PrismaClient()

export default class UserRepository implements IUsersRepository {
    async create(attributes: User): Promise<User> {
        try {
            const createdUser = await prisma.users.create({
                data: {
                    username: attributes.username,
                    account: attributes.account,
                    password_hash: attributes.password_hash,
                    email: attributes.email,
                    roleId: 1
                }
            })

            return new User(createdUser)
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
    async getById(id: number): Promise<User | null> {
        try {
            const findResult = await prisma.users.findUnique({
                where: {
                    id: id
                }
            })
            if (findResult) {
                return new User(findResult)
            } 
            return null
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
    async update(attributes: Partial<User>): Promise<User> {
        try {
            const updated = await prisma.users.update({
                where: {
                    id: attributes.id
                },
                data: {
                    username: attributes.username,
                    email: attributes.email,
                    password_hash: attributes.password_hash,
                    roleId: attributes.roleId
                }
            })
            return new User(updated)
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
    async deleteById(id: number): Promise<boolean> {
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

