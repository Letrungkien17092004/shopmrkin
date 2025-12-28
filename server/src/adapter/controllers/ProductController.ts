import { Request, Response } from "express";
import IProductUsecase from "../../core/applications/interfaces/usecases/IProductUsecase.js";
import IProductEmbeddingUsecase from "../../core/applications/interfaces/usecases/IProductEmbeddingUsecase.js";
import EmbeddingService from "../../services/embeddingService/EmbeddingService.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../../core/applications/interfaces/usecases/errors.js";
import { includes, object, z } from "zod"
import { ProductDTO } from "../../adapter/DTO/index.js"

// CONSTANT
const MAX_NAME_LENGTH = 200

const MIN_NAME_LENGTH = 1
const MIN_DESCRIPTION_LENGTH = 1


export default class ProductController {
    private productUsecase: IProductUsecase
    private productEmbeddingUsecase: IProductEmbeddingUsecase
    private emdeddingService: EmbeddingService

    constructor(
        productUsecase: IProductUsecase, 
        productEmbeddingUsecase: IProductEmbeddingUsecase,
        emdeddingService: EmbeddingService
    ) {
        this.productUsecase = productUsecase
        this.productEmbeddingUsecase = productEmbeddingUsecase
        this.emdeddingService = emdeddingService
    }

    /**
     * Create new product
     * @param req 
     * @param res 
     * @returns
     */
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    message: "Unauthorized"
                })
                return
            }

            // if not admin
            if (req.user.role.toLowerCase() != "administrator") {
                res.status(403).json({
                    message: "require administrator role"
                })
                return
            }

            const QuerySchema = z.object({
                include: z.object({
                    user: z.string().optional(),
                    media: z.string().optional(),
                    variants: z.string().optional(),
                    category: z.string().optional()
                }).optional()
            }).optional()

            const CreateOptionSchema = z.object({
                data: z.object({
                    name: z.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH),
                    description: z.string().min(MIN_DESCRIPTION_LENGTH),
                    categoryId: z.number()
                }),
                include: z.object({
                    user: z.boolean().optional(),
                    media: z.boolean().optional(),
                    variants: z.boolean().optional()
                }).optional()
            })

            // parser the body
            const queryParsed = QuerySchema.parse(req.query)
            const createOptionParsed = CreateOptionSchema.parse({
                data: req.body,
                include: queryParsed && queryParsed.include
                    ? {
                        user: queryParsed.include.user === "true",
                        media: queryParsed.include.media === "true",
                        variants: queryParsed.include.variants === "true",
                    }
                    : undefined
            })

            const createdProduct = await this.productUsecase.create({
                ...createOptionParsed,
                data: {
                    ...createOptionParsed.data,
                    userId: req.user.id
                }
            })
            // create productEmbedding
            // var createEmbeddingOk: boolean = false
            // try {
            //     const embeddingVectors = await this.emdeddingService.embeddings([createdProduct.description])
            //     const createdEmbedding = await this.productEmbeddingUsecase.create({
            //         data: {
            //             productId: createdProduct.id,
            //             origin_text: createdProduct.description,
            //             embedding: embeddingVectors[0]
            //         }
            //     })
            //     createEmbeddingOk = true
            // } catch (error) {
            //     console.log("error in ProductController.create - embedding:\n", error)
            //     createEmbeddingOk = false
            // }

            res.status(201).json({
                product: ProductDTO.toOutputSingle(createdProduct, req),
                // warning: createEmbeddingOk?undefined:"create product ok but no embedding"
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
                    case USECASE_ERROR_CODE.CONFLIX:
                        res.status(409).json({
                            message: "Product already exist"
                        })
                        return
                    case USECASE_ERROR_CODE.FK_CONSTRAINT:
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


    /**
     * Retrives a list of product
     * @param req 
     * @param res 
     * @returns 
     */
    findMany = async (req: Request, res: Response): Promise<void> => {
        try {
            const QuerySchema = z.object({
                product_code: z.string().optional(),
                name: z.string().optional(),
                description: z.string().optional(),
                categoryId: z.string().optional(),
                userId: z.string().optional(),
                limit: z.string().optional(),
                offset: z.string().optional(),
                // include option
                include: z.object({
                    variants: z.string().optional(),
                    media: z.string().optional(),
                    category: z.string().optional(),
                    user: z.string().optional(),
                }).optional()
            }).optional()

            const FindManyOption = z.object({
                where: z.object({
                    product_code: z.number().optional(),
                    name: z.string().optional(),
                    description: z.string().optional(),
                    categoryId: z.number().optional(),
                    userId: z.string().optional(),
                }),
                include: z.object({
                    variants: z.boolean().optional(),
                    media: z.boolean().optional(),
                    category: z.boolean().optional(),
                    user: z.boolean().optional(),
                }).optional(),
                limit: z.number().optional(),
                offset: z.number().optional(),
            })

            const queryParsed = QuerySchema.parse(req.query)
            const optionParsed = FindManyOption.parse({
                where: queryParsed
                    ? {
                        product_code: queryParsed.product_code ? parseInt(queryParsed.product_code) : undefined,
                        name: queryParsed.name,
                        description: queryParsed.description,
                        categoryId: queryParsed.categoryId ? parseInt(queryParsed.categoryId) : undefined,
                        userId: queryParsed.userId
                    }
                    : undefined,
                limit: queryParsed && queryParsed.limit ? parseInt(queryParsed.limit) : undefined,
                offset: queryParsed && queryParsed.offset ? parseInt(queryParsed.offset) : undefined,
                include: queryParsed && queryParsed.include
                    ? {
                        variants: queryParsed.include.variants === "true",
                        media: queryParsed.include.media === "true",
                        category: queryParsed.include.category === "true",
                        user: queryParsed.include.user === "true",
                    }
                    : undefined
            })

            const products = await this.productUsecase.findMany(optionParsed)
            res.status(200).json({
                products: ProductDTO.toOutputMany(products, req)
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

    /**
     * Retrives one product by id
     * @param req 
     * @param res 
     * @returns 
     */
    findOneById = async (req: Request, res: Response): Promise<void> => {
        try {

            const QuerySchema = z.object({
                include: z.object({
                    variants: z.string().optional(),
                    media: z.string().optional(),
                    category: z.string().optional(),
                    user: z.string().optional(),
                }).optional()
            }).optional()

            const FindOptionSchema = z.object({
                where: z.object({
                    id: z.string()
                }),
                include: z.object({
                    variants: z.boolean().optional(),
                    media: z.boolean().optional(),
                    category: z.boolean().optional(),
                    user: z.boolean().optional(),
                }).optional()
            })

            const queryParsed = QuerySchema.parse(req.query)
            const findOptionParsed = FindOptionSchema.parse({
                where: {
                    id: req.params["id"]
                },
                include: queryParsed && queryParsed.include
                    ? {
                        variants: queryParsed.include.variants === "true",
                        media: queryParsed.include.media === "true",
                        category: queryParsed.include.category === "true",
                        user: queryParsed.include.user === "true",
                    }
                    : undefined
            })

            const searchedProduct = await this.productUsecase.findOneById(findOptionParsed)
            if (!searchedProduct) {
                res.status(404).json({
                    message: "Product not found"
                })
                return
            }

            res.status(200).json({
                product: ProductDTO.toOutputSingle(searchedProduct, req)
            })
            return
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    message: "invalid request"
                })
            }
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

    /**
     * Update one product by id
     * @param req 
     * @param res 
     * @returns 
     */
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

            const UpdateOptionSchema = z.object({
                where: z.object({
                    id: z.string(),
                    userId: z.string()
                }),
                data: z.object({
                    name: z.string().optional(),
                    description: z.string().optional(),
                    categoryId: z.number().optional(),
                })
            })

            const updateOptionParsed = UpdateOptionSchema.parse({
                where: {
                    id: req.params['id'],
                    userId: req.user.id
                },
                data: req.body
            })

            await this.productUsecase.updateById(updateOptionParsed)

            res.status(200).json({
                message: "update successfully"
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
                    case USECASE_ERROR_CODE.FK_CONSTRAINT:
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

    /**
     * Delete one product by id
     * @param req 
     * @param res 
     * @returns 
     */
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
            await this.productUsecase.deleteById({
                where: {
                    id: req.params['id'],
                    userId: req.user.id
                }
            })
            res.status(200).json({
                message: "delete successfully"
            })
            return
        } catch (error) {
            console.log(error)
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