import IMediaRepository from "core/applications/interfaces/repositories/IMediaRepository.js";
import { PrismaClient } from "services/postgresSQL/generated/prisma/client/index.js";
import { Media, User, Role } from "core/entities/index.js"
import { baseExceptionHandler } from "core/applications/interfaces/repositories/errors.js";

const prisma = new PrismaClient()
export default class MediaRepository implements IMediaRepository {

    /**
     * Create a Media in Database
     * @param options 
     * @returns 
     */
    async create(options: Omit<Media, "id">): Promise<Media> {
        try {
            const createdMedia = await prisma.media.create({
                data: {
                    fileName: options.fileName,
                    filePath: options.filePath,
                    hostname: options.hostname,
                    media_type: options.media_type,
                    size: options.size,
                    userId: options.userId
                }
            })

            const blankRole = new Role({
                id: -100,
                roleName: "NOROLE",
                description: null
            })
            const blankUser = new User({
                id: "",
                username: "",
                account: "",
                password_hash: "",
                email: "",
                roleId: -100,
                role: blankRole
            })

            return new Media({
                id: createdMedia.id,
                fileName: createdMedia.fileName,
                filePath: createdMedia.filePath,
                hostname: createdMedia.hostname,
                media_type: createdMedia.media_type,
                size: createdMedia.size,
                status: createdMedia.status,
                userId: createdMedia.userId,
                author: blankUser,
                createdAt: createdMedia.createdAt,
                updatedAt: createdMedia.updatedAt
            })
        } catch (error) {
            throw baseExceptionHandler(error) // alway throw REPO_ERROR
        }
    }

    /**
     * Retrieves a Media from Database
     * @param id 
     * @returns 
     */
    async getById(id: string): Promise<Media | null> {
        try {
            const searchedMedia = await prisma.media.findUnique({
                where: {
                    id: id
                }
            })
            
            if (!searchedMedia) {
                return null
            }

            const blankRole = new Role({
                id: -100,
                roleName: "NOROLE",
                description: null
            })
            const blankUser = new User({
                id: "",
                username: "",
                account: "",
                password_hash: "",
                email: "",
                roleId: -100,
                role: blankRole
            })

            return new Media({
                id: searchedMedia.id,
                fileName: searchedMedia.fileName,
                filePath: searchedMedia.filePath,
                hostname: searchedMedia.hostname,
                media_type: searchedMedia.media_type,
                size: searchedMedia.size,
                status: searchedMedia.status,
                userId: searchedMedia.userId,
                author: blankUser,
                createdAt: searchedMedia.createdAt,
                updatedAt: searchedMedia.updatedAt
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Modify a media (only can modify media_type, status)
     * @param id 
     * @param options 
     */
    async updateById(id: string, options: Partial<Media>): Promise<Media> {
        try {
            const updatedMedia = await prisma.media.update({
                where: {
                    id: id
                },
                data: {
                    media_type: options.media_type,
                    status: options.status,
                }
            })

            const blankRole = new Role({
                id: -100,
                roleName: "NOROLE",
                description: null
            })
            const blankUser = new User({
                id: "",
                username: "",
                account: "",
                password_hash: "",
                email: "",
                roleId: -100,
                role: blankRole
            })

            return new Media({
                id: updatedMedia.id,
                fileName: updatedMedia.fileName,
                filePath: updatedMedia.filePath,
                hostname: updatedMedia.hostname,
                media_type: updatedMedia.media_type,
                size: updatedMedia.size,
                status: updatedMedia.status,
                userId: updatedMedia.userId,
                author: blankUser,
                createdAt: updatedMedia.createdAt,
                updatedAt: updatedMedia.updatedAt
            })

        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Delete a media in Database, throw err if not found
     * @param id 
     */
    async deleteById(id: string): Promise<void> {
        try {
            await prisma.media.delete({
                where: {
                    id: id
                }
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
}