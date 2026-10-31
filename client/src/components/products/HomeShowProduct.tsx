import React, { useEffect, useMemo, useState } from "react"
import { ProductService, AuthService } from "../../services/index.ts"
import { Product } from "../../types/product/index.ts"
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

export default function HomeShowProduct() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [sortBy, setSortBy] = useState<string>("default")

    // fetching products
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const fetchedProduct = await productService.getAll({
                    include: {
                        variants: true,
                        media: true
                    }
                })
                setProducts(fetchedProduct || [])
            } catch (err) {
                console.error("Failed to fetch products:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

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

    return (
        <section className="w-full pb-12">
            {/* Top Bar: Search, Result count, Sort */}
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

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-xs sm:text-sm text-slate-500">
                            Hiển thị <span className="font-bold text-slate-800">{filteredAndSortedProducts.length}</span> sản phẩm
                        </div>
                        <ProductSortingOptions sortBy={sortBy} onSortChange={setSortBy} />
                    </div>
                </div>

                <ProductFilteringInfo />
            </div>

            {/* Product Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
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
                        Thử thay đổi từ khóa tìm kiếm hoặc xóa bộ lọc để xem thêm nhiều sản phẩm hấp dẫn khác.
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
            )}
        </section>
    )
}
