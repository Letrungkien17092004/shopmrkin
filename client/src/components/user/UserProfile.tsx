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

    const toggleMenuEvent = useCallback(() => {
        setIsShowMenu((prev) => !prev)
    }, [])

    const logoutEvent = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            logout()
        }
    }, [logout])

    return (
        <div onClick={toggleMenuEvent} className="relative z-30">
            <button
                type="button"
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
                <img
                    className="size-8 rounded-full object-cover ring-2 ring-emerald-500/30"
                    src={`${profile?.picture}`}
                    alt={profile.username}
                />
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 max-w-28 truncate pr-1">
                    {profile.username}
                </span>
            </button>

            {isShowMenu && (
                <div className="absolute right-0 top-[115%] w-52 rounded-2xl bg-white border border-slate-200/80 shadow-xl py-2 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-800 truncate">{profile.username}</p>
                        <p className="text-xs text-slate-400 truncate">{profile.email}</p>
                    </div>
                    <ul className="py-1 text-sm text-slate-600">
                        <li className="px-4 py-2 hover:bg-slate-50 hover:text-emerald-600 cursor-pointer transition font-medium">
                            Tài khoản của tôi
                        </li>
                        <li
                            onClick={logoutEvent}
                            className="px-4 py-2 hover:bg-rose-50 text-rose-600 cursor-pointer transition font-semibold"
                        >
                            Đăng xuất
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}

