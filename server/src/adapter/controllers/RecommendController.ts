import { Request, Response } from "express";
import RecommendRepository from "../../repositories/RecommendRepository.js";
import { REPO_ERROR, REPO_ERROR_CODE } from "../../core/applications/interfaces/repositories/errors.js";
import { ProductDTO } from "../../adapter/DTO/index.js";

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

    /**
     * GET /api/ml-data/recommend-system-item-based
     * Trả về mảng JSON tương ứng với DataFrame ['user_id', 'item_id', 'item_name', 'total_quantity']
     */
    getItemBasedData = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.recommendRepo.getItemBasedData();
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

    /**
     * GET /api/products/:productId/similar (hoặc /api/product/:id/similar)
     * Trả về danh sách sản phẩm có độ tương đồng từ cao nhất tới thấp nhất của một sản phẩm
     */
    getSimilarProducts = async (req: Request, res: Response): Promise<void> => {
        try {
            const productId = (req.params.productId || req.params.id || req.query.product_id) as string | undefined;

            if (!productId || productId.trim() === "") {
                res.status(400).json({
                    message: "product_id is required"
                });
                return;
            }

            const rawLimit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
            const limit = rawLimit && !Number.isNaN(rawLimit) && rawLimit > 0 ? rawLimit : undefined;

            const similarItems = await this.recommendRepo.getSimilarProductsByProductId(productId, limit);

            const products = similarItems.map((item) => ({
                ...ProductDTO.toOutputSingle(item.product, req),
                similarity_score: item.similarity_score,
                similarity_updated_at: item.updated_at
            }));

            res.status(200).json({
                product_id: productId,
                products
            });
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

    /**
     * GET /api/recommend/for-you (hoặc /api/recommend/item-based)
     * Query params tùy chọn:
     *   - productIds: danh sách productId phân tách bằng dấu phẩy (ví dụ: id1,id2)
     *   - cartId: mã giỏ hàng của người dùng
     *   - userId: mã người dùng
     *   - limit: số lượng sản phẩm gợi ý (mặc định 8)
     */
    getItemBasedRecommendations = async (req: Request, res: Response): Promise<void> => {
        try {
            const rawProductIds = req.query.productIds as string | string[] | undefined;
            let productIds: string[] = [];

            if (typeof rawProductIds === "string" && rawProductIds.trim() !== "") {
                productIds = rawProductIds
                    .split(",")
                    .map((id) => id.trim())
                    .filter(Boolean);
            } else if (Array.isArray(rawProductIds)) {
                productIds = rawProductIds.map((id) => String(id).trim()).filter(Boolean);
            }

            const cartId = (req.query.cartId as string | undefined)?.trim() || undefined;
            const userId = (req.query.userId as string | undefined)?.trim() || undefined;
            const rawLimit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
            const limit = !Number.isNaN(rawLimit) && rawLimit > 0 ? rawLimit : 8;

            const recommendedItems = await this.recommendRepo.getItemBasedRecommendations({
                productIds,
                cartId,
                userId,
                limit
            });

            const products = recommendedItems.map((item) => ({
                ...ProductDTO.toOutputSingle(item.product, req),
                similarity_score: item.similarity_score,
                similarity_updated_at: item.updated_at
            }));

            res.status(200).json({
                products
            });
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
