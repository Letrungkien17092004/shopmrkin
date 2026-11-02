import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { updateCartItem, removeCartItem } from "../../store/cartSlice.ts"
import { AppDispatch } from "../../store/index.ts";
import { CartItem as CartItemType } from "../../types/cart/index.ts";
import { formatPrice } from "../../utils/index.ts"

interface CartItemProps {
    key?: string,
    cartItem: CartItemType
}

const defaultCartImage = "https://down-vn.img.susercontent.com/file/vn-11134207-820l4-metxmobo5f5wf2@resize_w900_nl.webp";

export default function CartItem({ cartItem }: CartItemProps) {
    const dispatch: AppDispatch = useDispatch()

    const decreaseEventHandler = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        const update = async () => {
            if (cartItem.quantity <= 1) {
                await dispatch(removeCartItem({
                    cartId: cartItem.cartId,
                    cartItemId: cartItem.id,
                }))
            } else {
                await dispatch(updateCartItem({
                    cartId: cartItem.cartId,
                    cartItemId: cartItem.id,
                    quantity: cartItem.quantity - 1
                }))
            }
        }
        update().catch(() => {})
    }, [cartItem, dispatch])

    const increaseEventHandler = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        const update = async () => {
            await dispatch(updateCartItem({
                cartId: cartItem.cartId,
                cartItemId: cartItem.id,
                quantity: cartItem.quantity + 1
            }))
        }
        update().catch(() => {})
    }, [cartItem, dispatch])

    return (
        <li className="p-2.5 rounded-xl hover:bg-slate-50 transition select-none">
            <div className="w-full flex items-center gap-3">
                <div className="size-16 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0">
                    <img
                        className="size-full object-contain p-1"
                        src={cartItem.media ? `${cartItem.media.filePath}` : defaultCartImage}
                        alt={cartItem.variant.name}
                    />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                    <p title={cartItem.productName} className="text-xs font-bold text-slate-800 line-clamp-1">
                        {cartItem.productName}
                    </p>
                    <p title={cartItem.variant.name} className="text-[11px] font-medium text-slate-500 truncate">
                        Phân loại: {cartItem.variant.name}
                    </p>
                    <p className="text-xs font-extrabold text-rose-600">
                        {formatPrice(cartItem.variant.price)}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1 shrink-0">
                    <button
                        type="button"
                        onClick={decreaseEventHandler}
                        className="size-6 rounded-lg bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center shadow-2xs transition cursor-pointer"
                        aria-label="Giảm số lượng"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
                            <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <span className="min-w-5 text-center text-xs font-bold text-slate-800">
                        {cartItem.quantity}
                    </span>
                    <button
                        type="button"
                        onClick={increaseEventHandler}
                        className="size-6 rounded-lg bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center shadow-2xs transition cursor-pointer"
                        aria-label="Tăng số lượng"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
                            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </li>
    );
}

