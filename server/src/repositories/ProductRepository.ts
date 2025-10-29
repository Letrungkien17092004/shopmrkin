import { Category, Product, User, Variant, Media } from "../core/entities/index.js";
import IProductRepository, { IncludeOption, OrderByOption } from "../core/applications/interfaces/repositories/IProductRepository.js";
import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default class ProductRepository implements IProductRepository {

    /**
     * Creates a new product in the database.
     * @param options Product data.
     * @param options.include whether it include user when returning (default false).
     * @returns The created Product entity.
     * @throws Throws if an error occurs during creation.
     */
    async create(options: {
        data: { name: string, description: string, categoryId: number, userId: string },
        include?: IncludeOption
    }): Promise<Product> {
        try {
            if (options.include) {
                const createdProduct = await prisma.products.create({
                    data: options.data,
                    relationLoadStrategy: "join",
                    include: {
                        user: true,
                        category: true
                    }
                })
                return new Product(createdProduct)
            }

            const createdProduct = await prisma.products.create({
                data: options.data
            })
            return new Product(createdProduct)
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Retrieves a list of Products based on filtering, sorting, and pagination options.
     * @param options The options for querying the list of Products.
     * @param options.where The filter conditions, equivalent to Prisma's 'where'. Supports filtering by userId and categoryId.
     * @param options.orderBy Sorts the results by one or more fields. E.g., [{ createdAt: 'desc' }, { name: 'asc' }].
     * @param options.take The maximum number of records to return (equivalent to 'limit').
     * @param options.skip The number of records to skip (equivalent to 'offset').
     * @param options.include The relations to load along with the list of Products.
     * @returns A Promise that resolves to an array of Product objects.
     */
    async findMany(options: {
        where?: { product_code?: number, name?: string, description?: string, categoryId?: number, userId?: string },
        orderBy?: OrderByOption[],
        limit?: number,
        offset?: number,
        include?: IncludeOption
    }): Promise<Product[]> {
        try {
            if (options.include) {
                // if include both media and variant
                if (options.include.media && options.include.variants) {
                    const products = await prisma.products.findMany({
                        where: options.where,
                        relationLoadStrategy: "join",
                        include: {
                            ...options.include,
                            media: {
                                include: {
                                    media: true
                                }
                            },
                            variants: true
                        }
                    })
                    return products.map(p => new Product(
                        {
                            ...p,
                            media: p.media.map(pm => new Media(pm.media)),
                            variants: p.variants.map(pv => new Variant({ ...pv, price: Number(pv.price) }))
                        }
                    ))
                }

                // if only include media without variant
                if (options.include.media && !options.include.variants) {
                    const products = await prisma.products.findMany({
                        where: options.where,
                        relationLoadStrategy: "join",
                        include: {
                            ...options.include,
                            media: {
                                include: {
                                    media: true
                                }
                            },
                            variants: undefined
                        }
                    })
                    return products.map(p => new Product(
                        {
                            ...p,
                            media: p.media.map(pm => new Media(pm.media)),
                        }
                    ))
                }

                // if only include variant without media
                if (options.include.variants && !options.include.media) {
                    const products = await prisma.products.findMany({
                        where: options.where,
                        relationLoadStrategy: "join",
                        include: {
                            ...options.include,
                            media: undefined,
                            variants: true
                        }
                    })
                    return products.map(p => new Product(
                        {
                            ...p,
                            variants: p.variants.map(pv => new Variant({ ...pv, price: Number(pv.price) }))
                        }
                    ))
                }
                const products = await prisma.products.findMany({
                    where: options.where,
                    relationLoadStrategy: "join",
                    include: {
                        ...options.include,
                        media: undefined,
                        variants: undefined
                    }
                })
                return products.map(p => new Product(p))
            } // else
            const products = await prisma.products.findMany({
                where: options.where
            })

            return products.map(p => new Product(p))
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Retrieves a product by its product code.
     * @param productCode The product code to search for.
     * @returns The Product entity if found, otherwise null.
     * @throws Throws if an error occurs during retrieval.
     */
    async findOneByCode(options: {
        where: { product_code: number },
        include?: IncludeOption
    }): Promise<Product | null> {
        try {
            if (options.include) {
                // if include both media and variant
                if (options.include.media && options.include.variants) {
                    const searchedProduct = await prisma.products.findUnique({
                        where: options.where,
                        relationLoadStrategy: "join",
                        include: {
                            ...options.include,
                            media: {
                                include: {
                                    media: true
                                }
                            },
                            variants: true
                        }
                    })
                    if (!searchedProduct) return null
                    return new Product({
                        ...searchedProduct,
                        media: searchedProduct.media.map(pm => new Media(pm.media)),
                        variants: searchedProduct.variants.map(v => new Variant({ ...v, price: Number(v.price) }))
                    })
                }

                // if only include media without variant
                if (options.include.media && !options.include.variants) {
                    const searchedProduct = await prisma.products.findUnique({
                        where: options.where,
                        relationLoadStrategy: "join",
                        include: {
                            ...options.include,
                            media: {
                                include: {
                                    media: true
                                }
                            },
                            variants: undefined
                        }
                    })
                    if (!searchedProduct) return null
                    return new Product({
                        ...searchedProduct,
                        media: searchedProduct.media.map(pm => new Media(pm.media)),
                    })
                }

                // if only include variant without media
                if (options.include.variants && !options.include.media) {
                    const searchedProduct = await prisma.products.findUnique({
                        where: options.where,
                        relationLoadStrategy: "join",
                        include: {
                            ...options.include,
                            media: undefined,
                            variants: true
                        }
                    }) // else
                    if (!searchedProduct) return null
                    return new Product({
                        ...searchedProduct,
                        variants: searchedProduct.variants.map(v => new Variant({ ...v, price: Number(v.price) }))
                    })
                }
                const searchedProduct = await prisma.products.findUnique({
                    where: options.where,
                    relationLoadStrategy: "join",
                    include: {
                        ...options.include,
                        media: undefined,
                        variants: undefined
                    }
                })
                if (!searchedProduct) return null
                return new Product(searchedProduct)
            } // else
            const searchedProduct = await prisma.products.findUnique({
                where: options.where
            })

            return searchedProduct ? new Product(searchedProduct) : null
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Retrieves a product by its unique id.
     * @param id The id of the product.
     * @returns The Product entity if found, otherwise null.
     * @throws Throws if an error occurs during retrieval.
     */
    async findOneById(options: {
        where: {
            id: string
        },
        include?: IncludeOption
    }): Promise<Product | null> {
        try {
            if (options.include) {
                // if include both media and variant
                if (options.include.media && options.include.variants) {
                    const searchedProduct = await prisma.products.findUnique({
                        where: options.where,
                        relationLoadStrategy: "join",
                        include: {
                            ...options.include,
                            media: {
                                include: {
                                    media: true
                                }
                            },
                            variants: true
                        }
                    })
                    if (!searchedProduct) return null
                    return new Product({
                        ...searchedProduct,
                        media: searchedProduct.media.map(pm => new Media(pm.media)),
                        variants: searchedProduct.variants.map(v => new Variant({ ...v, price: Number(v.price) }))
                    })
                }

                // if only include media without variant
                if (options.include.media && !options.include.variants) {
                    const searchedProduct = await prisma.products.findUnique({
                        where: options.where,
                        relationLoadStrategy: "join",
                        include: {
                            ...options.include,
                            media: {
                                include: {
                                    media: true
                                }
                            },
                            variants: undefined
                        }
                    }) 
                    if (!searchedProduct) return null
                    return new Product({
                        ...searchedProduct,
                        media: searchedProduct.media.map(pm => new Media(pm.media)),
                    })
                }

                // if only include variant without media
                if (options.include.variants && !options.include.media) {
                    const searchedProduct = await prisma.products.findUnique({
                        where: options.where,
                        relationLoadStrategy: "join",
                        include: {
                            ...options.include,
                            media: undefined,
                            variants: true
                        }
                    }) // else
                    if (!searchedProduct) return null
                    return new Product({
                        ...searchedProduct,
                        variants: searchedProduct.variants.map(v => new Variant({ ...v, price: Number(v.price) }))
                    })
                }
                const searchedProduct = await prisma.products.findUnique({
                    where: options.where,
                    relationLoadStrategy: "join",
                    include: {
                        ...options.include,
                        media: undefined,
                        variants: undefined
                    }
                })
                if (!searchedProduct) return null
                return new Product(searchedProduct)
            } // else
            const searchedProduct = await prisma.products.findUnique({
                where: options.where
            })

            return searchedProduct ? new Product(searchedProduct) : null
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Updates a product by its id and authorId.
     * @param id The id of the product to update.
     * @param authorId The id of the product's author.
     * @param options Partial product data to update.
     * @returns The updated Product entity.
     * @throws Throws if an error occurs during update.
     */
    async updateById(options: {
        where: { id: string, userId: string },
        data: { name?: string, description?: string, categoryId?: number },
    }): Promise<void> {
        try {
            await prisma.products.update({
                where: options.where,
                data: options.data
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
    * Deletes a product by its id and authorId.
    * @param id The id of the product to delete.
    * @param authorId The id of the product's author.
    * @returns void
    * @throws Throws if an error occurs during deletion.
    */
    async deleteById(options: {
        where: { id: string, userId: string }
    }): Promise<void> {
        try {
            await prisma.products.delete({
                where: options.where
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
}