import { Request, Response } from "express";
import IProductUsecase from "core/applications/interfaces/usecases/IProductUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "core/applications/interfaces/usecases/errors.js";
import { ToOutputSafe } from "adapter/mappers/ProductMapper.js";
import { z } from "zod"


export default class ProductController {
    private productUsecase: IProductUsecase

    constructor(productUsecase: IProductUsecase) {
        this.productUsecase = productUsecase

        this.addProduct = this.addProduct.bind(this)
        this.findProductWithId = this.findProductWithId.bind(this)
        this.findProductWithCode = this.findProductWithCode.bind(this)
        this.updateProduct = this.updateProduct.bind(this)
        this.deleteProduct = this.deleteProduct.bind(this)
    }

    async addProduct(req: Request, res: Response): Promise<void> {
        try {
            if (!req.author) {
                res.status(401).json({
                    message: "Unauthorized"
                })
                return
            }

            // not an admin
            if (req.author.role.toLowerCase() != "administrator") {
                res.status(403).json({
                    message: "Forbidden"
                })
                return
            }

            // create Z schema
            const ProductSchema = z.object({
                name: z.string().min(10).max(50),
                description: z.string().min(1).max(1000),
                categoryId: z.number()
            })

            // parser the body
            const data = ProductSchema.parse(req.body)

            const createdProduct = await this.productUsecase.create({
                ...data,
                authorId: req.author.id
            })

            res.status(201).json({
                message: "OK",
                productId: createdProduct.id
            })
            return
        } catch (error) {
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.ENGINE:
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

    async findProductWithId(req: Request, res: Response): Promise<void> {
        try {
            const idString = req.params['id']
            
            const searchedProduct = await this.productUsecase.getById(idString)
            if (!searchedProduct) {
                res.status(404).json({
                    message: "Product not found"
                })
                return
            }

            res.status(200).json({
                product: ToOutputSafe(searchedProduct)
            })
            return
        } catch (error) {
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.ENGINE:
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

    async findProductWithCode(req: Request, res: Response): Promise<void> {
        try {
            const productCode = Number(req.params['product_code'])
            
            const searchedProduct = await this.productUsecase.getByProductCode(productCode)
            if (!searchedProduct) {
                res.status(404).json({
                    message: "Product not found"
                })
                return
            }

            res.status(200).json({
                product: ToOutputSafe(searchedProduct)
            })
            return
        } catch (error) {
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.ENGINE:
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

    async updateProduct(req: Request, res: Response): Promise<void> {
        try {
            if (!req.author) {
                res.status(401).json({
                    message: "Unauthorized"
                })
                return
            }

            if (req.author.role.toLowerCase() != "administrator") {
                res.status(403).json({
                    message: "Forbidden"
                })
                return
            }

            const productId = req.params['id']
            const UpdateSchema = z.object({
                name: z.string().min(10).max(50).optional(),
                description: z.string().min(1).max(100).optional(),
                categoryId: z.number().optional()
            })

            const dataToUpdate = UpdateSchema.parse(req.body)

            const updatedProduct = await this.productUsecase.updateById(
                productId,
                req.author.id,
                dataToUpdate
            )

            res.status(200).json({
                message: "OK",
                product: ToOutputSafe(updatedProduct)
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

    async deleteProduct(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params['id']

            if (!req.author) {
                res.status(401).json({
                    message: "Unauthorized"
                })
                return
            }

            if (req.author.role.toLowerCase() != "administrator")  {
                res.status(403).json({
                    message: "Forbidden"
                })
                return
            }

            await this.productUsecase.deleteById(productId, req.author.id)
            res.status(200).json({
                message: "OK"
            })
            return
        } catch (error) {
            if (error instanceof USECASE_ERROR) {
                switch (error.code) {
                    case USECASE_ERROR_CODE.NOTFOUND:
                        res.status(404).json({
                            message: "Product not found, or authorId not match"
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