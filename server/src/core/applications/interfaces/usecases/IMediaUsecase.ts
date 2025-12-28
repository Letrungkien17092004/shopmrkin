import { Media } from "../../../../core/entities/index.js"
import { IncludeOption, OrderByOption } from "../repositories/IMediaRepository.js"

export default interface IMediaUsecase {

    /**
     * Create a media
     * @param options 
     */
    create(options: {
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
    }): Promise<Media>

    /**
     * create multiple media at once
     * @param options 
     */
    createMany(options: {
        data: {
            fileName: string,
            filePath: string,
            media_type: "IMAGE" | "VIDEO",
            storage?: "internal" | "external",
            status?: "ORPHANED" | "ASSIGNED",
            size: number,
            productId?: string,
            userId: string
        }[],
        include?: IncludeOption
    }): Promise<Media[]>

    /**
     * Find many media by attribute name
     * @param options 
     */
    findMany(options: {
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
    }): Promise<Media[]>

    /**
     * Find one media by media's id
     * @param options 
     */
    findOneById(options: {
        where: { id: string },
        include?: IncludeOption
    }): Promise<Media | null>

    /**
     * Update media by media's id (can only modify media's status and productId)
     */
    updateById(options: {
        where: { id: string },
        data: { status?: "ORPHANED" | "ASSIGNED", productId?: string }
    }): Promise<void>

    /**
     * Delete a media by media's id  and user's id
     * @param options 
     */
    deleteById(options: {
        where: { id: string, userId: string }
    }): Promise<void>
}