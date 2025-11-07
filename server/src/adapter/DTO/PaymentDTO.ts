import { Payment, User, Order } from "../../core/entities/index.js"

type InputParams = {
    transactionId: string,
    amount: number,
    orderId: string,
    userId: string,
    status?: "PENDING" | "PAID" | "FAILED" | "REFUNED",
}

type ToOutput = {
    id: string,
    transactionId: string,
    amount: number,
    orderId: string,
    userId: string,
    status: string,
    user?: { id?: string, username?: string, email?: string },
    order?: { id?: string, totalAmount?: number, status?: string },
    createdAt?: Date
}

export default class PaymentDTO {

    static toInputSingle(options: InputParams): Payment {
        return new Payment({
            id: "",
            transactionId: options.transactionId,
            amount: options.amount,
            orderId: options.orderId,
            userId: options.userId,
            status: options.status || "PENDING"
        })
    }

    static toOutputSingle(payment: Payment): ToOutput {
        var userOut: { id: string, username: string, email: string } | undefined = undefined
        var orderOut: { id: string, totalAmount: number, status: string } | undefined = undefined

        if (payment.user) {
            userOut = {
                id: payment.user.id,
                username: payment.user.username,
                // some user objects may not have email property on entity; access safely
                email: (payment.user as any).email || undefined
            }
        }

        if (payment.order) {
            orderOut = {
                id: payment.order.id,
                totalAmount: payment.order.totalAmount,
                status: payment.order.status
            }
        }

        return {
            id: payment.id,
            transactionId: payment.transactionId,
            amount: payment.amount,
            orderId: payment.orderId,
            userId: payment.userId,
            status: payment.status,
            user: userOut,
            order: orderOut,
            createdAt: payment.createdAt
        }
    }

    static toOutputMany(payments: Payment[]): ToOutput[] {
        return payments.map(p => PaymentDTO.toOutputSingle(p))
    }
}

