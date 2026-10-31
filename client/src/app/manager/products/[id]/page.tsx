'use client'

import React, { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ProductService, AuthService } from "@/services/index.ts"
import { Product, Variant } from "@/types/product/index.ts"
import { getMinPrice, getMaxPrice, formatPrice } from "@/utils/index.ts"
import ProductImageSlider from "@/components/products/ProductImageSlider.tsx"

const authService = new AuthService()
const productService = new ProductService(authService)

interface VariantListProps {
    variants: Variant[],
    selectedVariant: Variant | undefined,
    createSelectedEvent: (id: string) => ((e: React.MouseEvent) => void) | undefined
}

function VariantList({ variants, selectedVariant, createSelectedEvent }: VariantListProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {variants.map(v => {
                const isSelected = selectedVariant && selectedVariant.id === v.id
                return (
                    <button
                        type="button"
                        key={v.sku}
                        onClick={createSelectedEvent(v.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            isSelected
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                : "bg-white text-slate-700 border-slate-200 hover:border-emerald-400"
                        }`}
                    >
                        {v.name}
                    </button>
                )
            })}
        </div>
    )
}

export default function AdminProductDetailPage() {
    const params = useParams()
    const id = params?.id as string | undefined
    const [product, setProduct] = useState<Product | null>(null)
    const [defaultPrice, setDefaultPrice] = useState<string | undefined>(undefined)
    const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(undefined)

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const searchedProduct = await productService.findById(id)
                if (searchedProduct) {
                    const minP = getMinPrice(searchedProduct.variants) || 0
                    const maxP = getMaxPrice(searchedProduct.variants) || 0
                    setDefaultPrice(
                        minP === maxP ? formatPrice(minP) : `${formatPrice(minP)} - ${formatPrice(maxP)}`
                    )
                }
                setProduct(searchedProduct)
            }
        }
        fetchData()
    }, [id])

    const createSelectedEvent = useCallback((variantId: string) => {
        if (!product) { return }
        if (product.variants.length <= 0) { return }
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            if (selectedVariant && selectedVariant.id === variantId) {
                setSelectedVariant(undefined)
                return
            }
            setSelectedVariant(product.variants.find(v => v.id === variantId))
        }
    }, [product, selectedVariant])

    if (!product) {
        return (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
                <p className="text-base font-bold text-slate-700">Không tìm thấy sản phẩm này</p>
                <Link
                    href="/manager/products"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold no-underline"
                >
                    Quay lại danh sách
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                <div className="space-y-1">
                    <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <Link href="/manager/products" className="hover:text-emerald-600 no-underline text-slate-400">
                            Sản phẩm
                        </Link>
                        <span>/</span>
                        <span className="text-slate-700 font-semibold">Chi tiết #{product.product_code}</span>
                    </nav>
                    <h1 className="text-xl font-extrabold text-slate-900 line-clamp-1">
                        {product.name}
                    </h1>
                </div>

                <Link
                    href="/manager/products"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition no-underline shrink-0"
                >
                    ← Quay lại
                </Link>
            </div>

            {/* Product Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-5">
                    <ProductImageSlider
                        images={product.media.map(med => ({ url: `${med.filePath}` }))}
                    />
                </div>
                <div className="md:col-span-7 space-y-5">
                    <div>
                        <span className="inline-block font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 mb-2">
                            Mã SP: #{product.product_code}
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 leading-snug">
                            {product.name}
                        </h2>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-medium text-slate-500 block">Giá bán niêm yết</span>
                        <p className="text-2xl font-extrabold text-rose-600 mt-0.5">
                            {selectedVariant ? formatPrice(selectedVariant.price) : defaultPrice}
                        </p>
                        {selectedVariant && (
                            <p className="text-xs text-slate-500 mt-1">
                                SKU: <code className="font-mono font-semibold">{selectedVariant.sku}</code> • Tồn kho:{" "}
                                <strong className="text-emerald-600">{selectedVariant.stock} SP</strong>
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Phân loại ({product.variants.length})
                        </p>
                        <VariantList
                            variants={product.variants}
                            selectedVariant={selectedVariant}
                            createSelectedEvent={createSelectedEvent}
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Mô tả sản phẩm
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                            {product.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

