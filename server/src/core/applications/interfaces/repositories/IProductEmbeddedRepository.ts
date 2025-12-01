import { ProductEmbedded } from "../../../entities/index.js"


export default interface IProductEmbeddedRepository {

    /**
     * Create new ProductEmbedded
     * @param options 
     */
    create(options: {
        data: {
            originProductId: string
            name: string
            describe: string
        }
    }): Promise<ProductEmbedded>

    /**
     * Find many ProductEmbedded by name
     * @param options 
     */
    searchByName(options: {
        where: {
            name: string
        }
    }): Promise<ProductEmbedded[]>

    /**
     * Find many ProductEmbedded by describe
     * @param options 
     */
    searchByDescription(options: {
        where: {
            describe: string
        }
    }): Promise<ProductEmbedded[]>


    /**
     * Update a ProductEmbedded by ProductEmbedded's id
     * @param options 
     */
    updateById(options: {
        where: {
            id: string
        },
        data: {
            name?: string,
            describe?: string
        }
    }): Promise<void>

    /**
     * Update embedded vector by ProductEmbedded's id
     * @param options 
     */
    updateVectorById(options: {
        where: {
            id: string
        }
    }): Promise<void>
}