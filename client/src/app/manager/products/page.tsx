'use client'

import React, { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ProductService, AuthService } from "@/services/index.ts"
import { Product } from "@/types/product/index.ts"
import {
    getTotalStock,
    getMinPrice,
    getMaxPrice,
    makeThumbnailURL
} from "@/utils/index.ts"
import { useNoticeManager } from "@/hooks/index.ts"
import { NoticeManager } from "@/components/notifications/index.tsx"
import Loading from "@/components/waiter/Loading.tsx"
import { ProductTable } from "@/components/table/index.ts"

const authService = new AuthService()
const productService = new ProductService(authService)

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [toDelete, setToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const { noticeList, pushMessage } = useNoticeManager()

    const fetchProducts = useCallback(async () => {
        const list = await productService.getAll({
            include: {
                user: true,
                variants: true,
                media: true
            }
        })
        setProducts(list || [])
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    useEffect(() => {
        if (!toDelete) { return }
        const deleteData = async () => {
            try {
                await productService.deleteById(toDelete)
                await fetchProducts()
                pushMessage({
                    message: "Đã xóa sản phẩm thành công",
                    noticeType: "normal"
                })
            } catch (error) {
                pushMessage({
                    message: `Xóa thất bại: ${error}`,
                    noticeType: "error"
                })
            } finally {
                setToDelete(null)
                setIsDeleting(false)
            }
        }
        deleteData()
        setIsDeleting(true)
    }, [toDelete, fetchProducts, pushMessage])

    const createDeleteEventHandler = useCallback((id: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
                setToDelete(id)
            }
        }
    }, [])

    const mappedProducts = useMemo(() => {
        const list = products.map(p => ({
            ...p,
            imageURL: `${makeThumbnailURL(p.media)}`,
            minPrice: getMinPrice(p.variants),
            maxPrice: getMaxPrice(p.variants),
            stock: getTotalStock(p.variants) || 0
        }))
        const q = searchQuery.trim().toLowerCase()
        if (!q) return list
        return list.filter(p =>
            p.name.toLowerCase().includes(q) || String(p.product_code).includes(q)
        )
    }, [products, searchQuery])

    const totalStockAll = useMemo(
        () => products.reduce((sum, p) => sum + (getTotalStock(p.variants) || 0), 0),
        [products]
    )

    return (
        <>
            <NoticeManager noticeList={noticeList} />
            <div className="max-w-6xl mx-auto space-y-6 pb-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                            Quản lý sản phẩm
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            Theo dõi danh mục, tồn kho và thêm sản phẩm mới vào cửa hàng.
                        </p>
                    </div>
                    <Link
                        href="/manager/products/new"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm shadow-emerald-600/20 transition no-underline shrink-0"
                    >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>Thêm sản phẩm mới</span>
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center gap-4">
                        <div className="size-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500">Tổng số sản phẩm</p>
                            <p className="text-xl font-extrabold text-slate-900">{products.length}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center gap-4">
                        <div className="size-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500">Tổng tồn kho</p>
                            <p className="text-xl font-extrabold text-slate-900">{totalStockAll} SP</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center gap-4">
                        <div className="size-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500">Sắp hết hàng (&lt;10)</p>
                            <p className="text-xl font-extrabold text-slate-900">
                                {mappedProducts.filter(p => p.stock < 10).length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search & Product Table Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                                placeholder="Tìm theo tên hoặc mã sản phẩm..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                            />
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                            Hiển thị <strong className="text-slate-800">{mappedProducts.length}</strong> sản phẩm
                        </span>
                    </div>

                    {isDeleting ? (
                        <div className="p-12 flex justify-center">
                            <Loading />
                        </div>
                    ) : (
                        <ProductTable
                            listProduct={mappedProducts}
                            createDeleteEventHandler={createDeleteEventHandler}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

