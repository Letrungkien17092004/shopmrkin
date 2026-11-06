import React, { useEffect, useMemo, useState } from "react"
import { ProductService, AuthService } from "../../services/index.ts"
import type { CategoryItem } from "../../services/ProductService.ts"
import { useProductFilter } from "../../contexts/ProductFilterContext.tsx"

const authService = new AuthService()
const productService = new ProductService(authService)

const CONDITIONS = [
    { id: "new", label: "Hàng mới 100%" },
    { id: "likenew", label: "Like New (99%)" },
    { id: "used", label: "Đồ cũ giá tốt" },
]

const PRICE_RANGES = [
    { id: "under-2m", label: "Dưới 2 triệu" },
    { id: "2m-10m", label: "Từ 2 - 10 triệu" },
    { id: "10m-25m", label: "Từ 10 - 25 triệu" },
    { id: "above-25m", label: "Trên 25 triệu" },
]

export default function HomeProductFilter() {
    const { categoryId, changeCategory } = useProductFilter()
    const [categories, setCategories] = useState<CategoryItem[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true)
    const [selectedConditions, setSelectedConditions] = useState<string[]>(["new"])
    const [selectedPrice, setSelectedPrice] = useState<string>("")

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoadingCategories(true)
                const data = await productService.getCategories()
                setCategories(data)
            } catch (err) {
                console.error("Failed to fetch categories:", err)
            } finally {
                setIsLoadingCategories(false)
            }
        }
        fetchCategories()
    }, [])

    const totalProductCount = useMemo(
        () => categories.reduce((sum, c) => sum + (c.productCount || 0), 0),
        [categories]
    )

    const toggleCondition = (id: string) => {
        setSelectedConditions((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const handleReset = () => {
        changeCategory(undefined, undefined)
        setSelectedConditions([])
        setSelectedPrice("")
    }

    return (
        <aside className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-6 sticky top-24">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                    <svg className="size-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                    </svg>
                    <span>Bộ lọc tìm kiếm</span>
                </div>
                <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 cursor-pointer transition"
                >
                    Đặt lại
                </button>
            </div>

            {/* Category section */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Danh mục sản phẩm
                </h4>
                {isLoadingCategories ? (
                    <div className="space-y-2">
                        {[...Array(6)].map((_, idx) => (
                            <div key={idx} className="h-9 bg-slate-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <ul className="space-y-1 max-h-96 overflow-y-auto pr-1">
                        <li>
                            <button
                                type="button"
                                onClick={() => changeCategory(undefined, undefined)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                                    categoryId === undefined
                                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                            >
                                <span>Tất cả sản phẩm</span>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                        categoryId === undefined
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-slate-100 text-slate-500"
                                    }`}
                                >
                                    {totalProductCount}
                                </span>
                            </button>
                        </li>
                        {categories.map((cat) => {
                            const active = categoryId === cat.id
                            return (
                                <li key={cat.id}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            active
                                                ? changeCategory(undefined, undefined)
                                                : changeCategory(cat.id, cat.name)
                                        }
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                                            active
                                                ? "bg-emerald-50 text-emerald-700 font-semibold"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                    >
                                        <span className="text-left truncate pr-2">{cat.name}</span>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                                                active
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-slate-100 text-slate-500"
                                            }`}
                                        >
                                            {cat.productCount}
                                        </span>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>

            {/* Price Range section */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Khoảng giá
                </h4>
                <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                        <label
                            key={range.id}
                            className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-slate-900 cursor-pointer select-none"
                        >
                            <input
                                type="radio"
                                name="price-range"
                                checked={selectedPrice === range.id}
                                onChange={() => setSelectedPrice(range.id)}
                                className="size-4 accent-emerald-600 cursor-pointer"
                            />
                            <span>{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Condition section */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tình trạng sản phẩm
                </h4>
                <div className="space-y-2">
                    {CONDITIONS.map((cond) => (
                        <label
                            key={cond.id}
                            className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-slate-900 cursor-pointer select-none"
                        >
                            <input
                                type="checkbox"
                                checked={selectedConditions.includes(cond.id)}
                                onChange={() => toggleCondition(cond.id)}
                                className="size-4 rounded accent-emerald-600 cursor-pointer"
                            />
                            <span>{cond.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Promo Banner inside Sidebar */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white space-y-2">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                    Ưu đãi thành viên
                </span>
                <p className="text-sm font-bold leading-snug">
                    Giảm thêm 150.000đ cho đơn hàng đầu tiên!
                </p>
                <p className="text-xs text-emerald-100">
                    Nhập mã <span className="font-mono font-bold text-white">MRKINNEW</span> khi thanh toán.
                </p>
            </div>
        </aside>
    )
}
