import { Request, Response } from "express";
import RecommendRepository from "../../repositories/RecommendRepository.js";
import { REPO_ERROR, REPO_ERROR_CODE } from "../../core/applications/interfaces/repositories/errors.js";

export default class RecommendController {
    private recommendRepo: RecommendRepository;

    constructor(recommendRepo: RecommendRepository) {
        this.recommendRepo = recommendRepo;
    }

    /**
     * GET /api/ml-data/recommend-system-content-based
     * Trả về mảng JSON tương ứng với DataFrame ['id_san_pham', 'Product name', 'content']
     */
    getContentBasedData = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.recommendRepo.getContentBasedData();
            res.status(200).json(data);
            return;
        } catch (error) {
            console.log(error);
            if (error instanceof REPO_ERROR) {
                if (error.code === REPO_ERROR_CODE.INITIAL) {
                    res.status(500).json({
                        message: "Database Error"
                    });
                    return;
                }
            }

            res.status(500).json({
                message: "Server Internal Error!"
            });
            return;
        }
    };
}
