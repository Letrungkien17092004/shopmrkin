import { Request, Response } from "express";
import IProductUsecase from "core/applications/interfaces/usecases/IProductUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "core/applications/interfaces/usecases/errors.js";
import { z } from "zod"
import { ProductDTO } from "adapter/DTO/index.js"

// CONSTANT
const MAX_NAME_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 1000

const MIN_NAME_LENGTH = 5
const MIN_DESCRIPTION_LENGTH = 5


export default class ProductController {
    private productUsecase: IProductUsecase

    constructor(productUsecase: IProductUsecase) {
        this.productUsecase = productUsecase
    }

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    message: "Unauthorized"
                })
                return
            }

            // not an admin
            if (req.user.role.toLowerCase() != "administrator") {
                res.status(403).json({
                    message: "require administrator role"
                })
                return
            }

            const CreateDataSchema = z.object({
                fields: z.object({
                    name: z.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH),
                    description: z.string().min(MIN_DESCRIPTION_LENGTH).max(MAX_DESCRIPTION_LENGTH),
                    categoryId: z.number()
                }),
                include: z.enum(["0", "1"]).optional()
            })

            // parser the body
            const createDataSchema = CreateDataSchema.parse({
                fields: req.body,
                include: req.query.include
            })

            const createdProduct = await this.productUsecase.create({
                ...createDataSchema.fields,
                userId: req.user.id,
                include: Boolean(Number(createDataSchema.include))
            })

            res.status(201).json({
                product: createdProduct
            })
            return
        } catch (error) {
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.INITIAL:
                        res.status(500).json({
                            message: "Server Internal Error!"
                        })
                        return
                    case USECASE_ERROR_CODE.EXISTED:
                        res.status(409).json({
                            message: "Product already exist"
                        })
                        return
                    case USECASE_ERROR_CODE.CONSTRAINT:
                        res.status(404).json({
                            message: "User or Category not found"
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
                    categoryId: z.number().optional(),
                    userId: z.string().optional(),
                }),
                limit: z.number().optional(),
                offset: z.number().optional(),
                include: z.enum(["0", "1"]).optional()
            })

            const findManyOption = FindManyOption.parse({
                fields: z.object({
                    categoryId: Number(req.query.categoryId),
                    userId: req.query.userId,
                }),
                limit: Number(req.query.limit),
                offset: Number(req.query.offset),
                include: req.query.include
            })

            const products = await this.productUsecase.findMany({
                fields: findManyOption.fields,
                limit: Number(req.query.limit),
                offset: Number(req.query.offset),
                include: Boolean(Number(req.query.include))
            })
            res.status(200).json({
                products: ProductDTO.toOutputMany(products)
            })
        } catch (error) {
            console.log(error)
            if (error instanceof USECASE_ERROR) {
                if (error.code === USECASE_ERROR_CODE.INITIAL) {
                    res.status(500).json({
                        message: "Database Error"
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

    findOneByCode = async (req: Request, res: Response): Promise<void> => {
        try {

            const FindOption = z.object({
                product_code: z.number(),
                include: z.enum(["0", "1"]).optional()
            })

            const findOption = FindOption.parse({
                product_code: Number(req.params["product_code"]),
                include: req.query.include
            })

            const searchedProduct = await this.productUsecase.findOneByCode({
                product_code: findOption.product_code,
                include: Boolean(Number(findOption.include))
            })
            if (!searchedProduct) {
                res.status(404).json({
                    message: "Product not found"
                })
                return
            }

            res.status(200).json({
                product: ProductDTO.toInputSingle(searchedProduct)
            })
            return
        } catch (error) {
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.INITIAL:
                        res.status(500).json({
                            message: "Server Internal Error!"
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

    findOneById = async (req: Request, res: Response): Promise<void> => {
        try {

            const FindOption = z.object({
                id: z.string(),
                include: z.enum(["0", "1"]).optional()
            })

            const findOption = FindOption.parse({
                id: req.params["id"],
                include: req.query.include
            })

            const searchedProduct = await this.productUsecase.findOneById({
                id: findOption.id,
                include: Boolean(Number(findOption.include))
            })
            if (!searchedProduct) {
                res.status(404).json({
                    message: "Product not found"
                })
                return
            }

            res.status(200).json({
                product: ProductDTO.toOutputSingle(searchedProduct)
            })
            return
        } catch (error) {
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.INITIAL:
                        res.status(500).json({
                            message: "Server Internal Error!"
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

            const UpdateOption = z.object({
                id: z.string(),
                fields: z.object({
                    name: z.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH).optional(),
                    description: z.string().min(MIN_DESCRIPTION_LENGTH).max(MAX_DESCRIPTION_LENGTH).optional(),
                    categoryId: z.number().optional()
                }),
                include: z.enum(["0", "1"]).optional()
            })

            const updateOption = UpdateOption.parse({
                id: req.params["id"],
                fields: req.body,
                include: req.query.include
            })

            const updatedProduct = await this.productUsecase.updateById({
                id: updateOption.id,
                userId: req.user.id,
                fields: updateOption.fields,
                include: Boolean(Number(updateOption.include))
            })

            res.status(200).json({
                product: ProductDTO.toOutputSingle(updatedProduct)
            })
            return
        } catch (error) {
            console.log(error)
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.NOTFOUND:
                        res.status(404).json({
                            message: "Product not found, or User not match with authorId"
                        })
                        return
                    case USECASE_ERROR_CODE.CONSTRAINT:
                        res.status(404).json({
                            message: "wrong constrant (authorId, categoryId,...)"
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

            const id = req.params["id"]
            await this.productUsecase.deleteById({
                id: id,
                userId: req.user.id
            })

            res.status(200).json({
                message: "OK"
            })
            return
        } catch (error) {
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.INITIAL:
                        res.status(404).json({
                            message: "Database error"
                        })
                        return
                    case USECASE_ERROR_CODE.NOTFOUND:
                        res.status(404).json({
                            message: "Product not found or you don't own this resoucre"
                        })
                        return
                }
            }

            res.status(500).json({
                message: "Server Internal Error!"
            })
        }
    }
}