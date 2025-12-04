import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../store/cartSlice.ts";
import { RootState, AppDispatch } from "../../store/index.ts";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { CartItemContainer } from "./index.ts"


export default function Cart() {
    const { profile } = useAuthContext()
    const { cart, status, error } = useSelector((state: RootState) => state.cart)
    const [toggleContainer, setToggleContainer] = useState<boolean>(false)
    const [numberNotice, setNumberNotice] = useState<number | undefined>(undefined)
    const dispatch: AppDispatch = useDispatch()

    useEffect(() => {
        if (!profile) { return }
        const fetch = async () => {
            try {
                await dispatch(fetchCart(profile.cartId))
            } catch (error) {
                console.log(error)
            }
        }
        fetch()
    }, [profile])

    useEffect(() => {
        if (!cart) { return }
        setNumberNotice(cart.items.length)
    }, [cart])

    const toggleContainerEvent = useCallback((e: React.MouseEvent) => {
        setToggleContainer((prev) => !prev)
    }, [])
    return <>
        <div className="relative mr-6">

            {toggleContainer && (<CartItemContainer cart={cart} status={status} error={error} />)}

            <div onClick={toggleContainerEvent} className="relative w-full max-w-min cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>

                {
                    numberNotice
                        ?
                        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-1 text-xs font-bold text-white shadow-md ring-1 ring-white select-none">
                            {numberNotice}
                        </span>
                        : null
                }
            </div>
        </div>
    </>
}