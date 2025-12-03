import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { updateCartItem, removeCartItem } from "../../store/cartSlice.ts"
import { AppDispatch } from "../../store/index.ts";
import { CartItem as CartItemType } from "../../types/index.ts";
import { formatPrice } from "../../utils/index.ts"

interface CartItemProps {
    key: string,
    cartItem: CartItemType
}

const defaultCartImage = "https://down-vn.img.susercontent.com/file/vn-11134207-820l4-metxmobo5f5wf2@resize_w900_nl.webp";

export default function CartItem({ key, cartItem }: CartItemProps) {
    const dispatch: AppDispatch = useDispatch()

    const decreaseEventHandler = useCallback((e: React.MouseEvent) => {
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

        update()
            .then(() => {
                console.log("decreate item successful")
            })
            .catch((err) => {
                console.error("decreate error")
            })
    }, [cartItem])

    const increaseEventHandler = useCallback((e: React.MouseEvent) => {
        const update = async () => {
            await dispatch(updateCartItem({
                cartId: cartItem.cartId,
                cartItemId: cartItem.id,
                quantity: cartItem.quantity + 1
            }))
        }

        update()
            .then(() => {
                console.log("decreate item successful")
            })
            .catch((err) => {
                console.error("decreate error")
            })
    }, [cartItem])
    return (
        <li key={key} className="p-2 hover:bg-gray-100 cursor-pointer select-none">
            <div className="w-full flex">
                <div className="size-20">
                    {
                        cartItem.media
                            ? <img className="w-full h-full object-contain aspect-square" src={`${cartItem.media.hostname}${cartItem.media.filePath}`} alt={cartItem.variant.name} />
                            : <img className="w-full h-full object-contain aspect-square" src={defaultCartImage} alt={cartItem.variant.name} />
                    }

                </div>
                <div className="pl-2 w-[60%]">
                    <p title="product name" className="text-sm font-semibold line-clamp-2 text-start">
                        {cartItem.productName}
                    </p>

                    <p title="variant name" className="text-sm font-light line-clamp-2 text-start truncate">
                        {cartItem.variant.name}
                    </p>

                    <p className="text-sm font-semibold line-clamp-2 text-start truncate text-orange-500">
                        {formatPrice(cartItem.variant.price)}
                    </p>
                </div>
                <div className="ml-2 grow flex justify-center items-center gap-x-3">
                    <div onClick={decreaseEventHandler} className="cursor-pointer p-1 hover:scale-130 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                            <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="text-base rounded-full font-semibold text-orange-500">
                        {cartItem.quantity}
                    </div>
                    <div onClick={increaseEventHandler} className="cursor-pointer p-1 hover:scale-130 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </li>
    );
}
