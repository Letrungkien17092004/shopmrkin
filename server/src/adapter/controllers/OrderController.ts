import { Request, Response } from "express"
import IOrderUsecase from "../../core/applications/interfaces/usecases/IOrderUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../../core/applications/interfaces/usecases/errors.js"
import { z } from "zod"
import { OrderDTO } from "../../adapter/DTO/index.js"

export default class OrderController {
	private usecase: IOrderUsecase

	constructor(usecase: IOrderUsecase) {
		this.usecase = usecase
	}

	/**
	 * Create new order
	 * POST: /orders
	 */
	create = async (req: Request, res: Response): Promise<void> => {
		try {
			if (!req.user) {
				res.status(401).json({ message: "Unauthorized" })
				return
			}

			const BodySchema = z.object({
				orderItems: z.array(z.object({
					variantId: z.string(),
					quantity: z.number().int().positive()
				})).min(1)
			})

			const bodyParsed = BodySchema.parse(req.body)

			const created = await this.usecase.create({
				data: {
					userId: req.user.id,
					orderItems: bodyParsed.orderItems
				}
			})

			res.status(201).json({ order: OrderDTO.toOutputSingle(created) })
			return
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({ message: "Invalid input" })
				return
			}
			if (error instanceof USECASE_ERROR) {
				if (error.code === USECASE_ERROR_CODE.INITIAL) {
					res.status(500).json({ message: "Server Internal Error!" })
					return
				}
				if (error.code === USECASE_ERROR_CODE.FK_CONSTRAINT) {
					res.status(404).json({ message: "Variant or related resource not found" })
					return
				}
			}

			res.status(500).json({ message: "Server Internal Error!" })
			return
		}
	}

	/**
	 * Get one order by id
	 * GET: /orders/:id
	 */
	findOneById = async (req: Request, res: Response): Promise<void> => {
		try {
			if (!req.user) {
				res.status(401).json({ message: "Unauthorized" })
				return
			}

			const QuerySchema = z.object({
				include: z.object({
					user: z.string().optional(),
					orderItems: z.string().optional(),
					payments: z.string().optional()
				}).optional()
			}).optional()

			const FindOptionSchema = z.object({
				where: z.object({ id: z.string() }),
				include: z.object({
					user: z.boolean().optional(),
					orderItems: z.boolean().optional(),
					payments: z.boolean().optional()
				}).optional()
			})

			const queryParsed = QuerySchema.parse(req.query)
			const findOptionParsed = FindOptionSchema.parse({
				where: { id: req.params['id'] },
				include: queryParsed && queryParsed.include
					? {
						user: queryParsed.include.user === "true",
						orderItems: queryParsed.include.orderItems === "true",
						payments: queryParsed.include.payments === "true",
					}
					: undefined
			})

			const order = await this.usecase.findOneById(findOptionParsed)
			if (!order) {
				res.status(404).json({ message: "Order not found" })
				return
			}

			// if not admin, verify ownership
			if (req.user.role.toLowerCase() !== "administrator" && order.userId !== req.user.id) {
				res.status(403).json({ message: "Forbidden" })
				return
			}

			res.status(200).json({ order: OrderDTO.toOutputSingle(order) })
			return
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({ message: "Invalid input" })
				return
			}
			if (error instanceof USECASE_ERROR && error.code === USECASE_ERROR_CODE.INITIAL) {
				res.status(500).json({ message: "Server Internal Error!" })
				return
			}

			res.status(500).json({ message: "Server Internal Error!" })
			return
		}
	}

	/**
	 * List orders
	 * GET: /orders
	 */
	findMany = async (req: Request, res: Response): Promise<void> => {
		try {
			if (!req.user) {
				res.status(401).json({ message: "Unauthorized" })
				return
			}

			const QuerySchema = z.object({
				userId: z.string().optional(),
				status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
				include: z.object({
					user: z.string().optional(),
					orderItems: z.string().optional(),
					payments: z.string().optional()
				}).optional(),
				orderBy: z.string().optional()
			}).optional()

			const queryParsed = QuerySchema.parse(req.query)

			const where: any = {}
			if (queryParsed && queryParsed.status) where.status = queryParsed.status

			// admin can filter by userId, normal user only sees own orders
			if (req.user.role.toLowerCase() === "administrator") {
				if (queryParsed && queryParsed.userId) where.userId = queryParsed.userId
			} else {
				where.userId = req.user.id
			}

			const include = queryParsed && queryParsed.include
				? {
					user: queryParsed.include.user === "true",
					orderItems: queryParsed.include.orderItems === "true",
					payments: queryParsed.include.payments === "true",
				}
				: undefined

			// parse simple orderBy like `createdAt:desc`
			let orderBy: any = undefined
			if (queryParsed && queryParsed.orderBy) {
				const parts = queryParsed.orderBy.split(":")
				if (parts.length === 2) {
					const field = parts[0]
					const dir = parts[1].toLowerCase() === "asc" ? "asc" : "desc"
					orderBy = { [field]: dir }
				}
			}

			const orders = await this.usecase.findMany({ where, include, orderBy })
			res.status(200).json({ orders: OrderDTO.toOutputMany(orders) })
			return
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({ message: "Invalid input" })
				return
			}
			if (error instanceof USECASE_ERROR && error.code === USECASE_ERROR_CODE.INITIAL) {
				res.status(500).json({ message: "Server Internal Error!" })
				return
			}
			res.status(500).json({ message: "Server Internal Error!" })
			return
		}
	}

	/**
	 * Update order status
	 * PUT: /orders/:id
	 */
	updateById = async (req: Request, res: Response): Promise<void> => {
		try {
			if (!req.user) {
				res.status(401).json({ message: "Unauthorized" })
				return
			}

			// only admin can change status
			if (req.user.role.toLowerCase() !== "administrator") {
				res.status(403).json({ message: "require administrator role" })
				return
			}

			const BodySchema = z.object({
				status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]) 
			})

			const bodyParsed = BodySchema.parse(req.body)

			await this.usecase.updateById({
				where: { id: req.params['id'] },
				data: { status: bodyParsed.status }
			})

			res.status(200).json({ message: "update successfully" })
			return
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({ message: "Invalid input" })
				return
			}
			if (error instanceof USECASE_ERROR) {
				switch (error.code) {
					case USECASE_ERROR_CODE.NOTFOUND:
						res.status(404).json({ message: "Order not found" })
						return
					case USECASE_ERROR_CODE.INITIAL:
						res.status(500).json({ message: "Server Internal Error!" })
						return
				}
			}
			res.status(500).json({ message: "Server Internal Error!" })
			return
		}
	}
}

