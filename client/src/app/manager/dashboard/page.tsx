'use client'

import React, { useEffect, useRef } from "react"
import dynamic from "next/dynamic"

const D3PlotlyDashboard = dynamic(
    () => import("./DashboardCharts.tsx"),
    { ssr: false, loading: () => <div className="w-full h-[80vh] flex items-center justify-center">Loading...</div> }
)

export default function DashboardPage() {
    return <D3PlotlyDashboard />
}
