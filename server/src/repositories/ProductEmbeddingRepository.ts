import IProductEmbeddingRepository from "../core/applications/interfaces/repositories/IProductEmbeddingRepository.js";
import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js";
import { ProductEmbedding, Product } from "../core/entities/index.js";
import { Prisma, PrismaClient } from "@prisma/client/index.js";
import { randomUUID } from "crypto";
const prisma = new PrismaClient();

function toPgVector(vec: number[]): string {
    return `[${vec.join(",")}]`
}


interface InsertResult {
    // ProductEmbedding fields
    id: string
    productId: string
    origin_text: string
    createdAt: Date
    updatedAt: Date

    // Product fields
    p_id: string
    p_product_code: number
    p_name: string
    p_description: string
    p_userid: string
    p_categoryid: number | null
    p_createdat: Date
    p_updatedat: Date
}

interface SelectResult {
    // ProductEmbedding fields
    id: string
    productId: string
    origin_text: string
    createdAt: Date
    updatedAt: Date

    // Product fields
    p_id: string
    p_product_code: number
    p_name: string
    p_description: string
    p_userid: string
    p_categoryid: number | null
    p_createdat: Date
    p_updatedat: Date
}

export default class ProductEmbeddingRepository implements IProductEmbeddingRepository {

    /**
     * Create single embedding
     */
    async create(options: {
        data: {
            productId: string
            origin_text: string
            embedding: number[]
        }
    }): Promise<ProductEmbedding> {
        try {
            const { productId, origin_text, embedding } = options.data;
            const id = randomUUID()
            const results = await prisma.$queryRaw<Array<InsertResult>>
                `
                WITH inserted AS (
                    INSERT INTO "ProductEmbedding"
                        ("id", "productId", "origin_text", "embedding")
                    VALUES
                    (
                        ${id},
                        ${productId},
                        ${origin_text},
                        ${Prisma.raw(`'${toPgVector(embedding)}'::vector`)}
                    )
                    RETURNING
                        "id",
                        "productId",
                        "origin_text",
                        "createdAt",
                        "updatedAt"
                )
                SELECT
                    i."id",
                    i."productId",
                    i."origin_text",
                    i."createdAt",
                    i."updatedAt",

                    p.id           AS p_id,
                    p.product_code AS p_product_code,
                    p.name         AS p_name,
                    p.description  AS p_description,
                    p."userId"     AS p_userId,
                    p."categoryId" AS p_categoryId,
                    p."createdAt"  AS p_createdAt,
                    p."updatedAt"  AS p_updatedAt
                FROM inserted i
                JOIN "Products" p ON p.id = i."productId";
            `;
            const row = results[0]
            return new ProductEmbedding({
                id: row.id,
                productId: row.productId,
                origin_text: row.origin_text,
                embedding: [], // intentionally empty
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
                product: new Product({
                    id: row.p_id,
                    product_code: row.p_product_code,
                    name: row.p_name,
                    description: row.p_description,
                    userId: row.p_userid,
                    categoryId: row.p_categoryid,
                    createdAt: row.p_createdat,
                    updatedAt: row.p_updatedat,
                }),
            })
        } catch (error) {
            throw baseExceptionHandler(error);
        }
    }

    /**
 * Batch insert embeddings and return Products
 */
    async createMany(options: {
        data: {
            items: {
                productId: string
                origin_text: string
                embedding: number[]
            }[]
        }
    }): Promise<ProductEmbedding[]> {
        try {
            const productIds = options.data.items.map(i => i.productId)
            const originTexts = options.data.items.map(i => i.origin_text)
            const embeddings = options.data.items.map(i => toPgVector(i.embedding))

            const results = await prisma.$queryRaw<Array<InsertResult>>
                `
        WITH inserted AS (
            INSERT INTO "ProductEmbedding"
                ("productId", "origin_text", "embedding")
            SELECT
                pid,
                txt,
                emb::vector
            FROM unnest(
                ${productIds}::uuid[],
                ${originTexts}::text[],
                ${embeddings}::text[]
            ) AS t(pid, txt, emb)
            RETURNING
                "id",
                "productId",
                "origin_text",
                "createdAt",
                "updatedAt"
        )
        SELECT
            i."id",
            i."productId",
            i."origin_text",
            i."createdAt",
            i."updatedAt",

            p.id           AS p_id,
            p.product_code AS p_product_code,
            p.name         AS p_name,
            p.description  AS p_description,
            p."userId"     AS p_userId,
            p."categoryId" AS p_categoryId,
            p."createdAt"  AS p_createdAt,
            p."updatedAt"  AS p_updatedAt
        FROM inserted i
        JOIN "Products" p ON p.id = i."productId";
        `

            return results.map(row =>
                new ProductEmbedding({
                    id: row.id,
                    productId: row.productId,
                    origin_text: row.origin_text,
                    embedding: [], // intentionally omitted
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                    product: new Product({
                        id: row.p_id,
                        product_code: row.p_product_code,
                        name: row.p_name,
                        description: row.p_description,
                    userId: row.p_userid,
                    categoryId: row.p_categoryid,
                    createdAt: row.p_createdat,
                    updatedAt: row.p_updatedat,
                    }),
                })
            )
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }



    /**
 * Similarity search (cosine distance)
 */
    async embeddingSearch(options: {
        where: {
            embedding: number[]
        }
        limit?: number
    }): Promise<ProductEmbedding[]> {
        try {
            const limit = options.limit ?? 5
            const embedding = options.where.embedding

            const results = await prisma.$queryRaw<Array<SelectResult>>
                `
        SELECT
            pe."id",
            pe."productId",
            pe."origin_text",
            pe."createdAt",
            pe."updatedAt",

            p.id           AS p_id,
            p.product_code AS p_product_code,
            p.name         AS p_name,
            p.description  AS p_description,
            p."userId"     AS p_userId,
            p."categoryId" AS p_categoryId,
            p."createdAt"  AS p_createdAt,
            p."updatedAt"  AS p_updatedAt
        FROM "ProductEmbedding" pe
        JOIN "Products" p ON p.id = pe."productId"
        ORDER BY pe.embedding <=> ${Prisma.raw(`'${toPgVector(embedding)}'::vector`)}
        LIMIT ${limit};
        `
            // console.log("results: \n", results)
            return results.map(row =>
                new ProductEmbedding({
                    id: row.id,
                    productId: row.productId,
                    origin_text: row.origin_text,
                    embedding: [], // intentionally omitted
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                    product: new Product({
                        id: row.p_id,
                        product_code: row.p_product_code,
                        name: row.p_name,
                        description: row.p_description,
                    userId: row.p_userid,
                    categoryId: row.p_categoryid,
                    createdAt: row.p_createdat,
                    updatedAt: row.p_updatedat,
                    }),
                })
            )
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }


    /**
     * Find by id
     */
    async searchById(options: {
        where: {
            id: string
        }
    }): Promise<ProductEmbedding> {
        try {
            const result = await prisma.$queryRaw<Array<SelectResult>>
                `
                SELECT 
                    pe."id",
                    pe."productId",
                    pe."origin_text",
                    pe."createdAt",
                    pe."updatedAt",

                    p.id           AS p_id,
                    p.product_code AS p_product_code,
                    p.name         AS p_name,
                    p.description  AS p_description,
                    p."userId"     AS p_userId,
                    p."categoryId" AS p_categoryId,
                    p."createdAt"  AS p_createdAt,
                    p."updatedAt"  AS p_updatedAt
                FROM "ProductEmbedding" as pe
                JOIN "Products" p ON p.id = pe."productId"
                WHERE pe."id" = ${options.where.id}
            `;

            const row = result[0]
            return new ProductEmbedding({
                id: row.id,
                productId: row.productId,
                origin_text: row.origin_text,
                embedding: [], // intentionally omitted
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
                product: new Product({
                    id: row.p_id,
                    product_code: row.p_product_code,
                    name: row.p_name,
                    description: row.p_description,
                    userId: row.p_userid,
                    categoryId: row.p_categoryid,
                    createdAt: row.p_createdat,
                    updatedAt: row.p_updatedat,
                }),
            })
        } catch (error) {
            throw baseExceptionHandler(error);
        }
    }

    /**
     * Update embedding + origin_text
     */
    async updateById(options: {
        where: {
            id: string
        },
        data: {
            origin_text: string
            embedding: number[]
        }
    }): Promise<void> {
        try {
            const { origin_text, embedding } = options.data
            await prisma.$executeRaw`
                UPDATE "ProductEmbedding"
                SET
                    origin_text = ${origin_text},
                    embedding = ${toPgVector(embedding)}::vector,
                    "updatedAt" = now()
                WHERE id = ${options.where.id};
            `;
        } catch (error) {
            throw baseExceptionHandler(error);
        }
    }
}
