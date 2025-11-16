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
    console.log(profile)
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
        <div className="navbar__actions__cart">
            <img src="/public/svg/cart-shopping-solid-full.svg" alt="cart-image" />
            <span className="text-xs font-bold navbar__actions__cart__notify">
                {totalCount > 0 ? totalCount : "0"}
            </span>

            <div className="navbar__actions__cart__list box-shadow-1">
                {/* Render items from redux store */}
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
            </div>
        </div>
    </>
}