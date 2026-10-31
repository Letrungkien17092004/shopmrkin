import React, { useCallback, useState } from "react";
import { useCreateProduct } from "../../contexts/CreateProductContext.tsx";
import { NoticeManager } from "../notifications/index.tsx"
import { useNoticeManager } from "../../hooks/index.ts"
import { formatPrice } from "../../utils/index.ts";

interface VariantType {
    name: string,
    sku: string,
    price: string,
    stock: string
}

export default function CreateVariantForm() {
    const [formData, setFormData] = useState<VariantType>({
        name: "",
        sku: "",
        price: "",
        stock: ""
    })
    const { variants, addVariant, deleteVariant } = useCreateProduct()
    const { noticeList, pushMessage } = useNoticeManager()

    const createFormDataEventHandler = useCallback((fieldName: keyof VariantType) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation()
            setFormData((prev) => ({
                ...prev,
                [fieldName]: e.target.value
            }))
        }
    }, [])

    // Create Add event handler
    const onAddVariant = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()

        const trimmedSku = formData.sku.trim()
        const trimmedName = formData.name.trim()

        const found = variants.find(v => v.sku === trimmedSku)
        if (found) {
            pushMessage({
                message: "Mã SKU này đã tồn tại trong danh sách",
                noticeType: "error"
            })
            return
        }

        if (trimmedSku.length < 5 || trimmedName.length < 5) {
            pushMessage({
                message: "Mã SKU và tên phân loại phải từ 5 ký tự trở lên",
                noticeType: "error"
            })
            return
        }

        if (trimmedSku.includes(" ")) {
            pushMessage({
                message: "Mã SKU không được chứa khoảng trắng",
                noticeType: "error"
            })
            return
        }

        if (formData.price === "" || formData.stock === "" || Number(formData.price) < 0 || Number(formData.stock) < 0) {
            pushMessage({
                message: "Vui lòng nhập Giá bán và Tồn kho hợp lệ",
                noticeType: "error"
            })
            return
        }

        addVariant({
            name: trimmedName,
            sku: trimmedSku,
            price: Number(formData.price),
            stock: Number(formData.stock),
        })

        // Reset form after adding
        setFormData({
            name: "",
            sku: "",
            price: "",
            stock: ""
        })
    }, [variants, formData, addVariant, pushMessage])

    // Create Delete event handler
    const createDeleteEventHandler = useCallback((sku: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            deleteVariant(sku)
        }
    }, [deleteVariant])

    const totalStock = variants.reduce((acc, item) => acc + (item.stock || 0), 0)

    return (
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            <NoticeManager noticeList={noticeList} />

            {/* Section Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-800">Phân loại sản phẩm (Variants)</h2>
                        <p className="text-xs text-slate-500">
                            Thêm các phiên bản màu sắc, dung lượng hoặc kích cỡ kèm giá bán và tồn kho tương ứng.
                        </p>
                    </div>
                </div>

                {variants.length > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                            {variants.length} phân loại
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                            Tổng kho: {totalStock} SP
                        </span>
                    </div>
                )}
            </div>

            {/* Variant Input Box */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
                    {/* SKU */}
                    <div className="lg:col-span-3 space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                            Mã SKU <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.sku}
                            onChange={createFormDataEventHandler("sku")}
                            placeholder="VD: ip16pm_256_titan"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition font-mono"
                        />
                    </div>

                    {/* Variant Name */}
                    <div className="lg:col-span-3 space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                            Tên phân loại <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={createFormDataEventHandler("name")}
                            placeholder="VD: Bản 256GB - Titan Tự Nhiên"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                        />
                    </div>

                    {/* Price */}
                    <div className="lg:col-span-2 space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                            Giá bán (VNĐ) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min={0}
                                value={formData.price}
                                onChange={createFormDataEventHandler("price")}
                                placeholder="28990000"
                                className="w-full pl-3.5 pr-7 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-xs font-semibold text-slate-400">
                                ₫
                            </span>
                        </div>
                    </div>

                    {/* Stock */}
                    <div className="lg:col-span-2 space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                            Tồn kho <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={formData.stock}
                            onChange={createFormDataEventHandler("stock")}
                            placeholder="100"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                        />
                    </div>

                    {/* Add Button */}
                    <div className="lg:col-span-2">
                        <button
                            type="button"
                            onClick={onAddVariant}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-2xs transition cursor-pointer"
                        >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span>Thêm loại</span>
                        </button>
                    </div>
                </div>
                <p className="text-[11px] text-slate-400">
                    Lưu ý: Mã SKU viết liền không dấu, tối thiểu 5 ký tự (ví dụ: <code className="text-slate-600 font-mono">iphone_air_256</code>).
                </p>
            </div>

            {/* Variants Table / Empty state */}
            {variants.length === 0 ? (
                <div className="py-10 px-4 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 space-y-2">
                    <div className="mx-auto size-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Chưa có phân loại sản phẩm nào</p>
                    <p className="text-xs text-slate-400">
                        Điền thông tin phía trên và nhấn &ldquo;Thêm loại&rdquo; để tạo ít nhất 1 phân loại cho sản phẩm.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <th className="py-3.5 px-4">Mã SKU</th>
                                <th className="py-3.5 px-4">Tên phân loại</th>
                                <th className="py-3.5 px-4">Giá bán</th>
                                <th className="py-3.5 px-4">Tồn kho</th>
                                <th className="py-3.5 px-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {variants.map((v) => (
                                <tr key={v.sku} className="hover:bg-slate-50/80 transition">
                                    <td className="py-3.5 px-4">
                                        <span className="inline-block font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                                            {v.sku}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                                        {v.name}
                                    </td>
                                    <td className="py-3.5 px-4 font-bold text-rose-600">
                                        {formatPrice(v.price)}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                            {v.stock} sản phẩm
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <button
                                            type="button"
                                            onClick={createDeleteEventHandler(v.sku)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                        >
                                            <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}
