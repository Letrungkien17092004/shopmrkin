import Cart from "../../../core/entities/Cart.js"
import ICartUsecase from "../interfaces/usecases/ICartUsecase.js"
import ICartRepository, { CartIncludeOption } from "../interfaces/repositories/ICartRepository.js"
import { REPO_ERROR, REPO_ERROR_CODE } from "../interfaces/repositories/errors.js"
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../interfaces/usecases/errors.js"

export default class CartUsecase implements ICartUsecase {
    private cartRepo: ICartRepository

    constructor(cartRepo: ICartRepository) {
        this.cartRepo = cartRepo
    }

    async create(options: {
        data: { userId: string },
        include?: CartIncludeOption
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

    async findOneByUserId(options: {
        userId: string,
        include?: CartIncludeOption
    }): Promise<Cart | null> {
        try {
            return await this.cartRepo.findOneByUserId(options)
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

    async addItem(options: { cartId: string, variantId: string, quantity: number }): Promise<void> {
        try {
            return await this.cartRepo.addItem(options)
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.INITIAL:
                        throw new USECASE_ERROR({ message: error.message, code: USECASE_ERROR_CODE.INITIAL })
                    case REPO_ERROR_CODE.FOREIGNKEY_CONSTRAINT:
                        throw new USECASE_ERROR({ message: "Cart or Variant not found", code: USECASE_ERROR_CODE.CONSTRAINT })
                }
            }
            throw new USECASE_ERROR({ message: (error as Error).message || "", code: USECASE_ERROR_CODE.UNDEFINED })
        }
    }

    async removeItem(options: { cartId: string, variantId: string }): Promise<void> {
        try {
            return await this.cartRepo.removeItem(options)
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
                    case REPO_ERROR_CODE.NOTFOUND:
                        throw new USECASE_ERROR({ message: error.message, code: USECASE_ERROR_CODE.NOTFOUND })
                }
            }
            throw new USECASE_ERROR({ message: (error as Error).message || "", code: USECASE_ERROR_CODE.UNDEFINED })
        }
    }
}
