import React, { useCallback, useState } from "react"
import { useAuthContext } from "../../contexts/AuthContext.tsx"

interface Profile {
    id: string,
    email: string,
    account: string,
    username: string,
    picture: string
}

export default function UserProfile({ profile }: { profile: Profile }) {
    const [isShowMenu, setIsShowMenu] = useState<boolean>(false)
    const { logout } = useAuthContext()

    const toggleMenuEvent = useCallback((e: React.MouseEvent) => {
        setIsShowMenu(!isShowMenu)
    }, [isShowMenu])

    const logoutEvent = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (window.confirm("Bạn có chắc chắn muốn đăng suất?")) {
            logout()
        }
    }, [])

    return <>
        <div onClick={toggleMenuEvent} className="relative z-9999">
            <img className="size-7 cursor-pointer rounded-full shadow-2xl" src={`${profile?.picture}`} alt="cart-image" />
            {
                isShowMenu ? <>
                    <ul className="absolute w-36 top-[120%] right-0 rounded bg-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                        <li className="text-base text-center cursor-pointer hover:text-green-500">
                            {profile.username}
                        </li>
                        <li className="text-base text-center cursor-pointer hover:text-green-500">
                            Tài khoản
                        </li>
                        <li onClick={logoutEvent} className="text-base text-center cursor-pointer hover:text-green-500">
                            Đăng xuất
                        </li>
                    </ul>
                </>
                    : null
            }
        </div>
    </>
}
