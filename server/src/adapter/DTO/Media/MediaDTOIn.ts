
type MediaDTOINParams = {
    fileName: string,
    filePath: string,
    hostname: string,
    media_type: "VIDEO" | "IMAGE",
    size: number,
    userId: string,
}

type MediaDTOIn = {
    fileName: string,
    filePath: string,
    hostname: string,
    media_type: "VIDEO" | "IMAGE",
    size: number,
    userId: string,
}

export function mediaDTOIn(options: MediaDTOINParams): MediaDTOIn {
    return {
        fileName: options.fileName,
        filePath: options.filePath,
        hostname: options.hostname,
        media_type: options.media_type,
        size: options.size,
        userId: options.userId
    }
}