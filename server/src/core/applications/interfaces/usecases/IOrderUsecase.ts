import { Order, OrderItem, Payment } from "../../../entities/index.js"
import { IncludeOption, OrderByOption } from "../repositories/IOrderRepository.js"

export default interface IOrderUsecase {
    /**
     * Create a Order
     * @param options 
     */
    create(options: {
        data: {
            userId: string,
            totalAmout: number,
            orderItems: {
                variantId: string
                quantity: number
                unitPrice: number
            }[]
        }
    }): Promise<Order>

    /**
     * Find one order by order's ID
     * @param options 
     */
    findOneById(options: {
        where: {
            id: string
        },
        include?: IncludeOption,
    }): Promise<Order | null>

    /**
     * Find many order
     * @param options 
     */
    findMany(options: {
        where?: {
            userId?: string
            status?: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
        },
        include?: IncludeOption,
        orderBy?: OrderByOption | OrderByOption[]
    }): Promise<Order[]>

    /**
     * 
     * @param options 
     */
    updateById(options: {
        where: {
            id: string
        },
        data: {
            status?: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
        }
    }): Promise<void>

}