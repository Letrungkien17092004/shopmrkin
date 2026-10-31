import React from "react";
import { formatPrice } from "../../utils/index.ts"

interface ProductCardProps {
    imgURL: string
    discount: number,
    starPoint: number,
    name: string,
    price?: number | null
}

export default function ProductCard({ imgURL, discount, starPoint, name, price = 0 }: ProductCardProps) {
    const finalPrice = discount > 0 ? (price || 0) * ((100 - discount) / 100) : (price || 0);

    return (
        <div className="group relative flex flex-col w-full h-full bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300/80 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            {/* Image Container */}
            <div className="relative w-full pt-[100%] bg-slate-100 overflow-hidden">
                <div
                    style={{ backgroundImage: `url(${imgURL})` }}
                    className="absolute inset-0 bg-center bg-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Discount Badge */}
                {discount > 0 && (
                    <div className="absolute left-3 top-3 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        -{discount}%
                    </div>
                )}

                {/* Authentic / In-stock badge */}
                <div className="absolute right-3 top-3 bg-white/90 backdrop-blur-xs text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-xs border border-emerald-100">
                    Chính hãng
                </div>
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between gap-2.5">
                <div className="space-y-1.5">
                    {/* Rating row */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-0.5 text-amber-400">
                            {[...Array(5)].map((_, idx) => (
                                <svg
                                    key={idx}
                                    className={`size-3.5 ${idx < Math.round(starPoint) ? "fill-amber-400" : "fill-slate-200"}`}
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="ml-1 font-medium text-slate-600">{starPoint.toFixed(1)}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">Đã bán 100+</span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2 min-h-[2.5rem] leading-snug">
                        {name}
                    </h3>
                </div>

                {/* Price & Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                        <span className="text-base sm:text-lg font-bold text-rose-600 tracking-tight">
                            {formatPrice(finalPrice)}
                        </span>
                        {discount > 0 && (
                            <span className="text-xs text-slate-400 line-through">
                                {formatPrice(price || 0)}
                            </span>
                        )}
                    </div>

                    <div
                        className="size-9 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs shrink-0"
                        title="Xem chi tiết sản phẩm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}
