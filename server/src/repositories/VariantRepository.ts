import { Product, User, Variant } from "../core/entities/index.js";
import IVariantRepository, { IncludeOption, OrderByOption } from "../core/applications/interfaces/repositories/IVariantRepository.js";
import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class VariantRepository implements IVariantRepository {

    /**
     * Create a Variant
     * @param options 
     */
    async create(options: {
        data: Omit<Variant, "id">,
        include?: IncludeOption
    }): Promise<Variant> {
        try {
            // Tách các trường quan hệ (nếu có) ra khỏi dữ liệu create
            const { user, product, createdAt, updatedAt, ...createData } = options.data;

            if (options.include) {
                const createdVariant = await prisma.variants.create({
                    data: createData,
                    relationLoadStrategy: "join",
                    include: options.include
                });
                return new Variant({
                    ...createdVariant,
                    price: Number(createdVariant.price), // Chuyển Decimal sang number
                    user: createdVariant.user ? new User(createdVariant.user) : undefined,
                    product: createdVariant.product ? new Product(createdVariant.product) : undefined
                });
            }

            const createdVariant = await prisma.variants.create({
                data: createData
            });
            return new Variant({
                ...createdVariant,
                price: Number(createdVariant.price) // Chuyển Decimal sang number
            });
        } catch (error) {
            throw baseExceptionHandler(error);
        }
    }

    /**
     * Find many variant by attribute name
     * @param options 
     */
    async findMany(options: {
        where: Partial<Pick<Variant, "name" | "sku" | "productId" | "userId">>,
        orderBy?: OrderByOption | OrderByOption[],
        include?: IncludeOption,
        limit?: number,
        offset?: number
    }): Promise<Variant[]> {
        try {
            const limit = options.limit || 20;
            const offset = options.offset || 0;

            if (options.include) {
                const variants = await prisma.variants.findMany({
                    where: options.where,
                    relationLoadStrategy: "join",
                    include: options.include,
                    orderBy: options.orderBy,
                    skip: offset,
                    take: limit
                });
                return variants.map(v => new Variant({
                    ...v,
                    price: Number(v.price),
                    user: v.user ? new User(v.user) : undefined,
                    product: v.product ? new Product(v.product) : undefined
                }));
            }

            const variants = await prisma.variants.findMany({
                where: options.where,
                orderBy: options.orderBy,
                skip: offset,
                take: limit
            });
            return variants.map(v => new Variant({
                ...v,
                price: Number(v.price)
            }));
        } catch (error) {
            throw baseExceptionHandler(error);
        }
    }

    /**
     * Find one variant by sku value
     * @param options 
     */
    async findOneBySku(options: {
        where: { sku: string },
        include?: IncludeOption
    }): Promise<Variant | null> {
        try {
            if (options.include) {
                const searchVariant = await prisma.variants.findUnique({
                    where: options.where,
                    relationLoadStrategy: "join",
                    include: options.include
                });
                if (!searchVariant) return null;
                return new Variant({
                    ...searchVariant,
                    price: Number(searchVariant.price),
                    user: searchVariant.user ? new User(searchVariant.user) : undefined,
                    product: searchVariant.product ? new Product(searchVariant.product) : undefined
                });
            }

            const searchVariant = await prisma.variants.findUnique({
                where: options.where
            });
            return searchVariant ? new Variant({ ...searchVariant, price: Number(searchVariant.price) }) : null;
        } catch (error) {
            throw baseExceptionHandler(error);
        }
    }

    /**
     * Find one variant by id value
     * @param options 
     */
    async findOneById(options: {
        where: { id: string },
        include?: IncludeOption
    }): Promise<Variant | null> {
        try {
            if (options.include) {
                const searchVariant = await prisma.variants.findUnique({
                    where: options.where,
                    relationLoadStrategy: "join",
                    include: options.include
                });
                if (!searchVariant) return null;
                return new Variant({
                    ...searchVariant,
                    price: Number(searchVariant.price),
                    user: searchVariant.user ? new User(searchVariant.user) : undefined,
                    product: searchVariant.product ? new Product(searchVariant.product) : undefined
                });
            }

            const searchVariant = await prisma.variants.findUnique({
                where: options.where
            });
            return searchVariant ? new Variant({ ...searchVariant, price: Number(searchVariant.price) }) : null;
        } catch (error) {
            throw baseExceptionHandler(error);
        }
    }

    /**
     * Update one variant 
     * @param options 
     */
    async updateById(options: {
        where: { id: string, userId: string },
        data: { name?: string, sku?: string, price?: number, stock?: number },
    }): Promise<void> {
        try {
            await prisma.variants.update({
                where: options.where,
                data: options.data
            });
        } catch (error) {
            throw baseExceptionHandler(error);
        }
    }

    /**
     * Delete a variant by variant's id and user's id
     * @param options 
     */
    async deleteById(options: {
        where: { id: string, userId: string }
    }): Promise<void> {
        try {
            await prisma.variants.delete({
                where: options.where
            });
        } catch (error) {
            throw baseExceptionHandler(error);
        }
    }
}