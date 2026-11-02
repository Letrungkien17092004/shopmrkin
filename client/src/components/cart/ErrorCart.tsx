import React from "react";

export default function ErrorCart() {
    return (
        <div className="z-30 absolute right-0 top-[125%] w-80 sm:w-96 rounded-2xl border border-rose-200 shadow-xl bg-white p-8 text-center space-y-2">
            <div className="mx-auto size-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
            </div>
            <p className="text-sm font-bold text-slate-800">Không thể tải giỏ hàng</p>
            <p className="text-xs text-slate-500">Đã có lỗi xảy ra. Vui lòng thử lại sau ít phút.</p>
        </div>
    )
}
