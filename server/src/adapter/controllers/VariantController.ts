import { Request, Response } from "express"
import { z } from "zod"
import IVariantUsecase from "../../core/applications/interfaces/usecases/IVariantUsecase.js"
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../../core/applications/interfaces/usecases/errors.js"
import { VariantDTO } from "../DTO/index.js"

// CONSTANT
const MAX_NAME_LENGTH = 200
const MIN_NAME_LENGTH = 1

export default class VariantController {
    private variantUsecase: IVariantUsecase

    constructor(variantUsecase: IVariantUsecase) {
        this.variantUsecase = variantUsecase
    }

    /**
     * Create new variant
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

            // if not admin
            if (req.user.role.toLowerCase() != "administrator") {
                res.status(403).json({
                    message: "Forbidden!"
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
                    name: z.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH),
                    sku: z.string(),
                    price: z.number().positive(),
                    stock: z.number().int().min(0),
                    productId: z.string()
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

            const createdVariant = await this.variantUsecase.create({
                ...createOptionParsed,
                data: {
                    ...createOptionParsed.data,
                    userId: req.user.id
                }
            })
            res.status(201).json({
                variant: VariantDTO.toOutputSingle(createdVariant)
            })
            return
        } catch (error) {
            console.log(error)
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.CONFLIX:
                        res.status(409).json({
                            message: "variant already exist"
                        })
                        return
                    case USECASE_ERROR_CODE.CONSTRAINT:
                        res.status(404).json({
                            message: "product or user not found"
                        })
                        return
                }
            }

            if (error instanceof z.ZodError) {
                res.status(400).json({
                    message: "Invalid input"
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
     * Retrives a list of variant
     * @param req 
     * @param res 
     */
    findMany = async (req: Request, res: Response): Promise<void> => {
        try {
            const QuerySchema = z.object({
                name: z.string().optional(),
                sku: z.string().optional(),
                productId: z.string().optional(),
                userId: z.string().optional(),
                limit: z.string().optional(),
                offset: z.string().optional(),
                include: z.object({
                    product: z.string().optional(),
                    user: z.string().optional(),
                }).optional()
            }).optional()

            const FindManyOption = z.object({
                where: z.object({
                    name: z.string().optional(),
                    sku: z.string().optional(),
                    productId: z.string().optional(),
                    userId: z.string().optional(),
                }),
                include: z.object({
                    product: z.boolean().optional(),
                    user: z.boolean().optional(),
                }).optional(),
                limit: z.number().optional(),
                offset: z.number().optional(),
            })

            const queryParsed = QuerySchema.parse(req.query)
            const optionParsed = FindManyOption.parse({
                where: queryParsed
                    ? {
                        name: queryParsed.name,
                        sku: queryParsed.sku,
                        productId: queryParsed.productId,
                        userId: queryParsed.userId
                    }
                    : undefined,
                limit: queryParsed && queryParsed.limit ? parseInt(queryParsed.limit) : undefined,
                offset: queryParsed && queryParsed.offset ? parseInt(queryParsed.offset) : undefined,
                include: queryParsed && queryParsed.include
                    ? {
                        product: queryParsed.include.product === "true",
                        user: queryParsed.include.user === "true",
                    }
                    : undefined
            })

            const variants = await this.variantUsecase.findMany(optionParsed)
            res.status(200).json({
                variants: VariantDTO.toOutputMany(variants)
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: "Something went wrong"
            })
        }
    }

    /**
     * Retrives one variant by id
     * @param req 
     * @param res 
     */
    findOneById = async (req: Request, res: Response): Promise<void> => {
        try {
            const QuerySchema = z.object({
                include: z.object({
                    product: z.string().optional(),
                    user: z.string().optional(),
                }).optional()
            }).optional()

            const FindOneOption = z.object({
                where: z.object({
                    id: z.string()
                }),
                include: z.object({
                    product: z.boolean().optional(),
                    user: z.boolean().optional(),
                }).optional()
            })

            const queryParsed = QuerySchema.parse(req.query)
            const optionParsed = FindOneOption.parse({
                where: {
                    id: req.params.id
                },
                include: queryParsed && queryParsed.include
                    ? {
                        product: queryParsed.include.product === "true",
                        user: queryParsed.include.user === "true",
                    }
                    : undefined
            })

            const variant = await this.variantUsecase.findOneById(optionParsed)

            if (!variant) {
                res.status(404).json({
                    message: "Variant not found"
                })
                return
            }

            res.status(200).json({
                variant: VariantDTO.toOutputSingle(variant)
            })
            return
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: "Server Internal Error!"
            })
            return
        }
    }

    /**
     * Update one variant by id
     * @param req 
     * @param res 
     * @returns 
     */
    updateById = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    message: "Unauthorized!"
                })
                return
            }

            // if not admin
            if (req.user.role.toLowerCase() != "administrator") {
                res.status(403).json({
                    message: "Forbidden!"
                })
                return
            }

            const UpdateOptionSchema = z.object({
                where: z.object({
                    id: z.string(),
                    userId: z.string()
                }),
                data: z.object({
                    name: z.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH).optional(),
                    sku: z.string().optional(),
                    price: z.number().positive().optional(),
                    stock: z.number().int().min(0).optional(),
                })
            })

            const optionParsed = UpdateOptionSchema.parse({
                where: {
                    id: req.params.id,
                    userId: req.user.id
                },
                data: req.body
            })

            await this.variantUsecase.updateById(optionParsed)
            res.status(200).json({
                message: "Update variant successfully"
            })
        } catch (error) {
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.NOTFOUND:
                        res.status(404).json({
                            message: "Variant not found or not owned"
                        })
                        return
                }
            }

            if (error instanceof z.ZodError) {
                res.status(400).json({
                    message: "Invalid input"
                })
            }
            return
        }
    }

    /**
     * Delete by id
     * @param req 
     * @param res 
     * @returns 
     */
    deleteById = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    message: "Unauthorized!"
                })
                return
            }

            // if not admin
            if (req.user.role.toLowerCase() != "administrator") {
                res.status(403).json({
                    message: "Forbidden!"
                })
                return
            }

            await this.variantUsecase.deleteById({
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            })

            res.status(200).json({
                message: "Delete variant successfully"
            })
        } catch (error) {
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.NOTFOUND:
                        res.status(404).json({
                            message: error.message
                        })
                        return
                }
            }
            res.status(500).json({
                message: "Server internal error"
            })
            return
        }
    }
}
