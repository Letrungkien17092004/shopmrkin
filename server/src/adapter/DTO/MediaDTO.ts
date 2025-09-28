import { Media } from "core/entities/index.js"

export type ToOutput = {
    id: string,
    fileName: string,
    filePath: string,
    hostname: string,
    media_type: "IMAGE" | "VIDEO",
    username?: string
}

export default class MediaDTO {
    /**
     * Transfer to ouput
     * @param media 
     * @returns 
     */
    static toOutputSingle(media: Media): ToOutput {
        if (media.user) {
            return {
                id: media.id,
                fileName: media.fileName,
                filePath: media.filePath,
                hostname: media.hostname,
                media_type: media.media_type,
                username: media.user.role?.roleName
            }
        }
        return {
            id: media.id,
            fileName: media.fileName,
            filePath: media.filePath,
            hostname: media.hostname,
            media_type: media.media_type,
        }
    }

    /**
     * Transfer to ouput
     * @param media 
     * @returns 
     */
    static toOutputMany(media: Media): ToOutput {
        if (media.user) {
            return {
                id: media.id,
                fileName: media.fileName,
                filePath: media.filePath,
                hostname: media.hostname,
                media_type: media.media_type,
                username: media.user.role?.roleName
            }
        }
        return {
            id: media.id,
            fileName: media.fileName,
            filePath: media.filePath,
            hostname: media.hostname,
            media_type: media.media_type,
        }
    }
}