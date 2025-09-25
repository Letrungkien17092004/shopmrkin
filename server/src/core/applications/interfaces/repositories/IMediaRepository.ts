import { Media } from "core/entities/index.js"


export default interface IMediaRepository {
    create(options: Omit<Media, "id">): Promise<Media>
    getById(id: string): Promise<Media | null>
    updateById(id: string, options: Partial<Media>): Promise<Media>
    deleteById(id: string): Promise<void>
}