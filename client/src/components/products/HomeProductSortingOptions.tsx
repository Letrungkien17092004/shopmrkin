import React from "react"

interface HomeProductSortingOptionsProps {
    sortBy?: string
    onSortChange?: (value: string) => void
}

export default function HomeProductSortingOptions({
    sortBy = "default",
    onSortChange,
}: HomeProductSortingOptionsProps) {
    return (
        <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-medium text-slate-500 whitespace-nowrap">
                Sắp xếp theo:
            </span>

            <div className="relative">
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange?.(e.target.value)}
                    className="appearance-none pl-3.5 pr-9 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition cursor-pointer"
                    name="list-product-sort-select"
                    id="list-product-sort-select"
                >
                    <option value="default">Nổi bật nhất</option>
                    <option value="increment">Giá: Thấp đến Cao</option>
                    <option value="descrement">Giá: Cao đến Thấp</option>
                    <option value="name-asc">Tên: A - Z</option>
                </select>

                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </span>
            </div>
        </div>
    )
}
