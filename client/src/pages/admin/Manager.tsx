import React, { useCallback, useState } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import AuthService from "../../services/AuthService.ts"

const authService = new AuthService()

export default function Manager() {
    type TabNames = "Dashboard" | "Products" | "Orders" | "Delivery" | "Customer"

    const listNameTab: TabNames[] = [
        "Dashboard",
        "Products",
        "Orders",
        "Delivery",
        "Customer",
    ]

    const location = useLocation()

    const getActiveTab = (): TabNames | "" => {
        const path = location.pathname.split("/").pop()
        if (!path) return ""

        return listNameTab.find(
            tab => tab.toLowerCase() === path.toLowerCase()
        ) ?? ""
    }
    return (
        <>
            <main className="w-full min-h-screen grid grid-cols-12 bg-slate-100">
                {/* Sidebar */}
                <aside className="col-span-2">
                    <div className="flex h-screen flex-col bg-white border-r border-slate-200">

                        {/* User info */}
                        <div className="flex flex-col items-center gap-3 py-6 border-b border-slate-200">
                            <div className="size-12 rounded-full overflow-hidden ring-2 ring-emerald-500">
                                <img
                                    className="size-full object-cover"
                                    src={`${authService.getProfile()?.picture}`}
                                    alt="avatar"
                                />
                            </div>
                            <p className="text-sm font-semibold text-slate-700">
                                {authService.getProfile()?.username}
                            </p>
                        </div>

                        {/* Tabs */}
                        <nav className="flex-1 py-4">
                            <ul className="flex flex-col gap-1">
                                {listNameTab.map(tabName => {
                                    const active = getActiveTab() === tabName
                                    return (
                                        <li key={tabName}>
                                            <Link
                                                to={tabName.toLowerCase()}
                                                className={`
                                                relative flex items-center px-6 py-2.5 text-sm font-medium transition
                                                ${active
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
                                            `}
                                            >
                                                {/* Active indicator */}
                                                {active && (
                                                    <span className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />
                                                )}

                                                {tabName}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </nav>

                        {/* Logout */}
                        <div className="border-t border-slate-200 p-4">
                            <button className="w-full rounded-md px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition">
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <section className="col-span-10 bg-slate-50 p-6">
                    <Outlet />
                </section>
            </main>
        </>
    )

}