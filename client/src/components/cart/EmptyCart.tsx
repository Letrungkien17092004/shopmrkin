import React from "react";

export default function EmptyCart() {
    return (
        <div className="z-30 absolute right-0 top-[125%] w-80 sm:w-96 rounded-2xl border border-slate-200/80 shadow-xl bg-white p-8 text-center space-y-2">
            <div className="mx-auto size-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            </div>
            <p className="text-sm font-bold text-slate-700">Giỏ hàng của bạn đang trống</p>
            <p className="text-xs text-slate-400">Hãy khám phá và thêm sản phẩm yêu thích vào giỏ hàng nhé!</p>
        </div>
    )
}
