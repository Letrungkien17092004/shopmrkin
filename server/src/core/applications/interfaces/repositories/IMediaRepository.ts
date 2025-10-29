import { Media } from "../../../../core/entities/index.js"

export type SortOrder = "asc" | "desc"

export type IncludeOption = {
    user?: boolean,
}

export type OrderByOption = Partial<Record<keyof Omit<Media, "user">, SortOrder>>

export default interface IMediaRepository {

    /**
     * Create a media
     * @param options 
     */
    create(options: {
        data: {
            fileName: string,
            filePath: string,
            hostname: string,
            media_type: "IMAGE" | "VIDEO",
            size: number,
            userId: string
        },
        include?: IncludeOption
    }): Promise<Media>

    /**
     * Find many media by attribute name
     * @param options 
     */
    findMany(options: {
        where: Partial<Omit<Media, 'user'>>,
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
     * Update media by media's id
     */
    updateById(options: {
        where: { id: string },
        data: Partial<Media>
    }): Promise<void>

    /**
     * Delete a media by media's id  and user's id
     * @param options 
     */
    deleteById(options: {
        where: { id: string, userId: string }
    }): Promise<void>
}