'use client'

import React, { useEffect, useRef } from "react"
import * as d3 from "d3"
import Plotly from "plotly.js-dist-min"

export default function DashboardCharts() {
    const d3LineRef = useRef(null)
    const plotlyBarRef = useRef(null)
    const plotlyPieRef = useRef(null)

    // D3 LINE CHART
    useEffect(() => {
        const data = [80, 60, 65, 40, 45, 30, 20]
        const width = 300
        const height = 120
        const margin = { top: 10, right: 10, bottom: 20, left: 30 }

        d3.select(d3LineRef.current).selectAll("*").remove()
        const svg = d3.select(d3LineRef.current)
            .append("canvas")
            .attr("width", width)
            .attr("height", height)

        const scaleX = d3.scaleLinear().domain([0, data.length - 1]).range([margin.left, width - margin.right])
        const scaleY = d3.scaleLinear().domain([0, d3.max(data) ?? 0]).range([height - margin.bottom, margin.top])

        const node = svg.node()
        if (!node) return
        const ctx = node.getContext("2d")
        if (!ctx) return
        ctx.beginPath()
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2

        data.forEach((d, i) => {
            const x = scaleX(i)
            const y = scaleY(d)
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        })
        ctx.stroke()
    }, [])

    // PLOTLY BAR CHART
    useEffect(() => {
        if (!plotlyBarRef.current) return
        Plotly.newPlot(
            plotlyBarRef.current,
            [{
                x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                y: [50, 80, 40, 100, 70, 60, 90],
                type: "bar",
            }],
            { margin: { t: 10 } }
        )
    }, [])

    // PLOTLY PIE CHART
    useEffect(() => {
        if (!plotlyPieRef.current) return
        Plotly.newPlot(
            plotlyPieRef.current,
            [{
                labels: ["Mobile", "Desktop", "Tablet"],
                values: [40, 30, 30],
                type: "pie",
            }],
            { margin: { t: 10 } }
        )
    }, [])

    return (
        <div className="w-full h-[80vh] overflow-y-scroll p-6 space-y-8">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-sm text-gray-500">Trực quan dữ liệu thương mại điện tử</p>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    ["Doanh thu hôm nay", "$1,240"],
                    ["Đơn hàng mới", "58"],
                    ["Khách hàng", "214"],
                    ["Sản phẩm bán ra", "431"],
                ].map(([label, value], i) => (
                    <div key={i} className="bg-white p-4 shadow rounded-lg">
                        <p className="text-gray-500 text-sm">{label}</p>
                        <h2 className="text-2xl font-bold">{value}</h2>
                    </div>
                ))}
            </div>

            {/* D3 Line Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Doanh thu 7 ngày (D3.js)</h3>
                <div ref={d3LineRef} className="w-full"></div>
            </div>

            {/* Plotly Bar */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Lượt truy cập theo ngày (Plotly)</h3>
                <div ref={plotlyBarRef} className="w-full h-64"></div>
            </div>

            {/* Plotly Pie */}
            <div className="bg-white p-6 rounded-lg shadow max-w-md">
                <h3 className="text-lg font-semibold mb-4">Tỷ lệ thiết bị truy cập (Plotly)</h3>
                <div ref={plotlyPieRef} className="w-full h-64"></div>
            </div>
        </div>
    )
}
