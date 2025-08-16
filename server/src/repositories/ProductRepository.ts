import { Category, Product, User, Variant } from "core/entities/index.js";
import IProductRepository from "core/applications/interfaces/repositories/IProductRepository.js";
import { baseExceptionHandler } from "core/applications/interfaces/repositories/errors.js";
import { PrismaClient } from "services/postgresSQL/generated/prisma/client/index.js";

const prisma = new PrismaClient()

export default class ProductRepository implements IProductRepository {

    /**
     * Creates a new product in the database.
     * @param options Product data without the id.
     * @returns The created Product entity.
     * @throws Throws if an error occurs during creation.
     */
    async create(options: Omit<Product, "id" | "productCode" | "createdAt" | "updatedAt">): Promise<Product> {
        try {
            const createdProduct = await prisma.products.create({
                data: {
                    name: options.name,
                    description: options.description,
                    categoryId: options.categoryId,
                    authorId: options.authorId
                }
            })

            return new Product({ ...createdProduct, productCode: createdProduct.product_code })
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
    async getByProductCode(productCode: number): Promise<Product | null> {
        try {
            const searchedProduct = await prisma.products.findUnique({
                where: {
                    product_code: productCode
                },
                include: {
                    author: true,
                    variants: true
                }
            })

            // if not found
            if (!searchedProduct) {
                return null
            }
            const author = new User(searchedProduct.author)
            const variants = searchedProduct.variants.map((variant) => {
                const convertedPrice = Number(variant.price)
                return new Variant({ ...variant, price: convertedPrice })
            })

            return new Product({
                ...searchedProduct,
                author: author,
                variants: variants,
                productCode: searchedProduct.product_code
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
    async getById(id: string): Promise<Product | null> {
        try {
            const searchedProduct = await prisma.products.findUnique({
                where: {
                    id: id
                },
                include: {
                    author: true,
                    variants: true
                }
            })

            // if not found
            if (!searchedProduct) {
                return null
            }

            const author = new User(searchedProduct.author)
            const variants = searchedProduct.variants.map((variant) => {
                const convertedPrice = Number(variant.price)
                return new Variant({ ...variant, price: convertedPrice })
            })

            return new Product({
                ...searchedProduct,
                author: author,
                variants: variants,
                productCode: searchedProduct.product_code
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
    async updateById(id: string, authorId: string, options: Omit<Partial<Product>, "id">): Promise<Product> {
        try {
            const updatedProduct = await prisma.products.update({
                where: {
                    id: id,
                    authorId: authorId
                },
                data: {
                    name: options.name,
                    description: options.description,
                    categoryId: options.categoryId
                },
                include: {
                    author: true,
                    variants: true,
                    category: true
                }
            })

            const author = new User(updatedProduct.author)
            const variants = updatedProduct.variants.map((variant) => {
                const convertedPrice = Number(variant.price)
                return new Variant({ ...variant, price: convertedPrice })
            })
            const category = new Category(updatedProduct.category)

            return new Product({
                ...updatedProduct,
                author: author,
                variants: variants,
                category: category,
                productCode: updatedProduct.product_code
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
    async deleteById(id: string, authorId: string): Promise<void> {
        try {
            const status = await prisma.products.delete({
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