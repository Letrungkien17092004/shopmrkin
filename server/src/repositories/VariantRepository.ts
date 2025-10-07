import { baseExceptionHandler } from "core/applications/interfaces/repositories/errors.js";
import { PrismaClient } from "services/postgresSQL/generated/prisma/client/index.js";
import { Product, User, Variant } from "core/entities/index.js";
import IVariantRepository from "core/applications/interfaces/repositories/IVariantRepository.js";

const prisma = new PrismaClient()

export default class VariantRepository implements IVariantRepository {

    /**
     * Create a variant
     * @param options 
     * @returns 
     */
    async create(options: Omit<Variant, "id"> & { include?: boolean }): Promise<Variant> {
        try {
            const include = options.include || false
            if (include === false) {
                const createdVariant = await prisma.variants.create({
                    data: {
                        name: options.name,
                        sku: options.sku,
                        productId: options.productId,
                        userId: options.userId,
                        price: options.price,
                        stock: options.stock
                    }
                })
                const convertedPrice = Number(createdVariant.price)
                return new Variant({ ...createdVariant, price: convertedPrice })
            }

            const createdVariant = await prisma.variants.create({
                data: {
                    name: options.name,
                    sku: options.sku,
                    productId: options.productId,
                    userId: options.userId,
                    price: options.price,
                    stock: options.stock
                },
                include: {
                    user: true,
                    product: true
                }
            })
            return new Variant({
                ...createdVariant,
                price: Number(createdVariant.price),
                user: new User({ ...createdVariant.user }),
                product: new Product({ ...createdVariant.product })
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Retrieves a list of Variants, filter with options.field include: name, sku, productId, userId
     * @param options 
     * @returns 
     */
    async findMany(options: { fields: Partial<Pick<Variant, "name" | "sku" | "productId" | "userId">>, orderBy?: [{ createdAt: "asc" } | { createdAt: "desc" } | { updatedAt: "asc" } | { updatedAt: "desc" }], limit?: number, offset?: number, include?: boolean }): Promise<Variant[]> {
        try {
            const include = options.include || false
            if (include === false) {
                const searchedVariant = await prisma.variants.findMany({
                    where: {
                        name: {
                            contains: options.fields.name
                        },
                        sku: options.fields.sku,
                        productId: options.fields.productId,
                        userId: options.fields.userId,
                    },
                    orderBy: options.orderBy,
                    skip: options.offset,
                    take: options.limit
                })

                return searchedVariant.map(v => new Variant({
                    ...v,
                    price: Number(v.price),
                }))
            }


            const searchedVariant = await prisma.variants.findMany({
                where: {
                    name: {
                        contains: options.fields.name
                    },
                    sku: options.fields.sku,
                    productId: options.fields.productId,
                    userId: options.fields.userId,
                },
                relationLoadStrategy: "join",
                include: {
                    user: true,
                    product: true
                },
                orderBy: options.orderBy,
                skip: options.offset,
                take: options.limit
            })

            return searchedVariant.map(variant => new Variant({
                ...variant,
                price: Number(variant.price),
                user: new User({ ...variant.user }),
                product: new Product({ ...variant.product })
            }))
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Retrive a Variant by SKU
     * @param options 
     * @returns 
     */
    async findOneBySku(options: { sku: string, include?: boolean }): Promise<Variant | null> {
        try {
            const include = options.include || false
            if (include === false) {
                const searchVariant = await prisma.variants.findUnique({
                    where: {
                        sku: options.sku
                    }
                })
                return searchVariant ? new Variant({ ...searchVariant, price: Number(searchVariant.price) }) : null
            }
            const searchVariant = await prisma.variants.findUnique({
                where: {
                    sku: options.sku
                },
                include: {
                    user: true,
                    product: true
                }
            })
            if (searchVariant) {
                return new Variant({
                    ...searchVariant,
                    price: Number(searchVariant.price),
                    user: new User({ ...searchVariant.user }),
                    product: new Product({ ...searchVariant.product })
                })
            }
            return null
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Retrieves a Variant by ID
     * @param options 
     * @returns 
     */
    async findOneById(options: { id: string; include?: boolean; }): Promise<Variant | null> {
        try {
            const include = options.include || false
            if (include === false) {
                const searchVariant = await prisma.variants.findUnique({
                    where: {
                        id: options.id
                    }
                })
                return searchVariant ? new Variant({ ...searchVariant, price: Number(searchVariant.price) }) : null
            }
            const searchVariant = await prisma.variants.findUnique({
                where: {
                    id: options.id
                },
                include: {
                    user: true,
                    product: true
                }
            })
            if (searchVariant) {
                return new Variant({
                    ...searchVariant,
                    price: Number(searchVariant.price),
                    user: new User({ ...searchVariant.user }),
                    product: new Product({ ...searchVariant.product })
                })
            }
            return null
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Update a Variant by ID and userId (owner)
     * @param options 
     * @returns 
     */
    async updateById(options: { id: string, userId: string, fields: Partial<Omit<Variant, "id">>, include?: boolean }): Promise<Variant> {
        try {
            const include = options.include || false
            if (include === false) {
                const searchVariant = await prisma.variants.update({
                    data: {
                        name: options.fields.name,
                        sku: options.fields.name,
                        price: options.fields.price,
                        stock: options.fields.stock
                    },
                    where: {
                        id: options.id,
                        userId: options.userId
                    }
                })
                return new Variant({ ...searchVariant, price: Number(searchVariant.price) })
            }
            const searchVariant = await prisma.variants.update({
                data: {
                    name: options.fields.name,
                    sku: options.fields.sku,
                    price: options.fields.price,
                    stock: options.fields.stock
                },
                where: {
                    id: options.id,
                    userId: options.userId
                },
                include: {
                    user: true,
                    product: true
                }
            })
            return new Variant({
                ...searchVariant,
                price: Number(searchVariant.price),
                user: new User({ ...searchVariant.user }),
                product: new Product({ ...searchVariant.product })
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Delete a Variant by ID and userId (owner)
     * @param options 
     */
    async deleteById(options: { id: string, userId: string }): Promise<void> {
        try {
            const status = await prisma.variants.delete({
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