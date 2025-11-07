import { Order, OrderItem, Payment } from "../../core/entities/index.js"

type InputParams = {
	userId: string,
	totalAmount: number,
	status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
}

type Item = {
	id: string,
	orderId?: string,
	variantId: string,
	quantity: number,
	unitPrice: number,
	variant_name?: string,
	variant_sku?: string,
	product_id?: string,
	product_name?: string,
}

type PaymentOut = {
	id: string,
	transactionId: string,
	amount: number,
	status: string,
	userId?: string,
	createdAt?: Date
}

type ToOutput = {
	id: string,
	userId: string,
	totalAmount: number,
	status: string,
	user?: { username?: string, email?: string, role?: string },
	orderItems?: Item[],
	payments?: PaymentOut[],
	createdAt?: Date,
	updatedAt?: Date
}

export default class OrderDTO {

	static toInputSingle(options: InputParams): Order {
		return new Order({
			id: "",
			userId: options.userId,
			totalAmount: options.totalAmount,
			status: options.status
		})
	}

	static toOutputSingle(order: Order): ToOutput {
		var user: { username?: string, email?: string, role?: string } | undefined = undefined

		if (order.user) {
			user = {
				username: order.user.username,
				email: (order.user as any).email || undefined,
				role: order.user.role?.roleName || undefined
			}
		}

		var items: Item[] = []
		if (order.orderItems) {
			items = order.orderItems.map(oi => {
				const variant = oi.variant
				return {
					id: oi.id,
					orderId: oi.orderId,
					variantId: oi.variantId,
					quantity: oi.quantity,
					unitPrice: oi.unitPrice,
					variant_name: variant?.name,
					variant_sku: variant?.sku,
					product_id: variant?.product?.id,
					product_name: variant?.product?.name,
				}
			})
		}

		var paymentsOut: PaymentOut[] = []
		if (order.payments) {
			paymentsOut = order.payments.map(p => ({
				id: p.id,
				transactionId: p.transactionId,
				amount: p.amount,
				status: p.status,
				userId: p.userId,
				createdAt: p.createdAt
			}))
		}

		return {
			id: order.id,
			userId: order.userId,
			totalAmount: order.totalAmount,
			status: order.status,
			user: user,
			orderItems: items,
			payments: paymentsOut,
			createdAt: order.createdAt,
			updatedAt: order.updatedAt
		}
	}

	static toOutputMany(orders: Order[]): ToOutput[] {
		return orders.map(o => OrderDTO.toOutputSingle(o))
	}
}

