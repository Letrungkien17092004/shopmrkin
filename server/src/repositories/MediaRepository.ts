import IMediaRepository, { IncludeOption, OrderByOption } from "../core/applications/interfaces/repositories/IMediaRepository.js";
import { PrismaClient } from "@prisma/client";
import { Media, Product, User } from "../core/entities/index.js"
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
            media_type: "IMAGE" | "VIDEO",
            storage: "internal" | "external",
            status?: "ORPHANED" | "ASSIGNED",
            size: number,
            productId?: string,
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

                const product: Product | undefined = createdMedia.product
                    ? new Product({
                        ...createdMedia.product,
                    })
                    : undefined
                return new Media({
                    ...createdMedia,
                    productId: createdMedia.productId || undefined,
                    product: product
                })
            }


            const createdMedia = await prisma.media.create({
                data: options.data
            })
            return new Media({
                id: createdMedia.id,
                fileName: createdMedia.fileName,
                filePath: createdMedia.filePath,
                media_type: createdMedia.media_type,
                storage: createdMedia.storage,
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
     * create multiple media at once
     * @param options 
     */
    async createMany(options: {
        data: {
            fileName: string,
            filePath: string,
            media_type: "IMAGE" | "VIDEO",
            storage: "internal" | "external",
            status?: "ORPHANED" | "ASSIGNED",
            size: number,
            productId?: string,
            userId: string
        }[],
        include?: IncludeOption
    }): Promise<Media[]> {
        try {
            if (options.include) {
                const createdMediaList = await prisma.media.createManyAndReturn({
                    data: options.data,
                    include: options.include
                })

                const mediaList = createdMediaList.map(med => {
                    const product: Product | undefined = med.product
                        ? new Product({
                            ...med.product,
                        })
                        : undefined
                    const user: User | undefined = med.user
                        ? new User({
                            ...med.user
                        })
                        : undefined
                    return new Media({
                        ...med,
                        productId: med.productId || undefined,
                        product: product,
                        user: user
                    })
                })

                return mediaList
            }


            const createdMediaList = await prisma.media.createManyAndReturn({
                data: options.data
            })
            const mediaList: Media[] = createdMediaList.map(med => {
                    return new Media({
                        ...med,
                        productId: med.productId || undefined,
                    })
                })
            return mediaList
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Find many media by attribute name
     * @param options 
     */
    async findMany(options: {
        where: {
            fileName?: string,
            filePath?: string,
            media_type?: "IMAGE" | "VIDEO",
            storage?: "internal" | "external",
            status?: "ORPHANED" | "ASSIGNED",
            productId?: string,
            userId?: string,
        },
        include?: IncludeOption,
        orderBy?: OrderByOption | OrderByOption[]
    }): Promise<Media[]> {
        try {
            if (options.include) {
                const searchedMedia = await prisma.media.findMany({
                    where: options.where,
                    relationLoadStrategy: "join",
                    include: options.include,
                    orderBy: options.orderBy
                })
                return searchedMedia.map(med => {
                    const product: Product | undefined = med.product ? new Product(med.product) : undefined
                    return new Media({
                        ...med,
                        productId: med.productId || undefined,
                        product: product
                    })
                })
            } // else
            const searchedMedia = await prisma.media.findMany({
                where: options.where,
                orderBy: options.orderBy
            })
            return searchedMedia.map(med => new Media({
                ...med,
                productId: med.productId || undefined
            }))

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
                const product: Product | undefined = found.product
                    ? new Product({
                        ...found.product,
                    })
                    : undefined
                return new Media({
                    ...found,
                    productId: found.productId || undefined,
                    product: product
                })
            }

            const found = await prisma.media.findUnique({
                where: options.where
            })

            return found ? new Media({ ...found, productId: found.productId || undefined }) : null
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Modify a media (can only modify the status and productID)
     * @param id 
     * @param options 
     */
    async updateById(options: {
        where: { id: string },
        data: { status?: "ORPHANED" | "ASSIGNED", productId?: string }
    }): Promise<void> {
        try {
            await prisma.media.update({
                where: options.where,
                data: {
                    // If productId is updated, status will be updated to ASSIGNED.
                    status: options.data.productId ? "ASSIGNED" : options.data.status,
                    productId: options.data.productId
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