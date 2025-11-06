import { Payment } from "../../../entities/index.js";
import { IncludeOption, OrderByOption } from "../repositories/IPaymentRepository.js"

export default interface IPaymentUsecase {
    /**
     * Create a Payment
     * @param options 
     */
    create(options: {
        data: {
            id: string
            transactionId: string
            orderId: string
            userId: string
        },
        include?: IncludeOption
    }): Promise<Payment>

    /**
     * Retrieves a Payment by ID
     */
    findOneById(options: {
        where: {
            id: string
        },
        include?: IncludeOption
    }): Promise<Payment | null>


    /**
     * Retrieves Payments list
     * @param options 
     */
    findMany(options: {
        where?: {
            id?: string
            transactionId?: string
            amount?: number
            orderId?: string
            userId?: string
        },
        include?: IncludeOption,
        orderBy?: OrderByOption | OrderByOption[]
    }): Promise<Payment[]>

    /**
     * Update one Payment by ID, can only update Payment's status now
     * @param options 
     */
    updatebyId(options: {
        where: {
            id: string
        },
        data: {
            status?: "PENDING" | "PAID" | "FAILED" | "REFUNED"
        }
    }): Promise<void>
}