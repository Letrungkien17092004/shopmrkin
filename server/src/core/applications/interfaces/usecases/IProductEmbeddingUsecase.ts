import { ProductEmbedding } from "../../../entities/index.js"


export default interface IProductEmbeddingUsecase {

    /**
     * Create new ProductEmbedded
     * @param options 
     */
    create(options: {
        data: {
            origin_text: string,
            embedding: number[]
        }
    }): Promise<ProductEmbedding>

    /**
     * Create many ProductEmbedding
     * @param options 
     */
    createMany(options: {
        data: {
            items: {
                origin_text: string,
                embedding: number[]
            }[]
        }
    }): Promise<ProductEmbedding[]>

    /**
     * Find many ProductEmbedded by name
     * @param options 
     */
    searchEmbedding(options: {
        where: {
            embedding: string
        },
        limit?: number
    }): Promise<ProductEmbedding[]>

    /**
     * Find many ProductEmbedded by describe
     * @param options 
     */
    searchById(options: {
        where: {
            id: string
        }
    }): Promise<ProductEmbedding>


    /**
     * Update origin_text and embedding vector by ProductEmbedding vector
     * @param options 
     */
    updateById(options: {
        where: {
            id: string
        },
        data: {
            origin_text: string,
            embedding: number[]
        }
    }): Promise<void>
}