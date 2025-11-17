import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeCartItem, selectCartItems } from "../../store/cartSlice.ts";
import AuthService from "../../services/AuthService.ts";

const authService = new AuthService()
const demoCartImage = "https://down-vn.img.susercontent.com/file/vn-11134207-820l4-metxmobo5f5wf2@resize_w900_nl.webp";

type CartItemProps = {
    image?: string;
    name: string;
    price: number | string;
}

function formatPrice(value: number | string) {
    if (typeof value === 'number') return value.toLocaleString('vi-VN') + ' đ';
    return value;
}

function CartItem({ image, name, price }: CartItemProps) {
    return (
        <div className="w-full cart__items">
            <div className="cart__items__thumbnail pad-right-4px">
                <img src={image ?? demoCartImage} alt={name} />
            </div>
            <div className="cart__items__info">
                <div className="w-full">
                    <p className="text-xs font-normal">{name}</p>
                </div>
                <div className="w-full">
                    <p className="text-xs font-bold">{formatPrice(price)}</p>
                </div>
            </div>
            <div className="cart__items__actions" />
        </div>
    );
}



export default function Cart() {
    const dispatch = useDispatch<any>();

    // determine cartId: prefer explicit localStorage 'cartId', else try profile.id
    const profile = authService.getProfile();
    const cartId = null

    useEffect(() => {
        if (cartId) {
            dispatch(fetchCart(cartId));
        }
    }, [cartId, dispatch]);

    const items = useSelector(selectCartItems);
    const totalCount = useMemo(() => items.reduce((s: number, it: any) => s + (it.quantity || 1), 0), [items]);

    const handleRemove = (cartItemId: string) => {
        if (!cartId) return;
        dispatch(removeCartItem({ cartId, cartItemId }));
    }

    return <>
        <div className="relative mr-6">
            {/* if cart is empty */}
            {/* <div className="z-1 absolute right-0 top-[120%] w-md h-48 shadow-[0_4px_12px_rgba(0,0,0,0.3)] rounded-sm bg-white">
                <div className="w-full h-full flex justify-center items-center">
                    Giỏ hàng trống!
                </div>
            </div> */}

            {/* <div className="z-1 absolute right-0 top-[120%] w-lg max-h-82 shadow-[0_4px_12px_rgba(0,0,0,0.3)] rounded-sm bg-white">
                <ul className="w-full p-2">
                    <li className="p-2">
                        <div className="w-full flex">
                            <div className="size-20">
                                <img className="w-full h-full object-contain aspect-square" src="https://i.pinimg.com/736x/60/6f/91/606f9172ce8bb088841a27dc0f903f33.jpg" alt="" />
                            </div>
                            <div className="pl-2 w-[60%]">
                                <p title="product name" className="text-sm font-semibold line-clamp-2 text-justify">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam perspiciatis officia minus assumenda saepe qui et fugiat repellendus. Ducimus ipsam cum fuga accusantium. Doloremque voluptates eius numquam. Molestiae, laudantium id!
                                </p>

                                <p title="variant name" className="text-sm font-light line-clamp-2 text-start truncate">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                </p>

                                <p className="text-sm font-semibold line-clamp-2 text-start truncate text-orange-500">
                                    99 000đ
                                </p>
                            </div>
                            <div className="ml-2 grow flex justify-center items-center gap-x-3">
                                <div className="cursor-pointer p-1 hover:scale-130 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                        <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="text-base rounded-full font-semibold text-orange-500">
                                    10
                                </div>
                                <div className="cursor-pointer p-1 hover:scale-130 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div> */}

            <div className="relative w-full max-w-min">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>

                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-1 text-xs font-bold text-white shadow-md ring-1 ring-white">
                    {totalCount > 0 ? totalCount : "0"}
                </span>
            </div>

            {/* <div className="navbar__actions__cart__list box-shadow-1">
                Render items from redux store
                {items.length === 0 && (
                    <div className="p-2 text-xs">Your cart is empty</div>
                )}

                {items.map((it: any) => (
                    <div key={it.id} className="w-full cart__items">
                        <CartItem
                            image={it.productImage ?? demoCartImage}
                            name={it.productName ?? "Unnamed product"}
                            price={it.price ?? 0}
                        />
                        <div className="cart__items__actions">
                            <button className="text-xs text-red-600" onClick={() => handleRemove(it.id)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div> */}
        </div>
    </>
}