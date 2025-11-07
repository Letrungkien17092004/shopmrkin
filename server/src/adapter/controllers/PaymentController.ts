import { Request, Response } from "express"
import IPaymentUsecase from "../../core/applications/interfaces/usecases/IPaymentUsecase.js"
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../../core/applications/interfaces/usecases/errors.js"
import { z } from "zod"
import { PaymentDTO } from "../../adapter/DTO/index.js"
import { randomUUID } from "crypto"

export default class PaymentController {
	private usecase: IPaymentUsecase

	constructor(usecase: IPaymentUsecase) {
		this.usecase = usecase
	}

	/**
	 * Create a payment
	 * POST: /payments
	 */
	create = async (req: Request, res: Response): Promise<void> => {
		try {
			if (!req.user) {
				res.status(401).json({ message: "Unauthorized" })
				return
			}

			const BodySchema = z.object({
				transactionId: z.string(),
				orderId: z.string(),
				id: z.string().optional()
			})

			const bodyParsed = BodySchema.parse(req.body)

			const created = await this.usecase.create({
				data: {
					transactionId: bodyParsed.transactionId,
					orderId: bodyParsed.orderId,
					userId: req.user.id
				}
			})

			res.status(201).json({ payment: PaymentDTO.toOutputSingle(created) })
			return
		} catch (error) {
			console.log(error)
			if (error instanceof z.ZodError) {
				res.status(400).json({ message: "Invalid input" })
				return
			}
			if (error instanceof USECASE_ERROR) {
				switch (error.code) {
					case USECASE_ERROR_CODE.FK_CONSTRAINT:
						res.status(404).json({ message: "Order or User not found" })
						return
					case USECASE_ERROR_CODE.CONFLIX:
						res.status(409).json({ message: "Payment already exists" })
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

	/**
	 * Get one payment
	 * GET: /payments/:id
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
					order: z.string().optional()
				}).optional()
			}).optional()

			const queryParsed = QuerySchema.parse(req.query)

			const payment = await this.usecase.findOneById({
				where: { id: req.params['id'] },
				include: queryParsed && queryParsed.include
					? { user: queryParsed.include.user === "true", order: queryParsed.include.order === "true" }
					: undefined
			})

			if (!payment) {
				res.status(404).json({ message: "Payment not found" })
				return
			}

			// if not admin verify ownership
			if (req.user.role.toLowerCase() !== "administrator" && payment.userId !== req.user.id) {
				res.status(403).json({ message: "Forbidden" })
				return
			}

			res.status(200).json({ payment: PaymentDTO.toOutputSingle(payment) })
			return
		} catch (error) {
			console.log(error)
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
	 * List payments
	 * GET: /payments
	 */
	findMany = async (req: Request, res: Response): Promise<void> => {
		try {
			if (!req.user) {
				res.status(401).json({ message: "Unauthorized" })
				return
			}

			const QuerySchema = z.object({
				id: z.string().optional(),
				transactionId: z.string().optional(),
				orderId: z.string().optional(),
				userId: z.string().optional(),
				include: z.object({ user: z.string().optional(), order: z.string().optional() }).optional(),
				orderBy: z.string().optional()
			}).optional()

			const queryParsed = QuerySchema.parse(req.query)

			const where: any = {}
			if (queryParsed) {
				if (queryParsed.id) where.id = queryParsed.id
				if (queryParsed.transactionId) where.transactionId = queryParsed.transactionId
				if (queryParsed.orderId) where.orderId = queryParsed.orderId
				if (queryParsed.userId) where.userId = queryParsed.userId
			}

			if (req.user.role.toLowerCase() !== "administrator") {
				// limit to own payments
				where.userId = req.user.id
			}

			const include = queryParsed && queryParsed.include
				? { user: queryParsed.include.user === "true", order: queryParsed.include.order === "true" }
				: undefined

			let orderBy: any = undefined
			if (queryParsed && queryParsed.orderBy) {
				const parts = queryParsed.orderBy.split(":")
				if (parts.length === 2) {
					orderBy = { [parts[0]]: parts[1].toLowerCase() === "asc" ? "asc" : "desc" }
				}
			}

			const payments = await this.usecase.findMany({ where, include, orderBy })
			res.status(200).json({ payments: PaymentDTO.toOutputMany(payments) })
			return
		} catch (error) {
			console.log(error)
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
	 * Update payment status
	 * PUT: /payments/:id
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

			const BodySchema = z.object({ status: z.enum(["PENDING", "PAID", "FAILED", "REFUNED"]) })
			const bodyParsed = BodySchema.parse(req.body)

			await this.usecase.updatebyId({ where: { id: req.params['id'] }, data: { status: bodyParsed.status } })

			res.status(200).json({ message: "update successfully" })
			return
		} catch (error) {
			console.log(error)
			if (error instanceof z.ZodError) {
				res.status(400).json({ message: "Invalid input" })
				return
			}
			if (error instanceof USECASE_ERROR) {
				switch (error.code) {
					case USECASE_ERROR_CODE.NOTFOUND:
						res.status(404).json({ message: "Payment not found" })
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
