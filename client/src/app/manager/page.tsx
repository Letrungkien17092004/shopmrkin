'use client'

import React from "react"
import dynamic from "next/dynamic"

const D3PlotlyDashboard = dynamic(
    () => import("./dashboard/DashboardCharts.tsx"),
    { ssr: false, loading: () => <div className="w-full h-[80vh] flex items-center justify-center">Loading...</div> }
)

export default function ManagerPage() {
    return <D3PlotlyDashboard />
}
