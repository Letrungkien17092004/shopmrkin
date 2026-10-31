'use client'

import React, { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { CreateProductForm, CreateVariantForm } from "@/components/products/index.ts"
import { CreateImageForm } from "@/components/media/index.ts"
import Loading from "@/components/waiter/Loading.tsx"
import { NoticeManager } from "@/components/notifications/index.tsx"
import { useNoticeManager } from "@/hooks/index.ts"
import { CreateProductProvider, useCreateProduct } from "@/contexts/CreateProductContext.tsx"
import { MediaService, ProductService, VariantService, AuthService } from "@/services/index.ts"
import { formatPrice } from "@/utils/index.ts"

const authService = new AuthService()
const mediaService = new MediaService(authService)
const productService = new ProductService(authService)
const variantService = new VariantService(authService)

function CreateProductWrapper() {
    const { product, variants, media } = useCreateProduct()
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const { noticeList, pushMessage } = useNoticeManager()

    useEffect(() => {
        if (!isSaving) { return }
        const postData = async () => {
            try {
                const uploadedMedia = await mediaService.upload(media.map(med => med.file))
                const createdProduct = await productService.create({
                    name: product.name,
                    description: product.description,
                    categoryId: 1
                })
                for (let i = 0; i < variants.length; i++) {
                    const v = variants[i]!
                    await variantService.create({
                        name: v.name,
                        sku: v.sku,
                        price: v.price,
                        stock: v.stock,
                        productId: createdProduct.id
                    })
                }
                const listMediaId = uploadedMedia.map(item => item.id)
                for (let i = 0; i < listMediaId.length; i++) {
                    await mediaService.updateById(listMediaId[i], { productId: createdProduct.id })
                }
                pushMessage({ message: "Tạo sản phẩm mới thành công!", noticeType: "normal" })
                setIsSaving(false)
            } catch (error) {
                console.log(error)
                pushMessage({ message: "Có lỗi xảy ra khi lưu sản phẩm", noticeType: "error" })
                setIsSaving(false)
            }
        }
        postData()
    }, [isSaving])

    const onClickSave = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (isSaving) { return }
        if (media.length === 0) {
            pushMessage({ message: "Cần tải lên ít nhất một hình ảnh sản phẩm", noticeType: "error" })
            return
        }
        if (product.name.trim().length <= 5 || product.description.trim().length <= 5) {
            pushMessage({ message: "Tên và mô tả sản phẩm phải dài hơn 5 ký tự", noticeType: "error" })
            return
        }
        if (variants.length <= 0) {
            pushMessage({ message: "Cần thêm ít nhất 1 phân loại sản phẩm", noticeType: "error" })
            return
        }
        setIsSaving(true)
    }, [product, variants, media, isSaving, pushMessage])

    const isInfoValid = product.name.trim().length > 5 && product.description.trim().length > 5
    const isMediaValid = media.length > 0
    const isVariantsValid = variants.length > 0
    const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0)
    const minPrice = variants.length > 0 ? Math.min(...variants.map(v => v.price)) : 0
    const maxPrice = variants.length > 0 ? Math.max(...variants.map(v => v.price)) : 0

    if (isSaving) {
        return (
            <div className="min-h-[75vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
                <Loading />
                <div className="text-center space-y-1">
                    <h2 className="text-lg font-bold text-slate-800">Đang lưu sản phẩm...</h2>
                    <p className="text-xs text-slate-500">Hệ thống đang tải lên hình ảnh và khởi tạo phân loại sản phẩm.</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <NoticeManager noticeList={noticeList} />
            <div className="max-w-6xl mx-auto space-y-6 pb-12">
                {/* Page Header & Breadcrumb */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                    <div className="space-y-1">
                        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
                            <Link href="/manager" className="hover:text-emerald-600 no-underline text-slate-400 transition">
                                Quản lý
                            </Link>
                            <span>/</span>
                            <Link href="/manager/products" className="hover:text-emerald-600 no-underline text-slate-400 transition">
                                Sản phẩm
                            </Link>
                            <span>/</span>
                            <span className="text-slate-700 font-semibold">Thêm mới</span>
                        </nav>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                            Thêm sản phẩm mới
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/manager/products"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition no-underline"
                        >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            <span>Quay lại</span>
                        </Link>
                        <button
                            type="button"
                            onClick={onClickSave}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm shadow-emerald-600/20 transition cursor-pointer"
                        >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            <span>Lưu sản phẩm</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-8 space-y-6">
                        <CreateProductForm />
                        <CreateImageForm />
                        <CreateVariantForm />
                    </div>

                    {/* Right Column: Live Summary & Checklist */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
                        {/* Completion Checklist Card */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
                            <div className="pb-3 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-800">Tiến độ hoàn thiện</h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Hoàn thành đủ 3 bước dưới đây trước khi lưu
                                </p>
                            </div>

                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-3">
                                    <span
                                        className={`mt-0.5 size-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                            isInfoValid
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-slate-100 text-slate-400"
                                        }`}
                                    >
                                        {isInfoValid ? "✓" : "1"}
                                    </span>
                                    <div>
                                        <p className={`font-semibold ${isInfoValid ? "text-slate-800" : "text-slate-500"}`}>
                                            Thông tin cơ bản
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Tên và mô tả dài trên 5 ký tự
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-3">
                                    <span
                                        className={`mt-0.5 size-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                            isMediaValid
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-slate-100 text-slate-400"
                                        }`}
                                    >
                                        {isMediaValid ? "✓" : "2"}
                                    </span>
                                    <div>
                                        <p className={`font-semibold ${isMediaValid ? "text-slate-800" : "text-slate-500"}`}>
                                            Hình ảnh sản phẩm
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Đã chọn {media.length} hình ảnh
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-3">
                                    <span
                                        className={`mt-0.5 size-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                            isVariantsValid
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-slate-100 text-slate-400"
                                        }`}
                                    >
                                        {isVariantsValid ? "✓" : "3"}
                                    </span>
                                    <div>
                                        <p className={`font-semibold ${isVariantsValid ? "text-slate-800" : "text-slate-500"}`}>
                                            Phân loại & Giá bán
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Đã tạo {variants.length} phân loại
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Product Live Preview Summary Card */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
                            <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100">
                                Tóm tắt sản phẩm
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between gap-2">
                                    <span className="text-slate-500">Tên sản phẩm:</span>
                                    <span className="font-semibold text-slate-800 text-right line-clamp-1 max-w-[60%]">
                                        {product.name || "Chưa nhập"}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="text-slate-500">Số lượng ảnh:</span>
                                    <span className="font-semibold text-slate-800">{media.length} ảnh</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="text-slate-500">Số phân loại:</span>
                                    <span className="font-semibold text-slate-800">{variants.length} loại</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="text-slate-500">Tổng tồn kho:</span>
                                    <span className="font-semibold text-emerald-600">{totalStock} sản phẩm</span>
                                </div>
                                <div className="flex justify-between gap-2 pt-2 border-t border-slate-100">
                                    <span className="text-slate-500">Khoảng giá:</span>
                                    <span className="font-bold text-rose-600">
                                        {variants.length === 0
                                            ? "0 ₫"
                                            : minPrice === maxPrice
                                                ? formatPrice(minPrice)
                                                : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClickSave}
                                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm shadow-emerald-600/20 transition cursor-pointer"
                            >
                                Lưu & Đăng sản phẩm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default function NewProductPage() {
    return (
        <CreateProductProvider>
            <CreateProductWrapper />
        </CreateProductProvider>
    )
}

