import React from "react";
import { Cart } from "../../types/cart/index.ts";
import { EmptyCart, ErrorCart, LoadingCart, CartItem } from "./index.tsx"

interface CartItemContainerProps {
    cart: Cart | null,
    status: "idle" | "loading" | "succeeded" | "failed",
    error: string | null
}

function calcTotalPrice(cart: Cart): number {
    const total = cart.items.reduce((acc, currItem) => {
        return acc + (currItem.variant.price * currItem.quantity)
    }, 0)

    return total
}

export default function CartItemContainer({ cart, status }: CartItemContainerProps) {
    if (status === "idle" || status === "loading") {
        return <LoadingCart />
    }

    if (status === "failed") {
        return <ErrorCart />
    }

    if (status === "succeeded") {
        if (!cart) { return null }
        if (cart && cart.items.length <= 0) {
            return <EmptyCart />
        }

        return (
            <div className="z-30 absolute right-0 top-[125%] w-80 sm:w-96 rounded-2xl border border-slate-200/80 shadow-xl bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">Giỏ hàng của bạn</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        {cart.items.length} sản phẩm
                    </span>
                </div>
                <ul className="w-full max-h-80 overflow-y-auto divide-y divide-slate-100 p-2">
                    {cart.items.map(item => (
                        <CartItem
                            key={item.id}
                            cartItem={item}
                        />
                    ))}
                </ul>
                <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Tổng tạm tính:</span>
                        <span className="text-base font-extrabold text-rose-600">
                            {calcTotalPrice(cart).toLocaleString('vi-VN') + ' ₫'}
                        </span>
                    </div>
                    <button
                        type="button"
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-xs transition cursor-pointer"
                    >
                        Tiến hành thanh toán
                    </button>
                </div>
            </div>
        )
    }
}
