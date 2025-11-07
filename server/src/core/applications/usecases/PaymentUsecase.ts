import Payment from "../../entities/Payment.js";
import IPaymentRepository, { IncludeOption, OrderByOption } from "../interfaces/repositories/IPaymentRepository.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../interfaces/usecases/errors.js";
import { REPO_ERROR, REPO_ERROR_CODE } from "../interfaces/repositories/errors.js";

import IOrderRepository from "../interfaces/repositories/IOrderRepository.js";
import IPaymentUsecase from "../interfaces/usecases/IPaymentUsecase.js";

export default class PaymentUsecase implements IPaymentUsecase {
    private paymentRepo: IPaymentRepository
    private orderRepo: IOrderRepository

    constructor(paymentRepo: IPaymentRepository, orderRepo: IOrderRepository) {
        this.paymentRepo = paymentRepo
        this.orderRepo = orderRepo
    }

    /**
     * Create a Payment
     * @param options 
     */
    async create(options: {
        data: {
            transactionId: string,
            orderId: string,
            userId: string,
        },
        include?: IncludeOption,
    }): Promise<Payment> {
        try {
            // get the order then get the totalAmount to set the payment amount
            const order = await this.orderRepo.findOneById({ where: { id: options.data.orderId } })
            if (!order) {
                throw new USECASE_ERROR({
                    code: USECASE_ERROR_CODE.INVALID_DATA,
                    message: "invalid order"
                })
            }
            return this.paymentRepo.create({
                data: {
                    ...options.data,
                    amount: order.totalAmount
                },
                include: options.include
            })
        } catch (error) {
            if (error instanceof USECASE_ERROR) {
                throw error
            }

            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            code: USECASE_ERROR_CODE.INITIAL,
                            message: "Databae could not be initialized"
                        })
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            code: USECASE_ERROR_CODE.CONFLIX,
                            message: "Payment already exists"
                        })
                    case REPO_ERROR_CODE.FOREIGNKEY_CONSTRAINT:
                        throw new USECASE_ERROR({
                            code: USECASE_ERROR_CODE.FK_CONSTRAINT,
                            message: "invalid userId"
                        })

                    case REPO_ERROR_CODE.UNKNOW:
                        throw new USECASE_ERROR({
                            code: USECASE_ERROR_CODE.UNKNOW,
                            message: "unknow database error"
                        })
                }
            }

            throw new USECASE_ERROR({
                code: USECASE_ERROR_CODE.UNDEFINED,
                message: "UNDEFINED ERROR!"
            })
        }
    }

    /**
     * Retrieves a Payment by ID
     */
    async findOneById(options: {
        where: { id: string },
        include: IncludeOption,
    }): Promise<Payment | null> {
        try {
            return this.paymentRepo.findOneById(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            code: USECASE_ERROR_CODE.INITIAL,
                            message: "Databae could not be initialized"
                        })
                    case REPO_ERROR_CODE.UNKNOW:
                        throw new USECASE_ERROR({
                            code: USECASE_ERROR_CODE.UNKNOW,
                            message: "unknow database error"
                        })
                }
            }

            throw new USECASE_ERROR({
                code: USECASE_ERROR_CODE.UNDEFINED,
                message: "UNDEFINED ERROR!"
            })
        }
    }

    /**
    * Retrieves Payments list
    * @param options 
    */
    async findMany(options: {
        where?: {
            id?: string
            transactionId?: string
            amount?: number
            orderId?: string
            userId?: string
        },
        include?: IncludeOption,
        orderBy?: OrderByOption | OrderByOption[]
    }): Promise<Payment[]> {
        try {
            return await this.paymentRepo.findMany(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            code: USECASE_ERROR_CODE.INITIAL,
                            message: "Databae could not be initialized"
                        })
                    case REPO_ERROR_CODE.UNKNOW:
                        throw new USECASE_ERROR({
                            code: USECASE_ERROR_CODE.UNKNOW,
                            message: "unknow database error"
                        })
                }
            }

            throw new USECASE_ERROR({
                code: USECASE_ERROR_CODE.UNDEFINED,
                message: "UNDEFINED ERROR!"
            })
        }
    }

    /**
     * Update one Payment by ID, can only update Payment's status now
     * @param options 
     */
    async updatebyId(options: {
        where: {
            id: string
        },
        data: {
            status?: "PENDING" | "PAID" | "FAILED" | "REFUNED"
        }
    }): Promise<void> {
        try {
            await this.paymentRepo.updatebyId(options)
        } catch (error) {
            if (error instanceof USECASE_ERROR) {
                throw error
            }

            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            code: USECASE_ERROR_CODE.INITIAL,
                            message: "Databae could not be initialized"
                        })
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            code: USECASE_ERROR_CODE.CONFLIX,
                            message: "Payment already exists"
                        })
                    case REPO_ERROR_CODE.FOREIGNKEY_CONSTRAINT:
                        throw new USECASE_ERROR({
                            code: USECASE_ERROR_CODE.FK_CONSTRAINT,
                            message: "invalid userId"
                        })

                    case REPO_ERROR_CODE.UNKNOW:
                        throw new USECASE_ERROR({
                            code: USECASE_ERROR_CODE.UNKNOW,
                            message: "unknow database error"
                        })
                }
            }

            throw new USECASE_ERROR({
                code: USECASE_ERROR_CODE.UNDEFINED,
                message: "UNDEFINED ERROR!"
            })
        }
    }
}

