import React from "react";
import Loading from "../waiter/Loading.tsx";

export default function LoadingCart() {
    return (
        <div className="z-30 absolute right-0 top-[125%] w-80 sm:w-96 rounded-2xl border border-slate-200/80 shadow-xl bg-white p-8">
            <Loading label="Đang tải giỏ hàng..." size="sm" />
        </div>
    )
}
