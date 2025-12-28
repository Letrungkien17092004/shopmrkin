import { Media } from "../../core/entities/index.js"
import { Request } from "express"
type ToOutput = {
    id: string,
    fileName: string,
    filePath: string,
    media_type: "IMAGE" | "VIDEO",
}
export class MediaDTO {

    /**
     * Transfer to ouput
     * @param media 
     * @returns 
     */
    static toOutputOne(media: Media, req: Request): ToOutput {
        if (media.storage === "internal") {
            return {
                id: media.id,
                fileName: media.fileName,
                filePath: `${req.protocol}://${req.host}` + media.filePath,
                media_type: media.media_type,
            }
        }
        // storage external (AWS, GG Cloud,...)
        return {
            id: media.id,
            fileName: media.fileName,
            filePath: media.filePath,
            media_type: media.media_type,
        }
    }

    /**
     * Transfer a array media to ouput
     * @param media 
     * @returns 
     */
    static toOutputMany(media: Media[], req: Request): ToOutput[] {
        const result: ToOutput[] = media.map(med => {
            return MediaDTO.toOutputOne(med, req)
        })
        return result
    }
}


export namespace MediaDTO {
    export type OutputType = ToOutput
}