import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "../../contexts/AuthContext.tsx";

interface Props {
    children: React.ReactNode
}

type TabConfig = {
    name: string;
    label: string;
    href: string;
    icon: React.ReactNode;
}

const TABS: TabConfig[] = [
    {
        name: "dashboard",
        label: "Tổng quan",
        href: "/manager/dashboard",
        icon: (
            <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
        ),
    },
    {
        name: "products",
        label: "Sản phẩm",
        href: "/manager/products",
        icon: (
            <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
        ),
    },
    {
        name: "orders",
        label: "Đơn hàng",
        href: "/manager/orders",
        icon: (
            <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
            </svg>
        ),
    },
    {
        name: "chats",
        label: "Tin nhắn",
        href: "/manager/chats",
        icon: (
            <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
        ),
    },
]

export default function ManagerLayout({ children }: Props) {
    const { profile, logout } = useAuthContext()
    const pathname = usePathname()

    const checkActiveTab = (tabName: string): boolean => {
        if (!pathname) return false
        if (tabName === "dashboard" && pathname === "/manager") return true
        const pathSegments = pathname.split("/")
        return pathSegments.some(p => p.toLowerCase() === tabName.toLowerCase())
    }

    if (!profile) {
        return null
    }

    return (
        <main className="w-full min-h-screen flex bg-slate-100/80 text-slate-800">
            {/* Sidebar */}
            <aside className="w-64 shrink-0 hidden md:flex flex-col bg-white border-r border-slate-200/80 sticky top-0 h-screen">
                {/* Brand Logo */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
                    <Link href="/manager" className="flex items-center gap-2.5 no-underline">
                        <div className="size-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
                            K
                        </div>
                        <div>
                            <span className="text-base font-extrabold text-slate-900 block leading-none">
                                ShopMrKin
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                                Admin Portal
                            </span>
                        </div>
                    </Link>
                </div>

                {/* User info */}
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                    <div className="size-10 rounded-full overflow-hidden ring-2 ring-emerald-500/30 shrink-0 bg-slate-200">
                        <img
                            className="size-full object-cover"
                            src={`${profile.picture}`}
                            alt={profile.username}
                        />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">
                            {profile.username}
                        </p>
                        <p className="text-xs text-emerald-600 font-medium capitalize">
                            {profile.role}
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Menu quản trị
                    </p>
                    {TABS.map((tab) => {
                        const active = checkActiveTab(tab.name)
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition no-underline ${
                                    active
                                        ? "bg-emerald-50 text-emerald-700 shadow-2xs"
                                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                                }`}
                            >
                                <span className={active ? "text-emerald-600" : "text-slate-400"}>
                                    {tab.icon}
                                </span>
                                <span>{tab.label}</span>
                            </Link>
                        )
                    })}

                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Lối tắt
                        </p>
                        <Link
                            href="/manager/products/new"
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/70 transition no-underline"
                        >
                            <svg className="size-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span>Thêm sản phẩm mới</span>
                        </Link>
                        <Link
                            href="/"
                            className="mt-1 flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition no-underline"
                        >
                            <svg className="size-5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                            </svg>
                            <span>Xem cửa hàng</span>
                        </Link>
                    </div>
                </nav>

                {/* Logout */}
                <div className="border-t border-slate-100 p-3">
                    <button
                        type="button"
                        onClick={() => {
                            if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
                                logout()
                            }
                        }}
                        className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <section className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-h-screen overflow-y-auto">
                {children}
            </section>
        </main>
    )
}
