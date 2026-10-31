'use client'

import React from "react"
import { MainLayout } from "@/components/layout/index.tsx"
import {
    HomeProductFilter,
    HomeShowProduct,
} from "@/components/products/index.ts"

const FEATURES = [
    {
        title: "Miễn phí vận chuyển",
        desc: "Cho đơn hàng từ 500k",
        icon: (
            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
        ),
    },
    {
        title: "Cam kết chính hãng",
        desc: "Hoàn tiền 200% nếu giả",
        icon: (
            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
        ),
    },
    {
        title: "Đổi trả trong 30 ngày",
        desc: "Thủ tục nhanh gọn, dễ dàng",
        icon: (
            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
        ),
    },
    {
        title: "Hỗ trợ 24/7",
        desc: "Tư vấn tận tâm, chuyên nghiệp",
        icon: (
            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
        ),
    },
]

export default function HomePage() {
    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
                {/* Hero Banner Section */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 text-white shadow-lg">
                    <div className="absolute -right-20 -top-20 size-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
                    <div className="absolute right-1/4 -bottom-24 size-80 rounded-full bg-teal-400/15 blur-3xl pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 p-6 sm:p-10 lg:p-12">
                        <div className="lg:col-span-7 space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                                Siêu Sale Công Nghệ & Thời Trang 2026
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                                Nâng tầm trải nghiệm mua sắm tại{" "}
                                <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                                    ShopMrKin
                                </span>
                            </h1>
                            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                                Khám phá hàng loạt sản phẩm công nghệ đời mới, laptop hiệu năng cao và xu hướng thời trang hiện đại với mức giá ưu đãi nhất hôm nay.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <a
                                    href="#products-section"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-950/50 transition no-underline"
                                >
                                    <span>Mua sắm ngay</span>
                                    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </a>
                                <div className="flex items-center gap-4 px-4 py-2 text-xs text-slate-300">
                                    <div>
                                        <span className="block text-base font-extrabold text-white">10K+</span>
                                        Khách hàng tin dùng
                                    </div>
                                    <div className="h-6 w-px bg-slate-700" />
                                    <div>
                                        <span className="block text-base font-extrabold text-white">4.9/5</span>
                                        Đánh giá hài lòng
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Promo Cards on the right */}
                        <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-2 hover:bg-white/15 transition">
                                <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                                    Hot Deal
                                </span>
                                <h3 className="font-bold text-base">Smartphone & Tablet</h3>
                                <p className="text-xs text-slate-300">Trả góp 0%, thu cũ đổi mới trợ giá tới 3 triệu</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-2 hover:bg-white/15 transition">
                                <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300">
                                    Mới về
                                </span>
                                <h3 className="font-bold text-base">Laptop & PC Gaming</h3>
                                <p className="text-xs text-slate-300">Cấu hình cực khủng, tặng kèm bộ quà gaming</p>
                            </div>
                            <div className="col-span-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-md border border-emerald-400/30 rounded-2xl p-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-xs text-emerald-300 font-semibold">Flash Sale mỗi ngày</span>
                                    <h3 className="font-bold text-base">Săn voucher giảm tới 500.000đ</h3>
                                </div>
                                <span className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs shrink-0">
                                    12:00 & 20:00
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Value Proposition Strip */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {FEATURES.map((feat) => (
                        <div
                            key={feat.title}
                            className="flex items-center gap-3.5 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs"
                        >
                            <div className="size-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                {feat.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">{feat.title}</h3>
                                <p className="text-xs text-slate-500">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Main Content: Sidebar Filter + Product Listing */}
                <section id="products-section" className="w-full pt-2">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-3">
                            <HomeProductFilter />
                        </div>
                        <div className="col-span-12 lg:col-span-9">
                            <HomeShowProduct />
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    )
}

