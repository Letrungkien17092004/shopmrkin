import IMediaRepository, { IncludeOption, OrderByOption } from "../core/applications/interfaces/repositories/IMediaRepository.js";
import { PrismaClient } from "@prisma/client";
import { Media, User, Role } from "../core/entities/index.js"
import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js";

const prisma = new PrismaClient()
export default class MediaRepository implements IMediaRepository {

    /**
     * Create a Media in Database
     * @param options 
     * @returns 
     */
    async create(options: {
        data: {
            fileName: string,
            filePath: string,
            hostname: string,
            media_type: "IMAGE" | "VIDEO",
            size: number,
            userId: string
        },
        include?: IncludeOption
    }): Promise<Media> {
        try {
            if (options.include) {
                const createdMedia = await prisma.media.create({
                    data: options.data,
                    relationLoadStrategy: "join",
                    include: options.include
                })
                return new Media(createdMedia)
            }


            const createdMedia = await prisma.media.create({
                data: options.data
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
                createdAt: createdMedia.createdAt,
                updatedAt: createdMedia.updatedAt
            })
        } catch (error) {
            throw baseExceptionHandler(error) // alway throw REPO_ERROR
        }
    }

    /**
     * Find many media by attribute name
     * @param options 
     */
    async findMany(options: {
        where: Partial<Omit<Media, 'user'>>,
        include?: IncludeOption,
        orderBy?: OrderByOption | OrderByOption[]
    }): Promise<Media[]> {
        try {

            if (options.include) {
                const searchedMedia = await prisma.media.findMany({
                    where: options.where,
                    relationLoadStrategy: "join",
                    include: {
                        user: options.include.user
                    },
                    orderBy: options.orderBy
                })
                return searchedMedia.map(med => new Media(med))
            }
            const searchedMedia = await prisma.media.findMany({
                where: options.where,
                orderBy: options.orderBy
            })

            return searchedMedia.map(med => new Media(med))

        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Find one media by media's id
     * @param options 
     */
    async findOneById(options: {
        where: { id: string },
        include?: IncludeOption
    }): Promise<Media | null> {
        try {
            if (options.include) {
                const found = await prisma.media.findUnique({
                    where: options.where,
                    relationLoadStrategy: "join",
                    include: options.include
                })
                if (!found) { return null }
                return new Media(found)
            }

            const found = await prisma.media.findUnique({
                where: options.where
            })

            return found ? new Media(found) : null
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Modify a media (can only modify the status)
     * @param id 
     * @param options 
     */
    async updateById(options: {
        where: { id: string },
        data: Partial<Media>
    }): Promise<void> {
        try {
            const updatedMedia = await prisma.media.update({
                where: options.where,
                data: {
                    status: options.data.status,
                }
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Delete a media by media's id  and user's id
     * @param options 
     */
    async deleteById(options: {
        where: { id: string, userId: string }
    }): Promise<void> {
        try {
            await prisma.media.delete({
                where: options.where
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
}