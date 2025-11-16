import React, { useCallback, useState } from "react"

interface Profile {
    id: string,
    email: string,
    account: string,
    username: string,
    picture: string
}

export default function UserProfile({ profile }: { profile: Profile }) {
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
