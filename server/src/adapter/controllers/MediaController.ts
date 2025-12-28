import { Request, Response } from "express"
import { z } from "zod"
import IMediaUsecase from "../../core/applications/interfaces/usecases/IMediaUsecase.js"
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../../core/applications/interfaces/usecases/errors.js"
import { MediaDTO } from "../../adapter/DTO/index.js"
import { ENV } from "../../config/env.js"

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
    private mediaUsecase: IMediaUsecase

    constructor(mediaUsecase: IMediaUsecase) {
        this.mediaUsecase = mediaUsecase
    }

    /**
     * Create a single media
     * @param req 
     * @param res 
     * @returns 
     */
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    message: "Unauthorized!"
                })
                return
            }

            const QuerySchema = z.object({
                include: z.object({
                    user: z.string().optional(),
                    product: z.string().optional()
                }).optional()
            }).optional()

            const CreateOptionSchema = z.object({
                data: z.object({
                    fileName: z.string(),
                    filePath: z.string(),
                    hostname: z.string(),
                    media_type: z.enum(["IMAGE", "VIDEO"]),
                    size: z.number().positive(),
                    productId: z.string().optional()
                }),
                include: z.object({
                    user: z.boolean().optional(),
                    product: z.boolean().optional()
                }).optional()
            })

            // parse the query and body
            const queryParsed = QuerySchema.parse(req.query)
            const createOptionParsed = CreateOptionSchema.parse({
                data: req.body,
                include: queryParsed && queryParsed.include
                    ? {
                        user: queryParsed.include.user === "true",
                        product: queryParsed.include.product === "true"
                    }
                    : undefined
            })

            const createdMedia = await this.mediaUsecase.create({
                ...createOptionParsed,
                data: {
                    ...createOptionParsed.data,
                    storage: "internal",
                    userId: req.user.id
                }
            })

            res.status(201).json({
                media: MediaDTO.toOutputOne(createdMedia, req)
            })
            return
        } catch (error) {
            console.log(error)
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.FK_CONSTRAINT:
                        res.status(409).json({
                            message: "conflix"
                        })
                        return
                    case USECASE_ERROR_CODE.INITIAL:
                        res.status(500).json({
                            message: "Server Internal Error!"
                        })
                        return
                }
            }

            if (error instanceof z.ZodError) {
                res.status(400).json({
                    message: "Invalid request format!",
                })
                return
            }

            res.status(500).json({
                message: "Server Internal Error!"
            })
            return
        }
    }

    /**
     * Upload multiple media files
     * @param req 
     * @param res 
     * @returns 
     */
    upload = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    message: "Unauthorized!"
                })
                return
            }

            if (!req.files || !Array.isArray(req.files)) {
                res.status(400).json({
                    message: "No files were uploaded!"
                })
                return
            }

            const QuerySchema = z.object({
                include: z.object({
                    user: z.string().optional(),
                    product: z.string().optional()
                }).optional()
            }).optional()
            const user = req.user
            const queryParsed = QuerySchema.parse(req.query)

            const files = FilesMulter.parse(req.files)
            const createdMediaList = await this.mediaUsecase.createMany({
                data: files.map(file => ({
                    fileName: file.filename,
                    filePath: `${ENV.UPLOAD_FOLDER}/${file.filename}`,
                    media_type: file.mimetype.split("/")[0] === "video" ? "VIDEO" : "IMAGE",
                    storage: "internal",
                    size: file.size,
                    userId: user.id
                })),
                include: queryParsed && queryParsed.include
                    ? {
                        user: queryParsed.include.user === "true",
                        product: queryParsed.include.product === "true"
                    }
                    : undefined
            })

            const mediaListDto = MediaDTO.toOutputMany(createdMediaList, req)
            res.status(201).json({
                media: mediaListDto
            })
            return
        } catch (error) {
            console.log(error)
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.INITIAL:
                        res.status(500).json({
                            message: "Server Internal Error!"
                        })
                }
            }

            if (error instanceof z.ZodError) {
                res.status(400).json({
                    message: "Invalid request format!",
                })
                return
            }

            res.status(500).json({
                message: "Server Internal Error!"
            })
            return
        }
    }

    /**
     * Find many media
     * @param req 
     * @param res 
     */
    findMany = async (req: Request, res: Response): Promise<void> => {
        try {
            const QuerySchema = z.object({
                fileName: z.string().optional(),
                filePath: z.string().optional(),
                hostname: z.string().optional(),
                media_type: z.enum(["IMAGE", "VIDEO"]).optional(),
                status: z.enum(["ORPHANED", "ASSIGNED"]).optional(),
                productId: z.string().optional(),
                userId: z.string().optional(),
                include: z.object({
                    user: z.string().optional(),
                    product: z.string().optional()
                }).optional(),
            }).optional()

            const queryParsed = QuerySchema.parse(req.query)

            const { include, ...whereOptions } = queryParsed || {}

            const media = await this.mediaUsecase.findMany({
                where: whereOptions || {},
                include: include
                    ? {
                        user: include.user === "true",
                        product: include.product === "true"
                    }
                    : undefined,
            })

            res.status(200).json({
                media: MediaDTO.toOutputMany(media, req)
            })
            return
        } catch (error) {
            console.log(error)
            if (error instanceof USECASE_ERROR) {
                res.status(500).json({
                    message: "Server internal error"
                })
                return
            }
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    message: "Invalid query parameters!",
                })
                return
            }

            res.status(500).json({
                message: "Server Internal Error!"
            })
            return
        }
    }

    /**
     * Find one media by ID
     * @param req 
     * @param res 
     */
    findOneById = async (req: Request, res: Response): Promise<void> => {
        try {
            const QuerySchema = z.object({
                include: z.object({
                    user: z.string().optional(),
                    product: z.string().optional()
                }).optional()
            }).optional()

            const queryParsed = QuerySchema.parse(req.query)

            const media = await this.mediaUsecase.findOneById({
                where: { id: req.params.id },
                include: queryParsed?.include
                    ? {
                        user: queryParsed.include.user === "true",
                        product: queryParsed.include.product === "true"
                    }
                    : undefined
            })

            if (!media) {
                res.status(404).json({
                    message: "Media not found!"
                })
                return
            }

            res.status(200).json({
                media: MediaDTO.toOutputOne(media, req)
            })
            return
        } catch (error) {
            console.log(error)
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.NOTFOUND:
                        res.status(404).json({
                            message: "Media is not found"
                        })
                        return
                }
                res.status(500).json({
                    message: "Server internal error"
                })
                return
            }

            if (error instanceof z.ZodError) {
                res.status(400).json({
                    message: "Invalid query parameters!",
                })
                return
            }

            res.status(500).json({
                message: "Server Internal Error!"
            })
            return
        }
    }

    /**
     * Update media by ID (can only update status)
     * @param req 
     * @param res 
     */
    updateById = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    message: "Unauthorized!"
                })
                return
            }

            const UpdateSchema = z.object({
                status: z.enum(["ORPHANED", "ASSIGNED"]).optional(),
                productId: z.string().optional()

            })

            const updateDataParsed = UpdateSchema.parse(req.body)

            await this.mediaUsecase.updateById({
                where: {
                    id: req.params.id
                },
                data: updateDataParsed
            })

            res.status(200).json({
                message: "Media updated successfully!"
            })
            return
        } catch (error) {
            console.log(error)
            if (error instanceof USECASE_ERROR) {
                res.status(500).json({
                    message: "Server Internal Error"
                })
                return
            }

            if (error instanceof z.ZodError) {
                res.status(400).json({
                    message: "Invalid request format!",
                })
                return
            }

            res.status(500).json({
                message: "Server Internal Error!"
            })
            return
        }
    }

    /**
     * Delete media by ID
     * @param req 
     * @param res 
     */
    deleteById = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    message: "Unauthorized!"
                })
                return
            }

            await this.mediaUsecase.deleteById({
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            })

            res.status(200).json({
                message: "Media deleted successfully!"
            })
            return
        } catch (error) {
            console.log(error)
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.NOTFOUND:
                        res.status(404).json({
                            message: "Media is not found"
                        })
                        return
                }
                res.status(500).json({
                    message: "Server Internal Error"
                })
                return
            }

            res.status(500).json({
                message: "Server Internal Error!"
            })
            return
        }
    }
}
