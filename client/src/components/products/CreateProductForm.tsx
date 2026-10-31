import React, { useCallback } from "react";
import { useCreateProduct } from "../../contexts/CreateProductContext.tsx";

export default function CreateProductForm() {
    const { product, updateProduct } = useCreateProduct()

    const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateProduct({
            name: e.target.value
        })
    }, [updateProduct])

    const onChangeDescription = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateProduct({
            description: e.target.value
        })
    }, [updateProduct])

    return (
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
            {/* Section Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">Thông tin cơ bản</h2>
                    <p className="text-xs text-slate-500">
                        Nhập tên gọi chính xác và mô tả chi tiết các tính năng nổi bật của sản phẩm.
                    </p>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
                {/* Product Name */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label htmlFor="product-name" className="text-sm font-semibold text-slate-700">
                            Tên sản phẩm <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-xs text-slate-400">
                            {product.name.length}/150 ký tự
                        </span>
                    </div>
                    <input
                        id="product-name"
                        name="name"
                        type="text"
                        maxLength={150}
                        value={product.name}
                        onChange={onChangeName}
                        placeholder="Ví dụ: iPhone 16 Pro Max 256GB | Chính hãng VN/A"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    />
                    <p className="text-[11px] text-slate-400">
                        Tên sản phẩm nên bao gồm thương hiệu, dòng máy và thông số nổi bật (tối thiểu 6 ký tự).
                    </p>
                </div>

                {/* Product Description */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label htmlFor="product-description" className="text-sm font-semibold text-slate-700">
                            Mô tả sản phẩm <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-xs text-slate-400">
                            {product.description.length} ký tự
                        </span>
                    </div>
                    <textarea
                        id="product-description"
                        name="description"
                        rows={6}
                        value={product.description}
                        onChange={onChangeDescription}
                        placeholder="Ví dụ: Thiết kế khung viền Titan siêu nhẹ, màn hình Super Retina XDR sắc nét, chip xử lý thế hệ mới cùng thời lượng pin vượt trội..."
                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-y leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-400">
                        Mô tả chi tiết nguồn gốc, chế độ bảo hành, phụ kiện đi kèm để tăng tỉ lệ chuyển đổi.
                    </p>
                </div>
            </div>
        </section>
    )
}
