import { Media } from "services/postgresSQL/generated/prisma/client/index.js"

export type MediaDTOOut = {
    id: string,
    filePath: string,
    hostname: string,
    media_type: "VIDEO" | "IMAGE",
    userId: string,
    createdAt: Date,
    updatedAt: Date
}

export function mediaDTOOut(options: Media): MediaDTOOut {
    return {
        id: options.id,
        filePath: options.filePath,
        hostname: options.hostname,
        media_type: options.media_type,
        userId: options.userId,
        createdAt: options.createdAt,
        updatedAt: options.createdAt
    }
}