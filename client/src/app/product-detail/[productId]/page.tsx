'use client'

import React, { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ProductImageSlider, RecommendedForYou } from "@/components/products/index.ts"
import ProductCard from "@/components/products/ProductCard.tsx"
import Loading from "@/components/waiter/Loading.tsx"
import { NoticeManager } from "@/components/notifications/index.tsx"
import { useNoticeManager } from "@/hooks/index.ts"
import { ProductService, AuthService } from "@/services/index.ts"
import { Product, Variant } from "@/types/product/index.ts"
import { addCartItem } from "@/store/cartSlice.ts"
import { RootState, AppDispatch } from "@/store/index.ts"
import { useDispatch, useSelector } from "react-redux"
import { useAuthContext } from "@/contexts/AuthContext.tsx"
import {
    getCartItemByVariantId,
    getMinPrice,
    getMaxPrice,
    getTotalStock,
    makeThumbnailURL,
    formatPrice
} from "@/utils/index.ts"
import { MainLayout } from "@/components/layout/index.tsx"

const authService = new AuthService()
const productService = new ProductService(authService)

interface VariantListProps {
    variants: Variant[],
    selectedVariant: Variant | undefined,
    createSelectedEvent: (id: string) => ((e: React.MouseEvent) => void) | undefined
}

function VariantList({ variants, selectedVariant, createSelectedEvent }: VariantListProps) {
    return (
        <div className="flex flex-wrap gap-2.5">
            {variants.map(v => {
                const selected = selectedVariant?.id === v.id;
                const outOfStock = v.stock <= 0;
                return (
                    <button
                        type="button"
                        key={v.sku}
                        onClick={createSelectedEvent(v.id)}
                        className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold border transition cursor-pointer flex items-center gap-2 ${
                            selected
                                ? "bg-emerald-50 text-emerald-700 border-emerald-500 ring-2 ring-emerald-500/20"
                                : outOfStock
                                    ? "bg-slate-50 text-slate-400 border-slate-200 opacity-60"
                                    : "bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-slate-50/60"
                        }`}
                    >
                        <span>{v.name}</span>
                        {selected && (
                            <svg className="size-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default function ProductDetailPage() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [product, setProduct] = useState<Product | undefined>(undefined)
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
    const [defaultPrice, setDefaultPrice] = useState<{ minPrice: number, maxPrice: number } | undefined>(undefined)
    const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(undefined)
    const [buyQuantity, setBuyQuantity] = useState<number>(1)

    const params = useParams()
    const router = useRouter()
    const productId = params?.productId as string | undefined
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [canAdd, setCanAdd] = useState<boolean>(false)
    const dispatch: AppDispatch = useDispatch()
    const { cart } = useSelector((state: RootState) => state.cart)
    const { profile } = useAuthContext()
    const { noticeList, pushMessage } = useNoticeManager()

    useEffect(() => {
        const fetchData = async () => {
            if (!productId) return
            try {
                setIsLoading(true)
                const productData = await productService.findById(productId)
                if (productData) {
                    setProduct(productData)
                    setDefaultPrice({
                        minPrice: getMinPrice(productData.variants) || 0,
                        maxPrice: getMaxPrice(productData.variants) || 0
                    })
                    if (productData.variants && productData.variants.length > 0) {
                        setSelectedVariant(productData.variants[0])
                    }
                }
                const similarProducts = await productService.getSimilarProducts(productId)
                if (similarProducts) {
                    setRelatedProducts(similarProducts)
                }
            } catch (err) {
                console.error("Failed to fetch product detail:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [productId])

    useEffect(() => {
        if (isAdding) {
            setCanAdd(false)
            return
        }
        if (selectedVariant && selectedVariant.stock > 0) {
            setCanAdd(true)
        } else {
            setCanAdd(false)
        }
        setBuyQuantity(1)
    }, [selectedVariant, isAdding])

    const createSelectedEvent = useCallback((id: string) => {
        if (!product || product.variants.length <= 0) { return }
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            if (selectedVariant && selectedVariant.id === id) {
                setSelectedVariant(undefined)
                return
            }
            setSelectedVariant(product.variants.find(v => v.id === id))
        }
    }, [product, selectedVariant])

    const addItemEvent = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        if (!profile) {
            pushMessage({ message: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", noticeType: "warning" })
            setTimeout(() => router.push("/login"), 1200)
            return
        }
        if (!cart) {
            pushMessage({ message: "Giỏ hàng đang khởi tạo, vui lòng thử lại!", noticeType: "error" })
            return
        }
        if (!selectedVariant || isAdding) { return }

        const callApi = async () => {
            let quantity = buyQuantity
            const item = getCartItemByVariantId(cart, selectedVariant.id)
            if (item) {
                quantity = item.quantity + buyQuantity
            }
            await dispatch(addCartItem({
                cartId: cart.id,
                variantId: selectedVariant.id,
                quantity: quantity
            }))
        }
        setIsAdding(true)
        callApi()
            .then(() => {
                setIsAdding(false)
                pushMessage({ message: `Đã thêm ${buyQuantity} sản phẩm vào giỏ hàng!`, noticeType: "normal" })
            })
            .catch((err) => {
                setIsAdding(false)
                pushMessage({ message: "Thêm vào giỏ hàng thất bại!", noticeType: "error" })
                console.log("[Error] in AddItemEvent: \n", err)
            })
    }, [selectedVariant, isAdding, cart, profile, buyQuantity, dispatch, pushMessage, router])

    if (isLoading) {
        return (
            <MainLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8 sm:p-12">
                        <Loading label="Đang tải thông tin sản phẩm..." size="lg" />
                    </div>
                </div>
            </MainLayout>
        )
    }

    if (!product) {
        return (
            <MainLayout>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-12 text-center space-y-4">
                        <div className="mx-auto size-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                            <svg className="size-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-extrabold text-slate-800">
                            Không tìm thấy sản phẩm bạn yêu cầu
                        </h1>
                        <p className="text-sm text-slate-500 max-w-md mx-auto">
                            Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không chính xác.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition no-underline"
                        >
                            ← Quay về trang chủ
                        </Link>
                    </div>
                </div>
            </MainLayout>
        )
    }

    const totalStock = getTotalStock(product.variants) || 0
    const currentStock = selectedVariant ? selectedVariant.stock : totalStock
    const renderPriceRange = () => {
        if (selectedVariant) {
            return formatPrice(selectedVariant.price)
        }
        if (!defaultPrice) return formatPrice(0)
        if (defaultPrice.minPrice === defaultPrice.maxPrice) {
            return formatPrice(defaultPrice.minPrice)
        }
        return `${formatPrice(defaultPrice.minPrice)} - ${formatPrice(defaultPrice.maxPrice)}`
    }

    return (
        <MainLayout>
            <NoticeManager noticeList={noticeList} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-emerald-600 transition no-underline text-slate-500">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <Link href="/#products-section" className="hover:text-emerald-600 transition no-underline text-slate-500">
                        Sản phẩm
                    </Link>
                    <span>/</span>
                    <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
                        {product.name}
                    </span>
                </nav>

                {/* Main Product Showcase Card */}
                <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-8 lg:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Left Column: Image Gallery */}
                        <div className="lg:col-span-5">
                            <ProductImageSlider
                                images={product.media.map(med => ({ url: `${med.filePath}` }))}
                            />
                        </div>

                        {/* Right Column: Product Details & Purchase Actions */}
                        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                            <div className="space-y-5">
                                {/* Badges & Rating */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
                                        Chính hãng 100%
                                    </span>
                                    <span className="font-mono text-xs text-slate-400">
                                        Mã SP: #{product.product_code}
                                    </span>
                                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                                        {[...Array(5)].map((_, idx) => (
                                            <svg key={idx} className="size-4 fill-amber-400" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                        <span className="text-slate-600 font-semibold ml-1">5.0</span>
                                        <span className="text-slate-400">(128 đánh giá)</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug tracking-tight">
                                    {product.name}
                                </h1>

                                {/* Price Box */}
                                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-emerald-50/40 to-teal-50/30 border border-slate-200/80 flex flex-wrap items-baseline justify-between gap-4">
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                                            Giá bán ưu đãi
                                        </span>
                                        <p className="text-3xl sm:text-4xl font-extrabold text-rose-600 tracking-tight">
                                            {renderPriceRange()}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                currentStock > 0
                                                    ? "bg-emerald-100/80 text-emerald-700"
                                                    : "bg-rose-100 text-rose-700"
                                            }`}
                                        >
                                            <span className={`size-2 rounded-full ${currentStock > 0 ? "bg-emerald-500" : "bg-rose-500"}`} />
                                            {currentStock > 0 ? `Còn hàng (${currentStock} SP)` : "Tạm hết hàng"}
                                        </span>
                                        {selectedVariant && (
                                            <span className="text-[11px] font-mono text-slate-400">
                                                SKU: {selectedVariant.sku}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Variant Options */}
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-700">
                                            Phân loại sản phẩm:
                                        </span>
                                        {!selectedVariant && (
                                            <span className="text-xs text-amber-600 font-medium">
                                                Vui lòng chọn 1 phân loại để mua hàng
                                            </span>
                                        )}
                                    </div>
                                    <VariantList
                                        variants={product.variants}
                                        selectedVariant={selectedVariant}
                                        createSelectedEvent={createSelectedEvent}
                                    />
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex items-center gap-4 pt-1">
                                    <span className="text-sm font-bold text-slate-700">Số lượng:</span>
                                    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                                        <button
                                            type="button"
                                            onClick={() => setBuyQuantity((q) => Math.max(1, q - 1))}
                                            disabled={!selectedVariant || buyQuantity <= 1}
                                            className="size-8 rounded-lg bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center font-bold shadow-2xs transition cursor-pointer"
                                            aria-label="Giảm số lượng"
                                        >
                                            −
                                        </button>
                                        <span className="w-12 text-center text-sm font-bold text-slate-800">
                                            {buyQuantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setBuyQuantity((q) =>
                                                    selectedVariant ? Math.min(selectedVariant.stock, q + 1) : q + 1
                                                )
                                            }
                                            disabled={!selectedVariant || buyQuantity >= selectedVariant.stock}
                                            className="size-8 rounded-lg bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center font-bold shadow-2xs transition cursor-pointer"
                                            aria-label="Tăng số lượng"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons & Service Assurances */}
                            <div className="space-y-5 pt-4 border-t border-slate-100">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="button"
                                        disabled={!canAdd}
                                        onClick={addItemEvent}
                                        title={canAdd ? "Thêm vào giỏ hàng" : "Vui lòng chọn phân loại sản phẩm"}
                                        className={`flex-1 inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl text-base font-bold transition shadow-sm ${
                                            canAdd
                                                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 cursor-pointer"
                                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        }`}
                                    >
                                        <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                        </svg>
                                        <span>{isAdding ? "Đang thêm..." : "Thêm vào giỏ hàng"}</span>
                                    </button>
                                </div>

                                {/* Trust Strip */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                                        <svg className="size-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                                        </svg>
                                        <span>Bảo hành chính hãng 12 tháng</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                                        <svg className="size-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                        </svg>
                                        <span>Lỗi 1 đổi 1 trong 30 ngày</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                                        <svg className="size-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                        </svg>
                                        <span>Miễn phí giao hàng toàn quốc</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Description Section */}
                <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                        <div className="w-1.5 h-6 rounded-full bg-emerald-600" />
                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                            Mô tả chi tiết sản phẩm
                        </h2>
                    </div>
                    <div className="prose prose-slate max-w-none">
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                            {product.description}
                        </p>
                    </div>
                </section>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-1.5 h-6 rounded-full bg-emerald-600" />
                                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                                    Sản phẩm tương tự
                                </h2>
                            </div>
                            <Link
                                href="/"
                                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 no-underline"
                            >
                                Xem tất cả →
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {relatedProducts.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={`/product-detail/${rel.id}`}
                                    className="block h-full no-underline"
                                >
                                    <ProductCard
                                        imgURL={`${makeThumbnailURL(rel.media)}`}
                                        discount={0}
                                        starPoint={5}
                                        name={rel.name}
                                        price={getMaxPrice(rel.variants)}
                                    />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
                {/* Recommended For You Section (Item-Based / Fallback) */}
                <RecommendedForYou limit={4} />
            </div>
        </MainLayout>
    )
}

