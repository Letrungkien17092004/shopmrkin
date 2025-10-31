import { Media } from "../../core/entities/index.js"
import { ENV } from "../../config/env.js"
type ToOutput = {
    id: string,
    fileName: string,
    filePath: string,
    hostname: string,
    media_type: "IMAGE" | "VIDEO",
    user?: {
        username: string,
        role?: string
    },
    product?: {
        id: string,
        name: string,
        description: string,
    }
}
export class MediaDTO {
    /**
     * Transfer to ouput
     * @param media 
     * @returns 
     */
    static toOutputOne(media: Media): ToOutput {
        return {
            id: media.id,
            fileName: media.fileName,
            filePath: media.filePath,
            hostname: ENV.SERVER_NAME,
            media_type: media.media_type,
            user: media.user
                ? {
                    username: media.user.username,
                    role: media.user.role?.roleName
                }
                : undefined
            ,
            product: media.product
                ? {
                    id: media.product.id,
                    name: media.product.name,
                    description: media.product.description,
                }
                : undefined
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
                    hostname: ENV.SERVER_NAME,
                    media_type: med.media_type,
                    user: {
                        username: med.user.username,
                        role: med.user.role?.roleName
                    }
                })
            }
            result.push({
                id: med.id,
                fileName: med.fileName,
                filePath: med.filePath,
                hostname: ENV.SERVER_NAME,
                media_type: med.media_type,
            })
        })
        return result
    }
}


export namespace MediaDTO {
    export type OutputType = ToOutput
}