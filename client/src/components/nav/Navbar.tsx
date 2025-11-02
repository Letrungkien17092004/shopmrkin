import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../../contexts/AuthContext.tsx"
export default function Navbar() {
    const { profile } = useAuthContext()
    return (<>
        <nav className="navbar">
            <div className="grid">
                <div className="row">
                    {/* logo */}
                    <div className="col c-8 m-3 l-2">
                        <div className="navbar__logo">
                            <Link className="disable-link" to="/">Shopmrkin</Link>
                        </div>
                    </div>
                    {/* menu */}
                    <div className="col c-0 m-7 l-7">
                        <div className="navbar__menu">
                            <div className="navbar__menu-item">
                                <span>Home</span>
                            </div>
                            <div className="navbar__menu-item">
                                <span>Thời trang nam</span>
                            </div>
                            <div className="navbar__menu-item">
                                <span>Thời trang nữ</span>
                            </div>
                            <div className="navbar__menu-item">
                                <span>Phụ kiện nam nữ</span>
                            </div>
                        </div>
                    </div>
                    {/* actions */}
                    <div className="col c-4 m-2 l-3">
                        <div className="navbar__actions">
                            {
                                profile
                                    ?
                                    <>
                                        <div className="navbar__actions-cart-icon">
                                            <img style={{ width: "20px" }} src="/public/svg/cart-shopping-solid-full.svg" alt="cart-image" />
                                        </div>
                                        <div className="navbar__actions-user-icon">
                                            <img style={{ width: "30px" }} className="image-avatar" src={`${profile?.picture}`} alt="cart-image" />
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="navbar__actions__items">
                                            <Link className="disable-link text-base font-semibold text-hover-highlight" to="/login">Đăng nhập</Link>
                                        </div>

                                        <div className="navbar__actions__items">
                                            <Link className="disable-link text-base font-semibold text-hover-highlight" to="/register">Đăng ký</Link>
                                        </div>
                                    </>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </>)
}