import React from "react"

export default function HomeNavbar() {
    return (<>
        <nav className="navbar">
            <div className="grid">
                <div className="row">
                    {/* logo */}
                    <div className="col c-8 m-3 l-2">
                        <div className="navbar__logo">
                            <span>Shopmrkin</span>
                        </div>
                    </div>
                    {/* menu */}
                    <div className="col c-0 m-7 l-8">
                        <div className="navbar__menu">
                            <div className="navbar__menu-item">
                                <span>Home</span>
                            </div>
                            <div className="navbar__menu-item">
                                <span>Đồ gia dụng</span>
                            </div>
                            <div className="navbar__menu-item">
                                <span>Đồ nội thất</span>
                            </div>
                            <div className="navbar__menu-item">
                                <span>Dụng cụ phòng bếp</span>
                            </div>
                        </div>
                    </div>
                    {/* actions */}
                    <div className="col c-4 m-2 l-2">
                        <div className="navbar__actions">
                            <div className="navbar__actions-cart-icon">
                                <img style={{ width: "20px" }} src="/public/svg/cart-shopping-solid-full.svg" alt="cart-image" />
                            </div>
                            <div className="navbar__actions-user-icon">
                                <img style={{ width: "20px" }} src="/public/svg/user-regular-full.svg" alt="cart-image" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </>)
}