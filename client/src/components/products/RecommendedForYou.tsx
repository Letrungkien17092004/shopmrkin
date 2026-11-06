import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "../../store/index.ts"
import { useAuthContext } from "../../contexts/AuthContext.tsx"
import { ProductService, AuthService } from "../../services/index.ts"
import { Product } from "../../types/product/index.ts"
import { getMaxPrice, makeThumbnailURL } from "../../utils/index.ts"
import ProductCard from "./ProductCard.tsx"

const authService = new AuthService()
const productService = new ProductService(authService)

export default function RecommendedForYou({ limit = 8 }: { limit?: number }) {
    const { profile } = useAuthContext()
    const { cart } = useSelector((state: RootState) => state.cart)
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // Trích xuất danh sách productId từ các sản phẩm hiện có trong giỏ hàng
    const cartProductIds = useMemo(() => {
        if (!cart || !cart.items || cart.items.length === 0) return []
        const ids = cart.items
            .map((item) => item.variant?.productId)
            .filter((id): id is string => Boolean(id))
        return Array.from(new Set(ids))
    }, [cart])

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setIsLoading(true)
                const data = await productService.getRecommendedForYou({
                    productIds: cartProductIds,
                    cartId: cart?.id || profile?.cartId,
                    userId: profile?.id,
                    limit
                })
                setRecommendedProducts(data)
            } catch (error) {
                console.error("Failed to fetch recommended products:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchRecommendations()
    }, [cartProductIds, cart?.id, profile?.cartId, profile?.id, limit])

    if (!isLoading && recommendedProducts.length === 0) {
        return null
    }

    return (
        <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 rounded-full bg-emerald-600" />
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                                Gợi ý cho bạn
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                                {cartProductIds.length > 0 ? "Mua kèm theo giỏ hàng" : "Đề xuất nổi bật"}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {cartProductIds.length > 0
                                ? "Các linh kiện & sản phẩm thường được người dùng khác mua kèm với giỏ hàng của bạn"
                                : "Khám phá các sản phẩm nổi bật được đề xuất dành riêng cho bạn"}
                        </p>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-slate-200/70 p-3 space-y-3 animate-pulse"
                        >
                            <div className="w-full pt-[100%] bg-slate-200 rounded-xl" />
                            <div className="h-4 bg-slate-200 rounded w-full" />
                            <div className="h-4 bg-slate-200 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recommendedProducts.map((p) => (
                        <Link
                            key={p.id}
                            href={`/product-detail/${p.id}`}
                            className="block h-full no-underline"
                        >
                            <ProductCard
                                imgURL={`${makeThumbnailURL(p.media)}`}
                                discount={0}
                                starPoint={5}
                                name={p.name}
                                price={getMaxPrice(p.variants)}
                            />
                        </Link>
                    ))}
                </div>
            )}
        </section>
    )
}
