import React, { useState } from "react"
import Link from "next/link"
import { useAuthContext } from "../../contexts/AuthContext.tsx"
import { Cart } from "../cart/index.tsx"
import UserProfile from "../user/UserProfile.tsx"

const CATEGORIES = [
    "Điện thoại",
    "Laptop",
    "PC",
    "Máy tính bảng",
    "Thời trang nam",
    "Thời trang nữ",
]

export default function MainNav() {
    const { profile } = useAuthContext()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
            {/* Top announcement bar */}
            <div className="bg-emerald-600 text-white text-xs py-1.5 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <span className="font-medium">
                        🎉 Khuyến mãi mùa lễ hội — Giảm tới 50% & Miễn phí vận chuyển toàn quốc!
                    </span>
                    <div className="hidden sm:flex items-center gap-4 text-emerald-100">
                        <span className="hover:text-white cursor-pointer transition">Trung tâm hỗ trợ</span>
                        <span>•</span>
                        <span className="hover:text-white cursor-pointer transition">Tra cứu đơn hàng</span>
                    </div>
                </div>
            </div>

            {/* Main navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo & Mobile Menu Button */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                            aria-label="Mở menu"
                        >
                            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>

                        <Link href="/" className="flex items-center gap-2 no-underline group">
                            <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:shadow-emerald-200 transition">
                                K
                            </div>
                            <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                ShopMrKin
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Category Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat}
                                href="/"
                                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/70 transition no-underline"
                            >
                                {cat}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions: Cart & Auth */}
                    <div className="flex items-center gap-3">
                        {profile?.role === "administrator" && (
                            <Link
                                href="/manager/products"
                                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition no-underline"
                            >
                                <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                                </svg>
                                Quản lý
                            </Link>
                        )}

                        <div className="flex items-center">
                            <Cart />
                        </div>

                        {profile ? (
                            <UserProfile profile={profile} />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-100 transition no-underline"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/sign-in"
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition no-underline"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile dropdown navigation */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat}
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 no-underline"
                        >
                            {cat}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    )
}
