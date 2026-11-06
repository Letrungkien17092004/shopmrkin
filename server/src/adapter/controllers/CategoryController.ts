import { Request, Response } from "express";
import ICategoryUsecase from "../../core/applications/interfaces/usecases/ICategoryUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../../core/applications/interfaces/usecases/errors.js";

export default class CategoryController {
    private categoryUsecase: ICategoryUsecase;

    constructor(categoryUsecase: ICategoryUsecase) {
        this.categoryUsecase = categoryUsecase;
    }

    /**
     * GET /api/categories
     * Trả về danh sách các danh mục hiện có kèm số lượng sản phẩm
     */
    findMany = async (req: Request, res: Response): Promise<void> => {
        try {
            const categories = await this.categoryUsecase.findMany();
            res.status(200).json({
                categories: categories.map((cat) => ({
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    productCount: cat.productCount ?? 0
                }))
            });
            return;
        } catch (error) {
            console.log(error);
            if (error instanceof USECASE_ERROR) {
                if (error.code === USECASE_ERROR_CODE.INITIAL) {
                    res.status(500).json({
                        message: "Database Error"
                    });
                    return;
                }
            }
            res.status(500).json({
                message: "Server internal error"
            });
            return;
        }
    };
}
