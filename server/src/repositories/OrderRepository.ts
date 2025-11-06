import { Order, OrderItem, Payment, User } from "../core/entities/index.js";
import IOrderRepository, { IncludeOption, OrderByOption } from "../core/applications/interfaces/repositories/IOrderRepository.js";
import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js";
import { PrismaClient } from "@prisma/client";
import type { Prisma, Orders as PrismaOrder, OrderItems as PrismaOrderItem, Payments as PrismaPayment, Users as PrismaUser } from "@prisma/client";

const prisma = new PrismaClient();

type OrderWithRelations = PrismaOrder & {
	user?: PrismaUser,
	orderItems?: PrismaOrderItem[],
	payments?: PrismaPayment[]
}

export default class OrderRepository implements IOrderRepository {

	/**
	 * Create a Order
	 * @param options 
	 */
	async create(options: {
		data: {
			userId: string,
			totalAmount: number,
			orderItems: {
				variantId: string
				quantity: number
				unitPrice: number
			}[]
		},
		include?: IncludeOption
	}): Promise<Order> {
		try {

			const created = await prisma.orders.create({
				data: {
					userId: options.data.userId,
					totalAmount: options.data.totalAmount,
					orderItems: {
						create: options.data.orderItems.map(ordItem => ({
							variantId: ordItem.variantId,
							quantity: ordItem.quantity,
							unitPrice: ordItem.unitPrice,
						}))
					}
				},
				include: options.include
			});

			const createdTyped = created as OrderWithRelations;

			return new Order({
				...createdTyped,
				totalAmount: Number(createdTyped.totalAmount),
				user: createdTyped.user ? new User(createdTyped.user) : undefined,
				orderItems: createdTyped.orderItems ? createdTyped.orderItems.map((oi: PrismaOrderItem) => new OrderItem({
					...oi,
					unitPrice: Number(oi.unitPrice)
				})) : undefined,
				payments: createdTyped.payments ? createdTyped.payments.map((p: PrismaPayment) => new Payment({
					...p,
					amount: Number(p.amount)
				})) : undefined
			});
		} catch (error) {
			throw baseExceptionHandler(error);
		}
	}

	/**
	 * Find one order by order's ID
	 * @param options 
	 */
	async findOneById(options: {
		where: {
			id: string
		},
		include?: IncludeOption,
	}): Promise<Order | null> {
		try {

			const found = await prisma.orders.findUnique({
				where: options.where,
				relationLoadStrategy: "join",
				include: options.include
			});

			if (!found) return null;

			const foundTyped = found as OrderWithRelations;

			return new Order({
				...foundTyped,
				totalAmount: Number(foundTyped.totalAmount),
				user: foundTyped.user ? new User(foundTyped.user) : undefined,
				orderItems: foundTyped.orderItems ? foundTyped.orderItems.map((oi: PrismaOrderItem) => new OrderItem({
					...oi,
					unitPrice: Number(oi.unitPrice)
				})) : undefined,
				payments: foundTyped.payments ? foundTyped.payments.map((p: PrismaPayment) => new Payment({
					...p,
					amount: Number(p.amount)
				})) : undefined
			});
		} catch (error) {
			throw baseExceptionHandler(error);
		}
	}

	/**
	 * Find many order
	 * @param options 
	 */
	async findMany(options: {
		where?: {
			userId?: string
			status?: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
		},
		include?: IncludeOption,
		orderBy?: OrderByOption | OrderByOption[]
	}): Promise<Order[]> {
		try {

			const orders = await prisma.orders.findMany({
				where: options.where,
				include: options.include,
				orderBy: options.orderBy
			});

			const ordersTyped = orders as OrderWithRelations[];

			return ordersTyped.map(order => new Order({
				...order,
				totalAmount: Number(order.totalAmount),
				user: order.user ? new User(order.user) : undefined,
				orderItems: order.orderItems ? order.orderItems.map((oi: PrismaOrderItem) => new OrderItem({
					...oi,
					unitPrice: Number(oi.unitPrice)
				})) : undefined,
				payments: order.payments ? order.payments.map((p: PrismaPayment) => new Payment({
					...p,
					amount: Number(p.amount)
				})) : undefined
			}));
		} catch (error) {
			throw baseExceptionHandler(error);
		}
	}

	/**
	 * 
	 * @param options 
	 */
	async updateById(options: {
		where: {
			id: string
		},
		data: {
			status?: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
		}
	}): Promise<void> {
		try {
			await prisma.orders.update({
				where: options.where,
				data: options.data
			});
		} catch (error) {
			throw baseExceptionHandler(error);
		}
	}

}