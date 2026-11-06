import { PrismaClient } from "@prisma/client";
import { Product, Variant, Media, Category, User } from "../core/entities/index.js";
import { baseExceptionHandler } from "../core/applications/interfaces/repositories/errors.js";

const prisma = new PrismaClient();

export type ContentBasedProductRecord = {
    id_san_pham: string;
    "Product name": string;
    content: string;
};

export type ItemBasedInteractionRecord = {
    user_id: string;
    item_id: string;
    item_name: string;
    total_quantity: number;
};

export type SimilarProductRecord = {
    product: Product;
    similarity_score: number;
    updated_at?: Date | null;
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

    /**
     * Lấy dữ liệu tương tác mua hàng (user - product) phục vụ mô hình Item-Based Recommendation
     * Columns: ['user_id', 'item_id', 'item_name', 'total_quantity']
     */
    async getItemBasedData(): Promise<ItemBasedInteractionRecord[]> {
        try {
            const orders = await prisma.orders.findMany({
                where: {
                    status: {
                        not: "CANCELLED"
                    }
                },
                include: {
                    orderItems: {
                        include: {
                            variant: {
                                include: {
                                    product: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            const interactionMap = new Map<string, ItemBasedInteractionRecord>();

            for (const order of orders) {
                const userId = order.userId;
                for (const orderItem of order.orderItems) {
                    const product = orderItem.variant?.product;
                    if (!product) continue;

                    const key = `${userId}__${product.id}`;
                    const existing = interactionMap.get(key);

                    if (existing) {
                        existing.total_quantity += orderItem.quantity;
                    } else {
                        interactionMap.set(key, {
                            user_id: userId,
                            item_id: product.id,
                            item_name: product.name,
                            total_quantity: orderItem.quantity
                        });
                    }
                }
            }

            return Array.from(interactionMap.values()).sort((a, b) => {
                const userCompare = a.user_id.localeCompare(b.user_id);
                if (userCompare !== 0) return userCompare;
                return a.item_id.localeCompare(b.item_id);
            });
        } catch (error) {
            throw baseExceptionHandler(error);
        }
    }

    /**
     * Lấy danh sách sản phẩm tương đồng theo product_id, sắp xếp từ độ tương đồng cao nhất tới thấp nhất
     */
    async getSimilarProductsByProductId(productId: string, limit?: number): Promise<SimilarProductRecord[]> {
        try {
            const records = await prisma.productSimilarities.findMany({
                where: {
                    product_id: productId
                },
                include: {
                    similarProduct: {
                        include: {
                            variants: true,
                            media: true,
                            category: true,
                            user: true
                        }
                    }
                },
                orderBy: {
                    similarity_score: "desc"
                },
                take: limit
            });

            return records.map((record) => {
                const p = record.similarProduct;
                const media: Media[] = p.media
                    ? p.media.map(
                          (pm) =>
                              new Media({
                                  ...pm,
                                  productId: pm.productId ? pm.productId : undefined
                              })
                      )
                    : [];

                const variants: Variant[] = p.variants
                    ? p.variants.map(
                          (pv) =>
                              new Variant({
                                  ...pv,
                                  price: Number(pv.price)
                              })
                      )
                    : [];

                const category: Category | null = p.category ? new Category(p.category) : null;
                const user: User | undefined = p.user ? new User(p.user) : undefined;

                const product = new Product({
                    ...p,
                    media,
                    variants,
                    category,
                    user
                });

                return {
                    product,
                    similarity_score: record.similarity_score,
                    updated_at: record.updated_at
                };
            });
        } catch (error) {
            throw baseExceptionHandler(error);
        }
    }

    /**
     * Lấy danh sách sản phẩm gợi ý theo chiến lược Item-Based (dựa trên danh sách productIds trong giỏ hàng hoặc lịch sử mua hàng)
     * Nếu có nhiều sản phẩm trong giỏ, cộng dồn (SUM) score của các sản phẩm được gợi ý và sắp xếp giảm dần.
     */
    async getItemBasedRecommendations(options: {
        productIds?: string[];
        cartId?: string;
        userId?: string;
        limit?: number;
    }): Promise<SimilarProductRecord[]> {
        try {
            const limit = options.limit ?? 8;
            const seedProductIdSet = new Set<string>(options.productIds || []);

            // Nếu truyền cartId, lấy các productId đang có trong giỏ hàng
            if (options.cartId) {
                const cartItems = await prisma.cartItems.findMany({
                    where: { cartId: options.cartId },
                    include: {
                        variant: {
                            select: { productId: true }
                        }
                    }
                });
                for (const ci of cartItems) {
                    if (ci.variant?.productId) {
                        seedProductIdSet.add(ci.variant.productId);
                    }
                }
            }

            // Nếu truyền userId mà chưa có sản phẩm nào trong giỏ, lấy từ giỏ hàng hoặc đơn hàng gần nhất của user
            if (options.userId && seedProductIdSet.size === 0) {
                const userCart = await prisma.carts.findUnique({
                    where: { userId: options.userId },
                    include: {
                        cartItems: {
                            include: {
                                variant: {
                                    select: { productId: true }
                                }
                            }
                        }
                    }
                });
                if (userCart) {
                    for (const ci of userCart.cartItems) {
                        if (ci.variant?.productId) {
                            seedProductIdSet.add(ci.variant.productId);
                        }
                    }
                }

                if (seedProductIdSet.size === 0) {
                    const userOrders = await prisma.orders.findMany({
                        where: {
                            userId: options.userId,
                            status: { not: "CANCELLED" }
                        },
                        include: {
                            orderItems: {
                                include: {
                                    variant: {
                                        select: { productId: true }
                                    }
                                }
                            }
                        },
                        orderBy: { createdAt: "desc" },
                        take: 5
                    });
                    for (const ord of userOrders) {
                        for (const oi of ord.orderItems) {
                            if (oi.variant?.productId) {
                                seedProductIdSet.add(oi.variant.productId);
                            }
                        }
                    }
                }
            }

            const seedProductIds = Array.from(seedProductIdSet);
            if (seedProductIds.length === 0) {
                return [];
            }

            const records = await prisma.itemBasedSimilarities.findMany({
                where: {
                    product_id: { in: seedProductIds },
                    recommended_product_id: { notIn: seedProductIds }
                },
                include: {
                    recommendedProduct: {
                        include: {
                            variants: true,
                            media: true,
                            category: true,
                            user: true
                        }
                    }
                }
            });

            // Cộng dồn (SUM) điểm score cho từng recommended_product_id
            const aggregatedMap = new Map<
                string,
                {
                    product: Product;
                    totalScore: number;
                    updatedAt?: Date | null;
                }
            >();

            for (const record of records) {
                const p = record.recommendedProduct;
                const existing = aggregatedMap.get(record.recommended_product_id);

                if (existing) {
                    existing.totalScore += record.score;
                } else {
                    const media: Media[] = p.media
                        ? p.media.map(
                              (pm) =>
                                  new Media({
                                      ...pm,
                                      productId: pm.productId ? pm.productId : undefined
                                  })
                          )
                        : [];

                    const variants: Variant[] = p.variants
                        ? p.variants.map(
                              (pv) =>
                                  new Variant({
                                      ...pv,
                                      price: Number(pv.price)
                                  })
                          )
                        : [];

                    const category: Category | null = p.category ? new Category(p.category) : null;
                    const user: User | undefined = p.user ? new User(p.user) : undefined;

                    const product = new Product({
                        ...p,
                        media,
                        variants,
                        category,
                        user
                    });

                    aggregatedMap.set(record.recommended_product_id, {
                        product,
                        totalScore: record.score,
                        updatedAt: record.updated_at
                    });
                }
            }

            return Array.from(aggregatedMap.values())
                .sort((a, b) => b.totalScore - a.totalScore)
                .slice(0, limit)
                .map((entry) => ({
                    product: entry.product,
                    similarity_score: Number(entry.totalScore.toFixed(6)),
                    updated_at: entry.updatedAt
                }));
        } catch (error) {
            throw baseExceptionHandler(error);
        }
    }
}
