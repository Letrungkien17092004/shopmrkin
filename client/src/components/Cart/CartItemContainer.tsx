import React from "react";
import { Cart } from "../../types/index.ts";
import { EmptyCart, ErrorCart, LoadingCart, CartItem } from "./index.ts"

interface CartItemContainerProps {
    cart: Cart | null,
    status: "idle" | "loading" | "succeeded" | "failed",
    error: string | null
}

function calcTotalPrice(cart: Cart): number {
    let total = cart.items.reduce((acc, currItem) => {
        return acc + (currItem.variant.price * currItem.quantity)
    }, 0)

    return total
}

export default function CartItemContainer({ cart, status, error }: CartItemContainerProps) {
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

        return <>
            <div className="z-1 absolute right-0 top-[120%] w-lg shadow-[0_4px_12px_rgba(0,0,0,0.3)] rounded-sm bg-white">
                <ul className="w-full max-h-80 overflow-y-scroll p-2">
                    {
                        cart.items.map(item => (
                            <CartItem
                                key={item.id}
                                cartItem={item}
                            />
                        ))
                    }
                </ul>
                <div className="p-2">
                    <h3 className="p-1 text-end font-semibold text-orange-500">
                        Tổng: {calcTotalPrice(cart).toLocaleString('vi-VN') + ' đ'}
                    </h3>
                    <div className="p-1 flex justify-center">
                        <span className="p-1 bg-orange-500 text-white rounded hover:brightness-90  cursor-pointer">
                            Thanh toán
                        </span>
                    </div>
                </div>
            </div>
        </>
    }
}