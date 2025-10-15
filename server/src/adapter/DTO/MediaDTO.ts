import { Media } from "../../core/entities/index.js"

type ToOutput = {
    id: string,
    fileName: string,
    filePath: string,
    hostname: string,
    media_type: "IMAGE" | "VIDEO",
    username?: string
}
export class MediaDTO {
    /**
     * Transfer to ouput
     * @param media 
     * @returns 
     */
    static toOutputOne(media: Media): ToOutput {
        if (media.user) {
            return {
                id: media.id,
                fileName: media.fileName,
                filePath: media.filePath,
                hostname: media.hostname,
                media_type: media.media_type,
                username: media.user.username
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
     * Transfer a array media to ouput
     * @param media 
     * @returns 
     */
    static toOutputMany(media: Media[]): ToOutput[] {
        const result: ToOutput[] = []
        media.map(med => {
            if (med.user) {
                result.push({
                    id: med.id,
                    fileName: med.fileName,
                    filePath: med.filePath,
                    hostname: med.hostname,
                    media_type: med.media_type,
                    username: med.user.username
                })
            }
            result.push({
                id: med.id,
                fileName: med.fileName,
                filePath: med.filePath,
                hostname: med.hostname,
                media_type: med.media_type,
            })
        })
        return result
    }
}


export namespace MediaDTO {
    export type OutputType = ToOutput
}