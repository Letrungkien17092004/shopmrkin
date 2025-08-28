import React, { useCallback, useState } from "react"
import { Outlet, Link } from "react-router-dom"


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

    const tabs = listNameTab.map(tabName=> (
        <div key={tabName} className={selectedTab==tabName ? "cursor-pointer selected-style-1 w-full pad-8px" : "cursor-pointer hover-style w-full pad-8px"}>
            <Link onClick={changeTab(tabName)} to={tabName.toLowerCase()} className="disable-link text-base font-normal">
                {tabName}
            </Link>
        </div>
    ))
    return (<>
        <main className="w-full">
            <div className="grid">
                <div className="row no-gutters">
                    <div className="col l-2">
                        <div className="w-full h-full-vh pad-vertical-12px pad-top-24px box-shadow-1">
                            {/* User info */}
                            <div className="w-full">
                                <div className="flex flex-col flex-center">
                                    <img className="avatar-40px" src="/public/svg/user-regular-full.svg" alt="" />
                                </div>
                                <div className="text-ac text-sm mar-top-8px font-bold">
                                    Admin
                                </div>
                            </div>
                            <div className="dash-dark"></div>

                            {/* Tabs */}
                            <div className="flex flex-col">
                                {tabs}
                            </div>
                            <div className="dash-dark"></div>

                            {/* logout */}
                            <div className="w-full">
                                <button className="button-red text-xs font-normal text-ac">
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col l-10">
                        <Outlet />
                    </div>
                </div>
            </div>
        </main>
    </>)
}