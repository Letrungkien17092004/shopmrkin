import IOrderRepository, { IncludeOption, OrderByOption } from "../interfaces/repositories/IOrderRepository.js";
import IVariantRepository from "../interfaces/repositories/IVariantRepository.js";
import IOrderUsecase from "../interfaces/usecases/IOrderUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../interfaces/usecases/errors.js";
import { Order, Variant } from "../../entities/index.js";
import { REPO_ERROR, REPO_ERROR_CODE } from "../interfaces/repositories/errors";

export default class OrderUsecase implements IOrderUsecase {
    private orderRepo: IOrderRepository
    private variantRepo: IVariantRepository

    constructor(orderRepo: IOrderRepository, variantRepo: IVariantRepository) {
        this.orderRepo = orderRepo
        this.variantRepo = variantRepo
    }

    /**
     * Create a Order
     * @param options 
     */
    async create(options: {
        data: {
            userId: string,
            orderItems: {
                variantId: string
                quantity: number
            }[]
        },
        include?: IncludeOption
    }): Promise<Order> {
        try {
            type VariantWithQuantities = Variant & {
                quantity: number
            }

            const variantIdList = options.data.orderItems.map(oi => oi.variantId)
            const variants = await this.variantRepo.findManyByIds({ where: { id: variantIdList } })
            const variantWithQuantities: VariantWithQuantities[] = variants.map(v => {
                let quantity = options.data.orderItems.find(oi => oi.variantId === v.id)!.quantity
                return {
                    ...v,
                    quantity: quantity
                }
            })


            const totalAmount: number = variantWithQuantities.reduce((total, v) => total + (v.price * v.quantity), 0)


            return await this.orderRepo.create({
                data: {
                    ...options.data,
                    totalAmount: totalAmount
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
                            message: "Order already exists"
                        })
                    case REPO_ERROR_CODE.FOREIGNKEY_CONSTRAINT:
                        throw new USECASE_ERROR({
                            code: USECASE_ERROR_CODE.FK_CONSTRAINT,
                            message: "invalid user or variant"
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
            return await this.orderRepo.findOneById(options)
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
            return await this.orderRepo.findMany(options)
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
     * Update a order by Order's ID (can only update order status)
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
            await this.orderRepo.updateById(options)
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
                            message: "Data already exists"
                        })
                    case REPO_ERROR_CODE.FOREIGNKEY_CONSTRAINT:
                        throw new USECASE_ERROR({
                            code: USECASE_ERROR_CODE.FK_CONSTRAINT,
                            message: "invalid data"
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