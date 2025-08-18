import { VariantMapper } from "adapter/mappers/VariantMapper.js";
import IVariantUsecase from "core/applications/interfaces/usecases/IVariantUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "core/applications/interfaces/usecases/errors.js";
import { Request, Response } from "express";
import { z } from "zod"

export default class VariantController {
    private usecase: IVariantUsecase

    constructor(usecase: IVariantUsecase) {
        this.usecase = usecase

        this.create = this.create.bind(this)
        this.findWithId = this.findWithId.bind(this)
        this.updateById = this.updateById.bind(this)
        this.deleteById = this.deleteById.bind(this)
    }

    async create(req: Request, res: Response): Promise<void> {
        try {

            if (!req.author) {
                res.status(401).json({
                    message: "Unauthorized"
                })
                return
            }

            if (req.author.role.toLowerCase() != "administrator") {
                res.status(403).json({
                    message: "require administrator role"
                })
                return
            }

            const VariantSchema = z.object({
                name: z.string().min(5).max(50),
                sku: z.string().min(5).max(20),
                productId: z.string(),
                price: z.number(),
                stock: z.number(),
            })

            const dataToCreate = VariantSchema.parse(req.body)

            const createdVariant = await this.usecase.create({
                ...dataToCreate,
                authorId: req.author.id
            })
            res.status(201).json({
                variant: createdVariant
            })
            return
        } catch (error) {
            console.log(error)
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.EXISTED:
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

    async findWithId(req: Request, res: Response): Promise<void> {
        try {
            const variantId = req.params['id']
            const searchedVariant = await this.usecase.getById(variantId)

            if (!searchedVariant) {
                res.status(404).json({
                    message: "Variant not found"
                })
                return
            }

            res.status(200).json({
                variant: VariantMapper.toOutputSafe(searchedVariant)
            })
            return
        } catch (error) {
            res.status(500).json({
                message: "Server Internal Error!"
            })
            return
        }
    }

    async updateById(req: Request, res: Response): Promise<void> {
        try {

            if (!req.author) {
                res.status(401).json({
                    message: "Unauthorized"
                })
                return
            }

            if (req.author.role.toLowerCase() != "administrator") {
                res.status(403).json({
                    message: "require administrator role"
                })
                return
            }

            const variantId = req.params['id']
            const VariantSchema = z.object({
                name: z.string().min(5).max(50).optional(),
                sku: z.string().min(5).max(20).optional(),
                price: z.number().optional(),
                stock: z.number().optional(),
            })

            const dataToUpdate = VariantSchema.parse(req.body)

            const updatedVariant = await this.usecase.updateById(variantId, req.author.id, dataToUpdate)

            res.status(200).json({
                variant: VariantMapper.toOutputSafe(updatedVariant)
            })
            return
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

    async deleteById(req: Request, res: Response): Promise<void> {
        try {
            if (!req.author) {
                res.status(401).json({
                    message: "Unauthorized"
                })
                return
            }

            if (req.author.role.toLowerCase() != "administrator") {
                res.status(403).json({
                    message: "require administrator role"
                })
                return
            }

            const variantId = req.params['id']

            // try delete
            await this.usecase.deleteByID(variantId, req.author.id)
            res.status(200).json({
                message: "Delete successfuly"
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

            res.status(500).json({
                message: "Server Internal Error!"
            })
            return
        }
    }
}
