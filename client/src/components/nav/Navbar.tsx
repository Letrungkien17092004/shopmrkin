import React, { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../../contexts/AuthContext.tsx"

interface Profile {
    id: string,
    email: string,
    account: string,
    username: string,
    picture: string
}

function UserProfile({ profile }: { profile: Profile }) {
    const [isShowMenu, setIsShowMenu] = useState<boolean>(false)

    const toggleMenu = useCallback((e: React.MouseEvent) => {
        setIsShowMenu(!isShowMenu)
    }, [isShowMenu])
    return <>
        <div onClick={toggleMenu} className="navbar__actions__user">
            <img style={{ width: "30px" }} className="image-avatar" src={`${profile?.picture}`} alt="cart-image" />
            {
                isShowMenu ? <>
                    <div className="navbar__actions__user__menu box-shadow-1">
                        <p className="w-full text-base font-semiBold">
                            {profile.username}
                        </p>
                        <div className="dash-dark"></div>
                        <p className="w-full text-base font-semiBold">
                            Tài khoản
                        </p>
                        <p className="w-full text-base font-semiBold">
                            Đăng xuất
                        </p>
                    </div>
                </>
                    : null
            }
        </div>
    </>
}
const demoCartImage = "https://down-vn.img.susercontent.com/file/vn-11134207-820l4-metxmobo5f5wf2@resize_w900_nl.webp"
function Cart() {
    return <>
        <div className="navbar__actions__cart">
            <img src="/public/svg/cart-shopping-solid-full.svg" alt="cart-image" />
            <span className="text-xs font-bold navbar__actions__cart__notify">
                9+
            </span>

            <div className="navbar__actions__cart__list box-shadow-1">
                {/* items */}
                <div className="w-full cart__items">
                    <div className="cart__items__thumbnail pad-right-4px">
                        <img src={`${demoCartImage}`} alt="cart-items" />
                    </div>
                    <div className="cart__items__info">
                        <div className="w-full">
                            <p className="text-xs font-normal">
                                Quạt Cầm Tay Mini DIDOOGLT Màn Hình Led Thông Minh Sạc Nhanh Tốc Độ Gió Siêu Mạnh
                            </p>
                        </div>
                        <div className="w-full">
                            <p className="text-xs font-normal">
                                Tên product, Tên variant
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

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
                            <Cart />
                            {
                                profile
                                    ?
                                    <>
                                        <UserProfile profile={profile} />
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