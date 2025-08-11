import { baseExceptionHandler } from "core/applications/interfaces/repositories/errors.js";
import { PrismaClient } from "services/postgresSQL/generated/prisma/client";
import { Variant } from "core/entities/index.js";
import IVariantRepository from "core/applications/interfaces/repositories/IVariantRepository";

const prisma = new PrismaClient()

export default class VariantRepository implements IVariantRepository {
    async create(options: Omit<Variant, "id" | "createdAt" | "updatedAt">): Promise<Variant> {
        try {
            const createdVariant = await prisma.variants.create({
                data: {
                    name: options.name,
                    sku: options.sku,
                    productId: options.productId,
                    authorId: options.authorId,
                    price: options.price,
                    stock: options.stock
                }
            })

            const convertedPrice = Number(createdVariant.price)
            return new Variant({ ...createdVariant, price: convertedPrice })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
    async getById(id: string): Promise<Variant | null> {
        try {
            const searchedVariant = await prisma.variants.findUnique({
                where: {
                    id: id
                }
            })

            // if not found
            if (!searchedVariant) { return null }

            const convertedPrice = Number(searchedVariant.price)
            return new Variant({ ...searchedVariant, price: convertedPrice })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
    async updateById(id: string, authorId: number, options: Omit<Partial<Variant>, "id">): Promise<Variant> {
        try {
            const updatedVariant = await prisma.variants.update({
                where: {
                    id: id,
                    authorId: authorId
                },
                data: {
                    name: options.name,
                    sku: options.sku,
                    price: options.price,
                    stock: options.stock
                }
            })

            const convertedPrice = Number(updatedVariant.price)
            return new Variant({ ...updatedVariant, price: convertedPrice })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
    async deleteById(id: string, authorId: number): Promise<void> {
        try {
            const status = await prisma.variants.delete({
                where: {
                    id: id,
                    authorId: authorId
                }
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
}