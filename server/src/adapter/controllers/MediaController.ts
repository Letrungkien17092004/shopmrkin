import { Request, Response } from "express";
import IMediaUsecase from "../../core/applications/interfaces/usecases/IMediaUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../../core/applications/interfaces/usecases/errors.js";
import { z } from "zod"
import { ENV } from "../../config/env.js";
import { MediaDTO } from "../../adapter/DTO/index.js"
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
            const media: MediaDTO.OutputType[] = []
            for (let i = 0; i < files.length; i++) {
                const createdMedia = await this.usecase.create({
                    fileName: files[i].filename,
                    filePath: `${ENV.UPLOAD_FOLDER}/${files[i].filename}`,
                    hostname: ENV.SERVER_NAME,
                    media_type: files[i].mimetype.split("/")[0] === "video" ? "VIDEO" : "IMAGE",
                    size: files[i].size,
                    status: "ORPHANED",
                    userId: req.user!.id
                })

                media.push(MediaDTO.toOutputOne(createdMedia))
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

    /**
     * Assign a list media to a product
     * @param req 
     * @param res 
     */
    assignMediaToProduct = async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    message: "Unauthorized"
                })
            }
            const BodySchema = z.object({
                listMediaId: z.array(z.string()).min(1),
                productId: z.string()
            })
            const { listMediaId, productId } = BodySchema.parse(req.body)
            const mediaOutput: MediaDTO.OutputType[] = []
            for (let i = 0; i < listMediaId.length; i++) {
                const medId = listMediaId[i]!
                mediaOutput.push(await this.usecase.assignMediaToProduct(medId, productId))
            }
            res.status(200).json({
                media: mediaOutput
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(40).json({
                    message: "invalid body data"
                })
                return
            }
            res.status(500).json({
                error: error
            })
        }
    }
}
