import { ProductEmbedding } from "../../../entities/index.js"


export default interface IProductEmbeddingRepository {

    /**
     * Create a new ProductEmbedding
     * @param options 
     */
    create(options: {
        data: {
            productId: string
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
                productId: string
                origin_text: string,
                embedding: number[]
            }[]
        }
    }): Promise<ProductEmbedding[]>

    /**
     * Find many ProductEmbedding by name
     * @param options 
     */
    embeddingSearch(options: {
        where: {
            embedding: number[]
        },
        limit?: number
    }): Promise<ProductEmbedding[]>

    /**
     * Find many ProductEmbedding by describe
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