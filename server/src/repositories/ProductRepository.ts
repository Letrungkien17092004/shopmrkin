import { Category, Product, User, Variant, Media } from "core/entities/index.js";
import IProductRepository from "core/applications/interfaces/repositories/IProductRepository.js";
import { baseExceptionHandler } from "core/applications/interfaces/repositories/errors.js";
import { PrismaClient } from "services/postgresSQL/generated/prisma/client/index.js";

const prisma = new PrismaClient()

export default class ProductRepository implements IProductRepository {

    /**
     * Creates a new product in the database.
     * @param options Product data.
     * @param options.include whether it include user when returning (default false).
     * @returns The created Product entity.
     * @throws Throws if an error occurs during creation.
     */
    async create(options: Omit<Product, "id" | "product_code"> & { include?: boolean }): Promise<Product> {
        try {
            const include = options.include || false
            if (include) {
                const createdProduct = await prisma.products.create({
                    data: {
                        name: options.name,
                        description: options.description,
                        categoryId: options.categoryId,
                        userId: options.userId
                    },
                    relationLoadStrategy: "join",
                    include: {
                        user: true,
                        category: true
                    }
                })
                return new Product({
                    ...createdProduct,
                    user: new User({
                        ...createdProduct.user
                    }),
                    category: new Category({
                        ...createdProduct.category
                    })
                })
            }

            const createdProduct = await prisma.products.create({
                data: {
                    name: options.name,
                    description: options.description,
                    categoryId: options.categoryId,
                    userId: options.userId
                }
            })
            return new Product({ ...createdProduct })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    async findMany(options: { fields: Partial<Pick<Product, "userId" | "categoryId">>, orderBy?: [{ createdAt: "asc" } | { createdAt: "desc" } | { updatedAt: "asc" } | { updatedAt: "desc" }], limit?: number, offset?: number, include?: boolean }): Promise<Product[]> {
        try {
            var orderBy = options.orderBy || [{ updatedAt: "desc" }]
            const include = options.include || false
            if (include === false) {
                const products = await prisma.products.findMany({
                    where: {
                        userId: options.fields.userId,
                        categoryId: options.fields.categoryId,
                    },
                    orderBy: orderBy,
                    skip: options.offset || 0,
                    take: options.limit || 100
                })
                return products.map(p => new Product({ ...p }))
            }

            const products = await prisma.products.findMany({
                where: {
                    userId: options.fields.userId,
                    categoryId: options.fields.categoryId,
                },
                include: {
                    user: true,
                    media: {
                        include: {
                            media: true
                        }
                    },
                    variants: true,
                    category: true
                },
                orderBy: orderBy,
                skip: options.offset || 0,
                take: options.limit || 10
            })
            return products.map(p => {
                const media = p.media.map(m => new Media({
                    id: m.media.id,
                    fileName: m.media.fileName,
                    filePath: m.media.filePath,
                    hostname: m.media.hostname,
                    media_type: m.media.media_type,
                    size: m.media.size,
                    status: m.media.status,
                    userId: m.media.userId,
                }))

                const variants = p.variants.map(v => new Variant({
                    id: v.id,
                    name: v.name,
                    sku: v.sku,
                    productId: v.productId,
                    userId: v.userId,
                    price: Number(v.price),
                    stock: v.stock,
                }))

                const user = new User({
                    id: p.user.id,
                    username: p.user.username,
                    account: p.user.account,
                    password_hash: p.user.password_hash,
                    email: p.user.email,
                    roleId: p.user.roleId,
                })

                return new Product({
                    ...p,
                    user: user,
                    media: media,
                    variants: variants
                })
            })
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
    async findOneByCode(options: { product_code: number, include?: boolean }): Promise<Product | null> {
        try {
            const include = options.include || false
            if (include === false) {
                const searchedProduct = await prisma.products.findUnique({
                    where: {
                        product_code: options.product_code
                    }
                })
                if (!searchedProduct) return null
                return new Product({ ...searchedProduct })
            }

            const searchedProduct = await prisma.products.findUnique({
                where: {
                    product_code: options.product_code
                },
                include: {
                    user: true,
                    category: true,
                    variants: true,
                    media: {
                        include: {
                            media: true
                        }
                    }
                }
            })

            if (!searchedProduct) return null

            const media = searchedProduct.media.map(m => new Media({
                id: m.media.id,
                fileName: m.media.fileName,
                filePath: m.media.filePath,
                hostname: m.media.hostname,
                media_type: m.media.media_type,
                size: m.media.size,
                status: m.media.status,
                userId: m.media.userId,
            }))

            const variants = searchedProduct.variants.map(v => new Variant({
                id: v.id,
                name: v.name,
                sku: v.sku,
                productId: v.productId,
                userId: v.userId,
                price: Number(v.price),
                stock: v.stock,
            }))

            const user = new User({
                id: searchedProduct.user.id,
                username: searchedProduct.user.username,
                account: searchedProduct.user.account,
                password_hash: searchedProduct.user.password_hash,
                email: searchedProduct.user.email,
                roleId: searchedProduct.user.roleId,
            })
            return new Product({
                ...searchedProduct,
                user: user,
                media: media,
                variants: variants
            })
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
    async findOneById(options: { id: string, include?: boolean }): Promise<Product | null> {
        try {
            const include = options.include || false
            if (include === false) {
                const searchedProduct = await prisma.products.findUnique({
                    where: {
                        id: options.id
                    }
                })
                if (!searchedProduct) return null
                return new Product({ ...searchedProduct })
            }

            const searchedProduct = await prisma.products.findUnique({
                where: {
                    id: options.id
                },
                include: {
                    user: true,
                    category: true,
                    variants: true,
                    media: {
                        include: {
                            media: true
                        }
                    }
                }
            })

            if (!searchedProduct) return null

            const media = searchedProduct.media.map(m => new Media({
                id: m.media.id,
                fileName: m.media.fileName,
                filePath: m.media.filePath,
                hostname: m.media.hostname,
                media_type: m.media.media_type,
                size: m.media.size,
                status: m.media.status,
                userId: m.media.userId,
            }))

            const variants = searchedProduct.variants.map(v => new Variant({
                id: v.id,
                name: v.name,
                sku: v.sku,
                productId: v.productId,
                userId: v.userId,
                price: Number(v.price),
                stock: v.stock,
            }))

            const user = new User({
                id: searchedProduct.user.id,
                username: searchedProduct.user.username,
                account: searchedProduct.user.account,
                password_hash: searchedProduct.user.password_hash,
                email: searchedProduct.user.email,
                roleId: searchedProduct.user.roleId,
            })

            return new Product({
                ...searchedProduct,
                media: media,
                user: user,
                variants: variants
            })
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
    async updateById(options: { id: string, userId: string, fields: Partial<Omit<Product, "id">>, include?: boolean }): Promise<Product> {
        try {
            const include = options.include || false
            if (include === false) {
                const updatedProduct = await prisma.products.update({
                    where: {
                        id: options.id,
                        userId: options.userId
                    },
                    data: {
                        name: options.fields.name,
                        description: options.fields.description,
                        categoryId: options.fields.categoryId
                    }
                })
                return new Product({ ...updatedProduct })
            }

            const updatedProduct = await prisma.products.update({
                where: {
                    id: options.id,
                    userId: options.userId
                },
                data: {
                    name: options.fields.name,
                    description: options.fields.description,
                    categoryId: options.fields.categoryId
                },

                include: {
                    user: true,
                    category: true,
                    variants: true,
                    media: {
                        include: {
                            media: true
                        }
                    }
                }
            })


            const media = updatedProduct.media.map(m => new Media({
                id: m.media.id,
                fileName: m.media.fileName,
                filePath: m.media.filePath,
                hostname: m.media.hostname,
                media_type: m.media.media_type,
                size: m.media.size,
                status: m.media.status,
                userId: m.media.userId,
            }))

            const variants = updatedProduct.variants.map(v => new Variant({
                id: v.id,
                name: v.name,
                sku: v.sku,
                productId: v.productId,
                userId: v.userId,
                price: Number(v.price),
                stock: v.stock,
            }))

            const user = new User({
                id: updatedProduct.user.id,
                username: updatedProduct.user.username,
                account: updatedProduct.user.account,
                password_hash: updatedProduct.user.password_hash,
                email: updatedProduct.user.email,
                roleId: updatedProduct.user.roleId,
            })

            return new Product({
                ...updatedProduct,
                media: media,
                user: user,
                variants: variants
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
    async deleteById(options: { id: string, userId: string }): Promise<void> {
        try {
            const status = await prisma.products.delete({
                where: {
                    id: options.id,
                    userId: options.userId
                }
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
}