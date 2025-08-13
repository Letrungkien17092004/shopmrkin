import { Request, Response } from "express";
import IProductUsecase from "core/applications/interfaces/usecases/IProductUsecase.js";
import ICategoryUsecase from "core/applications/interfaces/usecases/ICategoryUsecase.js";
import IVariantUsecase from "core/applications/interfaces/usecases/IVariantUsecase";

export default class ProductController {
    private productUsecase: IProductUsecase
    private categoryUsecase: ICategoryUsecase
    private variantUsecase: IVariantUsecase

    constructor(productUsecase: IProductUsecase, categoryUsecase: ICategoryUsecase, variantUsecase: IVariantUsecase) {
        this.productUsecase = productUsecase
        this.categoryUsecase = categoryUsecase
        this.variantUsecase = variantUsecase
    }

    async addProduct(req: Request, res: Response): Promise<void> {
        throw new Error("No code!");
    }

    async findProductWithId(req: Request, res: Response): Promise<void> {
        throw new Error("No code!");
    }

    async findProductWithCode(req: Request, res: Response): Promise<void> {
        throw new Error("No code!");
    }

    async updateProduct(req: Request, res: Response): Promise<void> {
        throw new Error("No code!");
    }

    async deleteProduct(req: Request, res: Response): Promise<void> {
        throw new Error("No code!");
    }
}