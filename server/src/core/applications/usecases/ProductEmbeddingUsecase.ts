import IProductEmbeddingUsecase from '../interfaces/usecases/IProductEmbeddingUsecase';
import IProductEmbeddingRepository from "../interfaces/repositories/IProductEmbeddingRepository";
import { USECASE_ERROR, USECASE_ERROR_CODE } from '../interfaces/usecases/errors';
import { ProductEmbedding } from "../../entities";


export default class ProductEmbeddingUsecase implements IProductEmbeddingUsecase {
    private productEmbeddingRepo: IProductEmbeddingRepository

    constructor(productEmbeddingRepo: IProductEmbeddingRepository) {
        this.productEmbeddingRepo = productEmbeddingRepo
    }

    /**
     * Create new ProductEmbedded
     * @param options 
     */
    async create(options: {
        data: {
            origin_text: string,
            embedding: number[]
        }
    }): Promise<ProductEmbedding> {
        try {
            return await this.productEmbeddingRepo.create(options)
        } catch (error) {
            // TODO: 
            throw new USECASE_ERROR({
                message: "ProductEmbedding usecase error",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    /**
     * Create many ProductEmbedding
     * @param options 
     */
    async createMany(options: {
        data: {
            items: {
                origin_text: string,
                embedding: number[]
            }[]
        }
    }): Promise<ProductEmbedding[]> {
        try {
            return this.productEmbeddingRepo.createMany(options)
        } catch (error) {
            // TODO:
            throw new USECASE_ERROR({
                message: "ProductEmbedding usecase error",
                code: USECASE_ERROR_CODE.UNDEFINED
            })
        }
    }

    /**
     * Find many ProductEmbedded by name
     * @param options 
     */
    async searchEmbedding(options: {
        where: {
            embedding: string
        },
        limit?: number
    }): Promise<ProductEmbedding[]> {
        try {
            return this.productEmbeddingRepo.embeddingSearch(options)
        } catch (error) {
            // TODO
            throw new USECASE_ERROR({
                message: "ProductEmbedding usecase error",
                code: USECASE_ERROR_CODE.UNDEFINED
            })   
        }
    }

    /**
     * Find many ProductEmbedded by describe
     * @param options 
     */
    async searchById(options: {
        where: {
            id: string
        }
    }): Promise<ProductEmbedding> {
        try {
            return this.productEmbeddingRepo.searchById(options)
        } catch (error) {
            // TODO
            throw new USECASE_ERROR({
                message: "ProductEmbedding usecase error",
                code: USECASE_ERROR_CODE.UNDEFINED
            })   
        }
    }


    /**
     * Update origin_text and embedding vector by ProductEmbedding vector
     * @param options 
     */
    async updateById(options: {
        where: {
            id: string
        },
        data: {
            origin_text: string,
            embedding: number[]
        }
    }): Promise<void> {
        try {
            await this.productEmbeddingRepo.updateById(options)
        } catch (error) {
            // TODO
            throw new USECASE_ERROR({
                message: "ProductEmbedding usecase error",
                code: USECASE_ERROR_CODE.UNDEFINED
            })   
        }
    }
}