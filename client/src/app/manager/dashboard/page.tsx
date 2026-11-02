'use client'

import React from "react"
import dynamic from "next/dynamic"
import Loading from "@/components/waiter/Loading.tsx"

const D3PlotlyDashboard = dynamic(
    () => import("./DashboardCharts.tsx"),
    { ssr: false, loading: () => <div className="w-full h-[80vh] flex items-center justify-center"><Loading label="Đang tải bảng điều khiển..." /></div> }
)

export default function DashboardPage() {
    return <D3PlotlyDashboard />
}

