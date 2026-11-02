import { PrismaClient } from "@prisma/client";
import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js";

const prisma = new PrismaClient();

export type ContentBasedProductRecord = {
    id_san_pham: string;
    "Product name": string;
    content: string;
};

export default class RecommendRepository {
    /**
     * Chuyển đổi giá sang dạng keyword text giống notebook tuan-4-content-based.ipynb
     */
    private categorizePrice(price: unknown): string {
        const numPrice = Number(price);
        if (price === null || price === undefined || Number.isNaN(numPrice)) {
            return "";
        }

        if (numPrice < 200000) {
            return "gia_duoi_200k";
        } else if (numPrice >= 200000 && numPrice < 500000) {
            return "gia_200k_den_500k";
        } else if (numPrice >= 500000 && numPrice < 1000000) {
            return "gia_500k_den_1tr";
        } else {
            return "gia_tren_1tr";
        }
    }

    /**
     * Lấy dữ liệu sản phẩm kết hợp biến thể phục vụ mô hình Content-Based Recommendation
     * Kết quả tương đương DataFrame final_df trong tuan-4-content-based.ipynb:
     * Columns: ['id_san_pham', 'Product name', 'content']
     */
    async getContentBasedData(): Promise<ContentBasedProductRecord[]> {
        try {
            const products = await prisma.products.findMany({
                where: {
                    variants: {
                        some: {}
                    }
                },
                include: {
                    variants: true
                },
                orderBy: [
                    { id: "asc" },
                    { name: "asc" }
                ]
            });

            return products.map((product) => {
                const contentDetails = new Set<string>();

                for (const variant of product.variants) {
                    const priceTag = this.categorizePrice(variant.price);
                    const detail = `${String(product.name)} ${String(variant.name)} ${priceTag}`;
                    contentDetails.add(detail);
                }

                return {
                    id_san_pham: product.id,
                    "Product name": product.name,
                    content: Array.from(contentDetails).join(" ")
                };
            });
        } catch (error) {
            throw baseExceptionHandler(error);
        }
    }
}
