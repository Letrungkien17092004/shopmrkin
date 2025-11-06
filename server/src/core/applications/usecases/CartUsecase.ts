import Cart from "../../../core/entities/Cart.js"
import ICartUsecase from "../interfaces/usecases/ICartUsecase.js"
import ICartRepository, { IncludeOption } from "../interfaces/repositories/ICartRepository.js"
import { REPO_ERROR, REPO_ERROR_CODE } from "../interfaces/repositories/errors.js"
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../interfaces/usecases/errors.js"

export default class CartUsecase implements ICartUsecase {
    private cartRepo: ICartRepository

    constructor(cartRepo: ICartRepository) {
        this.cartRepo = cartRepo
    }

    async create(options: {
        data: { userId: string },
        include?: IncludeOption
    }): Promise<Cart> {
        try {
            const created = await this.cartRepo.create(options)
            return created
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({ message: error.message, code: USECASE_ERROR_CODE.INITIAL })
                }
            }
            throw new USECASE_ERROR({ message: (error as Error).message || "", code: USECASE_ERROR_CODE.UNDEFINED })
        }
    }

    async findOneById(options: {
        where: { id: string },
        include?: IncludeOption
    }): Promise<Cart | null> {
        try {
            return await this.cartRepo.findOneById(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({ message: error.message, code: USECASE_ERROR_CODE.INITIAL })
                }
            }
            throw new USECASE_ERROR({ message: (error as Error).message || "", code: USECASE_ERROR_CODE.UNDEFINED })
        }
    }

    async createOrUpdateItem(options: {
        data: {
            cartId: string,
            variantId: string,
            quantity: number
        }
    }): Promise<void> {
        try {
            return await this.cartRepo.createOrUpdateItem(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({ message: error.message, code: USECASE_ERROR_CODE.INITIAL })
                    case REPO_ERROR_CODE.FOREIGNKEY_CONSTRAINT:
                        throw new USECASE_ERROR({ message: "Cart or Variant not found", code: USECASE_ERROR_CODE.FK_CONSTRAINT })
                }
            }
            throw new USECASE_ERROR({ message: (error as Error).message || "", code: USECASE_ERROR_CODE.UNDEFINED })
        }
    }

    /**
     * Update a cart item (can only change quantity)
     * @param options 
     */
    async updateCartItem(options: {
        where: {
            cartId: string
            cartItemId: string,
        },
        data: { quantity: number; },
    }): Promise<void> {
        try {
            await this.cartRepo.updateCartItem(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({
                            message: "Database error",
                            code: USECASE_ERROR_CODE.INITIAL
                        })
                    
                    case REPO_ERROR_CODE.NOTFOUND:
                        throw new USECASE_ERROR({
                            message: "Cart item is not found",
                            code: USECASE_ERROR_CODE.NOTFOUND
                        })
                }
                throw new USECASE_ERROR({
                    message: "is a REPO_ERROR but it is not defined yet",
                    code: USECASE_ERROR_CODE.UNDEFINED
                })
            }
            throw new USECASE_ERROR({
                message: "UNKNOW Error",
                code: USECASE_ERROR_CODE.UNKNOW
            })
        }
    }


    async removeItem(options: {
        where: {
            cartId: string,
            cartItemId: string,
            userId: string
        }
    }): Promise<void> {
        try {
            return await this.cartRepo.removeItem(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({ message: error.message, code: USECASE_ERROR_CODE.INITIAL })
                    case REPO_ERROR_CODE.NOTFOUND:
                        throw new USECASE_ERROR({ message: error.message, code: USECASE_ERROR_CODE.NOTFOUND })
                }
            }
            throw new USECASE_ERROR({ message: (error as Error).message || "", code: USECASE_ERROR_CODE.UNDEFINED })
        }
    }

    async deleteById(options: {
        where: { id: string, userId: string }
    }): Promise<void> {
        try {
            return await this.cartRepo.deleteById(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({ message: error.message, code: USECASE_ERROR_CODE.INITIAL })
                }
            }
            throw new USECASE_ERROR({ message: (error as Error).message || "", code: USECASE_ERROR_CODE.UNDEFINED })
        }
    }

}
