import React from "react";
import Link from "next/link";
import { formatPrice } from "../../utils/index.ts";

type Props = {
    listProduct: {
        id: string,
        product_code: number,
        name: string,
        imageURL: string,
        minPrice?: number | null,
        maxPrice?: number | null,
        stock: number
    }[],
    createDeleteEventHandler: (id: string) => (e: React.MouseEvent) => void
}

export default function ProductTable({ listProduct, createDeleteEventHandler }: Props) {
    if (listProduct.length === 0) {
        return (
            <div className="py-12 px-4 text-center space-y-3">
                <div className="mx-auto size-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>
                </div>
                <p className="text-sm font-bold text-slate-700">Chưa có sản phẩm nào</p>
                <p className="text-xs text-slate-400">Hãy nhấn nút &ldquo;Thêm sản phẩm mới&rdquo; để bắt đầu đăng bán.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-4">Mã SP</th>
                        <th className="py-3.5 px-4">Sản phẩm</th>
                        <th className="py-3.5 px-4">Khoảng giá</th>
                        <th className="py-3.5 px-4">Tồn kho</th>
                        <th className="py-3.5 px-4 text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                    {listProduct.map((p) => {
                        const renderPrice = () => {
                            if (!p.minPrice && !p.maxPrice) {
                                return <span className="text-xs text-slate-400 italic">Chưa cập nhật</span>;
                            }
                            if (p.minPrice === p.maxPrice || (!p.minPrice && p.maxPrice)) {
                                return formatPrice(p.maxPrice || p.minPrice || 0);
                            }
                            return `${formatPrice(p.minPrice || 0)} - ${formatPrice(p.maxPrice || 0)}`;
                        };

                        return (
                            <tr key={p.id} className="hover:bg-slate-50/80 transition">
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                    <span className="inline-block font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                                        #{p.product_code}
                                    </span>
                                </td>
                                <td className="py-3.5 px-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="size-12 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0">
                                            <img
                                                src={p.imageURL}
                                                alt={p.name}
                                                className="size-full object-contain p-1"
                                            />
                                        </div>
                                        <span className="font-semibold text-slate-800 line-clamp-2 max-w-md">
                                            {p.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3.5 px-4 whitespace-nowrap font-bold text-rose-600">
                                    {renderPrice()}
                                </td>
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            p.stock >= 10
                                                ? "bg-emerald-50 text-emerald-700"
                                                : p.stock > 0
                                                    ? "bg-amber-50 text-amber-700"
                                                    : "bg-rose-50 text-rose-700"
                                        }`}
                                    >
                                        <span
                                            className={`size-1.5 rounded-full ${
                                                p.stock >= 10
                                                    ? "bg-emerald-500"
                                                    : p.stock > 0
                                                        ? "bg-amber-500"
                                                        : "bg-rose-500"
                                            }`}
                                        />
                                        {p.stock} SP
                                    </span>
                                </td>
                                <td className="py-3.5 px-4 whitespace-nowrap text-right">
                                    <div className="inline-flex items-center justify-end gap-2">
                                        <Link
                                            href={`/manager/products/${p.id}`}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition no-underline"
                                        >
                                            Chi tiết
                                        </Link>
                                        <Link
                                            href={`/manager/products/${p.id}?edit=true`}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition no-underline"
                                        >
                                            Chỉnh sửa
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={createDeleteEventHandler(p.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
