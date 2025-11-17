import React, { useCallback, useState } from "react"
import { Outlet, Link } from "react-router-dom"
import AuthService from "../../services/AuthService.ts"

const authService = new AuthService()

export default function Manager() {
    type TabNames = "" | "Dashboard" | "Products" | "Orders" | "Delivery" | "Customer"
    const listNameTab: TabNames[] = ["Dashboard", "Products", "Orders", "Delivery", "Customer"]
    const [selectedTab, setSelectedTab] = useState<TabNames>("")

    const changeTab = useCallback((tabNames: TabNames) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            setSelectedTab(tabNames)
        }
    }, [])

    const tabs = listNameTab.map(tabName => (
        <li key={tabName} className={selectedTab == tabName ? "cursor-pointer w-full p-1 text-green-400" : "cursor-pointer w-full p-1"}>
            <Link onClick={changeTab(tabName)} to={tabName.toLowerCase()} className="block size-full text-base font-semibold">
                {tabName}
            </Link>
        </li>
    ))
    return (<>
        <main className="w-full grid grid-cols-12 p-6">
            <div className="col-span-2">
                <div className="w-full h-[90vh] rounded shadow-2xl p-2">
                    {/* User info */}
                    <div className="w-full">
                        <div className="size-10 mx-auto rounded-full overflow-hidden shadow-2xl">
                            <img className="size-full " src={`${authService.getProfile()?.picture}`} />
                        </div>
                        <p className="text-base font-semibold mt-2 text-center">
                            {
                                authService.getProfile()?.username
                            }
                        </p>
                    </div>
                    <div className="border border-orange-400"></div>

                    {/* Tabs */}
                    <ul className="w-full">
                        {tabs}
                    </ul>
                    {/* logout */}
                    <div className="w-full">
                        <button className="underline pl-1 pr-2 cursor-pointer py-1 text-xs font-normal text-red-500">
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-span-10">
                <Outlet />
            </div>
        </main>
    </>)
}