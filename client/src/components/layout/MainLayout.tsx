import React from "react";
import Link from "next/link";
import { MainNav } from "../nav/index.tsx"

interface Props {
    children: React.ReactNode
}
export default function MainLayout({ children }: Props) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-800">
            <MainNav />
            <main className="flex-1 w-full">
                {children}
            </main>
            <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-1 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="size-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                                    K
                                </div>
                                <span className="text-xl font-bold text-white">ShopMrKin</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Nền tảng mua sắm trực tuyến uy tín với hàng ngàn sản phẩm công nghệ & thời trang chất lượng cao.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Danh mục nổi bật</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li className="hover:text-emerald-400 cursor-pointer transition">Điện thoại & Tablet</li>
                                <li className="hover:text-emerald-400 cursor-pointer transition">Laptop & PC Gaming</li>
                                <li className="hover:text-emerald-400 cursor-pointer transition">Phụ kiện công nghệ</li>
                                <li className="hover:text-emerald-400 cursor-pointer transition">Thời trang nam nữ</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Hỗ trợ khách hàng</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li className="hover:text-emerald-400 cursor-pointer transition">Hướng dẫn mua hàng</li>
                                <li className="hover:text-emerald-400 cursor-pointer transition">Chính sách bảo hành</li>
                                <li className="hover:text-emerald-400 cursor-pointer transition">Chính sách đổi trả</li>
                                <li className="hover:text-emerald-400 cursor-pointer transition">Câu hỏi thường gặp</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Liên hệ</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li>Hotline: 1900 8888 (8:00 - 21:00)</li>
                                <li>Email: support@shopmrkin.vn</li>
                                <li>Địa chỉ: Hà Nội, Việt Nam</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
                        <p>© {new Date().getFullYear()} ShopMrKin. Bảo lưu mọi quyền.</p>
                        <div className="flex gap-4 mt-2 sm:mt-0">
                            <Link href="/" className="hover:text-slate-300 no-underline text-slate-500">Điều khoản dịch vụ</Link>
                            <Link href="/" className="hover:text-slate-300 no-underline text-slate-500">Chính sách bảo mật</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
