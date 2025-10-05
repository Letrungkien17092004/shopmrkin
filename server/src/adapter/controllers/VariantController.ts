import IVariantUsecase from "core/applications/interfaces/usecases/IVariantUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "core/applications/interfaces/usecases/errors.js";
import { Request, Response } from "express";

import { VariantDTO } from "adapter/DTO/index.js"

import { z } from "zod"

export default class VariantController {
    private usecase: IVariantUsecase

    constructor(usecase: IVariantUsecase) {
        this.usecase = usecase
    }

    create = async (req: Request, res: Response): Promise<void> => {
        try {

            if (!req.user) {
                res.status(401).json({
                    message: "Unauthorized"
                })
                return
            }

            if (req.user.role.toLowerCase() != "administrator") {
                res.status(403).json({
                    message: "require administrator role"
                })
                return
            }

            const CreateDataSchema = z.object({
                fields: z.object({
                    name: z.string().min(5).max(50),
                    sku: z.string().min(5).max(20),
                    productId: z.string(),
                    price: z.number(),
                    stock: z.number(),
                }),
                include: z.enum(["0", "1"]).optional()
            })

            const createData = CreateDataSchema.parse({
                fields: req.body,
                include: req.query.include
            })

            const dataToCreate = VariantDTO.toInputSingle({ ...createData.fields, userId: req.user.id })

            const createdVariant = await this.usecase.create({
                ...dataToCreate,
                include: Boolean(Number(createData.include))
            })
            res.status(201).json({
                variant: VariantDTO.toOutputSingle(createdVariant)
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

    findMany = async (req: Request, res: Response): Promise<void> => {
        try {
            const FindManyOption = z.object({
                fields: z.object({
                    name: z.string().optional(),
                    sku: z.string().optional(),
                    productId: z.string().optional(),
                    userId: z.string().optional(),
                }),
                limit: z.number().optional(),
                offset: z.number().optional(),
                include: z.enum(["0", "1"]).optional()
            })

            const findManyOption = FindManyOption.parse({
                fields: {
                    name: req.query.name,
                    sku: req.query.sku,
                    productId: req.query.productId,
                    userId: req.query.userId
                },
                limit: Number(req.query.limit) || undefined,
                offset: Number(req.query.offset) || undefined,
                include: req.query.include
            })

            const variants = await this.usecase.findMany({
                fields: findManyOption.fields,
                limit: findManyOption.limit,
                offset: findManyOption.offset,
                include: Boolean(Number(findManyOption.include))
            })
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

    findOneById = async (req: Request, res: Response): Promise<void> => {
        try {
            const ReqDataSchema = z.object({
                variantId: z.string(),
                include: z.enum(["0", "1"]).optional()
            })

            const reqData = ReqDataSchema.parse({
                variantId: req.params['id'],
                include: req.query.include
            })

            console.log("id: ", reqData.variantId)
            const searchedVariant = await this.usecase.findOneById({
                id: reqData.variantId,
                include: Boolean(Number(reqData.include))
            })

            if (!searchedVariant) {
                res.status(404).json({
                    message: "Variant not found"
                })
                return
            }

            res.status(200).json({
                variant: VariantDTO.toOutputSingle(searchedVariant)
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

    updateById = async (req: Request, res: Response): Promise<void> => {
        try {

            if (!req.user) {
                res.status(401).json({
                    message: "Unauthorized"
                })
                return
            }

            if (req.user.role.toLowerCase() != "administrator") {
                res.status(403).json({
                    message: "require administrator role"
                })
                return
            }

            const UpdateDataSchema = z.object({
                variantId: z.string(),
                fields: z.object({
                    name: z.string().min(5).max(50).optional(),
                    sku: z.string().min(5).max(20).optional(),
                    price: z.number().optional(),
                    stock: z.number().optional(),
                }),
                include: z.enum(["0", "1"]).optional()
            })

            const updateData = UpdateDataSchema.parse({
                variantId: req.params['id'],
                fields: req.body,
                include: req.query.include
            })

            const updatedVariant = await this.usecase.updateById({
                id: updateData.variantId,
                fields: updateData.fields,
                userId: req.user.id,
                include: Boolean(Number(updateData.include))
            })

            res.status(200).json({
                variant: VariantDTO.toOutputSingle(updatedVariant)
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

    deleteById = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    message: "Unauthorized"
                })
                return
            }

            if (req.user.role.toLowerCase() != "administrator") {
                res.status(403).json({
                    message: "require administrator role"
                })
                return
            }

            const variantId = req.params['id']
            await this.usecase.deleteById({
                id: variantId,
                userId: req.user.id
            })
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
