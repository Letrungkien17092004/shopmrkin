import React, { useEffect, useMemo, useState } from "react"
import { ProductService, AuthService } from "../../services/index.ts"
import type { PaginationMeta } from "../../services/ProductService.ts"
import { Product } from "../../types/product/index.ts"
import { useProductFilter } from "../../contexts/ProductFilterContext.tsx"
import {
    getMaxPrice,
    makeThumbnailURL
} from "../../utils/index.ts"

import ProductCard from "./ProductCard.tsx"
import ProductSortingOptions from "./HomeProductSortingOptions.tsx"
import ProductFilteringInfo from "./HomeProductFilteringInfo.tsx"
import Link from "next/link"

const authService = new AuthService()
const productService = new ProductService(authService)

const PAGE_LIMIT_OPTIONS = [12, 24, 48]

export default function HomeShowProduct() {
    const { categoryId } = useProductFilter()
    const [products, setProducts] = useState<Product[]>([])
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(12)
    const [pagination, setPagination] = useState<PaginationMeta>({
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 1
    })
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [sortBy, setSortBy] = useState<string>("default")

    // Reset về trang 1 khi đổi danh mục hoặc đổi limit
    useEffect(() => {
        setPage(1)
    }, [categoryId, limit])

    // Gọi API lấy sản phẩm theo categoryId, page, limit
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const result = await productService.getPaginated({
                    categoryId,
                    page,
                    limit,
                    include: {
                        variants: true,
                        media: true,
                        category: true
                    }
                })
                setProducts(result.products || [])
                setPagination(result.pagination)
            } catch (err) {
                console.error("Failed to fetch products:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [categoryId, page, limit])

    const filteredAndSortedProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        const filtered = query
            ? products.filter((p) => p.name.toLowerCase().includes(query))
            : [...products]

        if (sortBy === "increment") {
            filtered.sort((a, b) => (getMaxPrice(a.variants) || 0) - (getMaxPrice(b.variants) || 0))
        } else if (sortBy === "descrement") {
            filtered.sort((a, b) => (getMaxPrice(b.variants) || 0) - (getMaxPrice(a.variants) || 0))
        } else if (sortBy === "name-asc") {
            filtered.sort((a, b) => a.name.localeCompare(b.name, "vi"))
        }
        return filtered
    }, [products, searchQuery, sortBy])

    const pageNumbers = useMemo(() => {
        const totalPages = pagination.totalPages || 1
        const current = pagination.page || 1
        const delta = 2
        const pages: number[] = []
        for (let i = Math.max(1, current - delta); i <= Math.min(totalPages, current + delta); i++) {
            pages.push(i)
        }
        return pages
    }, [pagination])

    return (
        <section className="w-full pb-12">
            {/* Top Bar: Search, Result count, Limit, Sort */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Search input */}
                    <div className="relative flex-1 max-w-md">
                        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm sản phẩm theo tên..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
                        <div className="text-xs sm:text-sm text-slate-500">
                            Hiển thị <span className="font-bold text-slate-800">{filteredAndSortedProducts.length}</span> /{" "}
                            <span className="font-bold text-emerald-700">{pagination.total}</span> sản phẩm
                        </div>

                        {/* Chọn số sản phẩm / trang */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <span>Hiển thị:</span>
                            <select
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                            >
                                {PAGE_LIMIT_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt} / trang
                                    </option>
                                ))}
                            </select>
                        </div>

                        <ProductSortingOptions sortBy={sortBy} onSortChange={setSortBy} />
                    </div>
                </div>

                <ProductFilteringInfo />
            </div>

            {/* Product Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(limit > 12 ? 12 : limit)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-slate-200/70 p-3 space-y-3 animate-pulse"
                        >
                            <div className="w-full pt-[100%] bg-slate-200 rounded-xl" />
                            <div className="h-3 bg-slate-200 rounded w-1/3" />
                            <div className="h-4 bg-slate-200 rounded w-full" />
                            <div className="h-4 bg-slate-200 rounded w-2/3" />
                            <div className="pt-2 flex justify-between items-center">
                                <div className="h-5 bg-slate-200 rounded w-1/2" />
                                <div className="size-8 bg-slate-200 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredAndSortedProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
                    <div className="mx-auto size-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                        <svg className="size-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                    <h3 className="text-base font-bold text-slate-800">Không tìm thấy sản phẩm nào</h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                        Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác để xem thêm nhiều sản phẩm hấp dẫn.
                    </p>
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="mt-2 inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer"
                        >
                            Xóa tìm kiếm
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredAndSortedProducts.map((p) => (
                            <Link
                                key={p.id}
                                className="block h-full no-underline"
                                href={`/product-detail/${p.id}`}
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

                    {/* Pagination Bar */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-xs sm:text-sm text-slate-500">
                                Trang <span className="font-bold text-slate-800">{pagination.page}</span> /{" "}
                                <span className="font-bold text-slate-800">{pagination.totalPages}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                                >
                                    ← Trước
                                </button>

                                {pageNumbers[0] > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setPage(1)}
                                            className="size-8 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition"
                                        >
                                            1
                                        </button>
                                        {pageNumbers[0] > 2 && <span className="px-1 text-slate-400 text-xs">...</span>}
                                    </>
                                )}

                                {pageNumbers.map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setPage(num)}
                                        className={`size-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                                            num === page
                                                ? "bg-emerald-600 text-white shadow-xs"
                                                : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                                        }`}
                                    >
                                        {num}
                                    </button>
                                ))}

                                {pageNumbers[pageNumbers.length - 1] < pagination.totalPages && (
                                    <>
                                        {pageNumbers[pageNumbers.length - 1] < pagination.totalPages - 1 && (
                                            <span className="px-1 text-slate-400 text-xs">...</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setPage(pagination.totalPages)}
                                            className="size-8 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition"
                                        >
                                            {pagination.totalPages}
                                        </button>
                                    </>
                                )}

                                <button
                                    type="button"
                                    disabled={page >= pagination.totalPages}
                                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                                >
                                    Sau →
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    )
}
