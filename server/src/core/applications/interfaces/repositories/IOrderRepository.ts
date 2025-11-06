import { Order, OrderItem, Payment } from "../../../entities/index.js"

type SortOrder = "asc" | "desc"

export interface IncludeOption {
    user?: boolean,
    orderItems?: boolean,
    payments?: boolean
}
type OrderProperty = Omit<Order, "user" | "orderItems" | "payments" | "createdAt" | "updatedAt">
export type OrderByOption = Partial<Record<keyof OrderProperty, SortOrder>>

export default interface IOrderRepository {
    /**
     * Create a Order
     * @param options 
     */
    create(options: {
        data: {
            userId: string,
			totalAmount: number,
            orderItems: {
                variantId: string
                quantity: number
            }[]
        },
        include?: IncludeOption
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