import { Request, Response } from "express";
import IMediaUsecase from "core/applications/interfaces/usecases/IMediaUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "core/applications/interfaces/usecases/errors.js";
import { z } from "zod"
import { ENV } from "config/env.js";
import { MediaDTO, MediaToOutput } from "adapter/DTO/index.js"
const FilesMulter = z.array(
    z.object({
        fieldname: z.string(),
        originalname: z.string(),
        encoding: z.string(),
        mimetype: z.string(),
        destination: z.string(),
        filename: z.string(),
        path: z.string(),
        size: z.number(),
    })
)
export default class MediaController {
    private usecase: IMediaUsecase

    constructor(usecase: IMediaUsecase) {
        this.usecase = usecase
    }

    createMany = async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    message: "Unauthorized"
                })
            }
            const files = FilesMulter.parse(req.files)
            const media: MediaToOutput[] = []
            for (let i = 0; i < files.length; i++) {
                const createdMedia = await this.usecase.create({
                    fileName: files[i].filename,
                    filePath: `${ENV.UPLOAD_FOLDER}/${files[i].filename}`,
                    hostname: "localhost:8000",
                    media_type: files[i].mimetype.split("/")[0] === "video" ? "VIDEO" : "IMAGE",
                    size: files[i].size,
                    status: "ORPHANED",
                    userId: req.user!.id
                })

                media.push(MediaDTO.toOutputMany(createdMedia))
            }
            res.status(200).json({
                media: media
            })
            return
        } catch (error) {
            console.log(error)
            res.status(500).send("ERROR")
        }
    }
}
