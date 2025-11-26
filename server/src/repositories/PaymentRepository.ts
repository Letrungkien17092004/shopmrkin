import IPaymentRepository, { IncludeOption, OrderByOption } from "../core/applications/interfaces/repositories/IPaymentRepository";
import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js"
import { Payment, User, Order } from "../core/entities/index.js";
import { PrismaClient, Payments, Users, Orders } from "@prisma/client";

const prisma = new PrismaClient()

type PaymentWithRelations = Payments & {
    user?: Users,
    order?: Orders
}

export default class PaymentRepository implements IPaymentRepository {
    /**
     * Create a Payment
     * @param options 
     */
    async create(options: {
        data: {
            transactionId: string,
            amount: number,
            orderId: string,
            userId: string,
        },
        include?: IncludeOption,
    }): Promise<Payment> {
        try {
            const created: PaymentWithRelations = await prisma.payments.create({
                data: options.data,
                include: options.include
            })

            let order: Order | undefined = created.order ? new Order({
                ...created.order,
                totalAmount: Number(created.order.totalAmount)
            }) : undefined

            let user: User | undefined = created.user ? new User(created.user) : undefined
            return new Payment({
                ...created,
                amount: Number(created.amount),
                order: order,
                user: user
            })

        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Retrieves one Payment
     * @param options 
     */
    async findOneById(options: {
        where: { id: string },
        include?: IncludeOption
    }): Promise<Payment | null> {
        try {
            const found: PaymentWithRelations | null = await prisma.payments.findUnique({
                where: options.where,
                include: options.include
            })
            if (found === null) { return null }

            let order: Order | undefined = found.order ? new Order({
                ...found.order,
                totalAmount: Number(found.order.totalAmount)
            }) : undefined

            let user: User | undefined = found.user ? new User(found.user) : undefined
            return new Payment({
                ...found,
                amount: Number(found.amount),
                order: order,
                user: user
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Retrieves a  Payments list
     * @param options 
     */
    async findMany(options: {
        where?: {
            id?: string,
            transactionId?: string,
            amount?: number,
            orderId?: string,
            userId?: string,
        },
        include?: IncludeOption,
        orderBy?: OrderByOption | OrderByOption[]
    }): Promise<Payment[]> {
        try {
            const foundList: PaymentWithRelations[] = await prisma.payments.findMany({
                where: options.where,
                include: options.include,
                orderBy: options.orderBy
            })

            return foundList.map(payment => {
                let order: Order | undefined = payment.order ? new Order({
                    ...payment.order,
                    totalAmount: Number(payment.order.totalAmount)
                }) : undefined

                let user: User | undefined = payment.user ? new User(payment.user) : undefined
                return new Payment({
                    ...payment,
                    amount: Number(payment.amount),
                    order: order,
                    user: user
                })
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }

    /**
     * Update a payment with payment's ID (can only update payment status now)
     * @param options 
     */
    async updatebyId(options: {
        where: { id: string; },
        data: {
            status?: "PENDING" | "PAID" | "FAILED" | "REFUNED",
        },
    }): Promise<void> {
        try {
            await prisma.payments.update({
                where: options.where,
                data: options.data
            })
        } catch (error) {
            throw baseExceptionHandler(error)
        }
    }
}