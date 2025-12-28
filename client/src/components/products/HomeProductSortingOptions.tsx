import React from "react"

export default function HomeProductSortingOptions() {
    return (<>
        <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">Sắp xếp theo:</span>

            <div className="relative">
                <select
                    className="
                appearance-none
                px-1 py-1
                rounded-lg
                border border-gray-300
                text-gray-700
                bg-white
                shadow-sm
                focus:outline-none
                focus:ring-1
                focus:ring-blue-500
                focus:border-blue-500
                transition
                cursor-pointer
                pr-10
            "
                    name="list-product-sort-select"
                    id="list-product-sort-select"
                >
                    <option value="default">Mặc định</option>
                    <option value="increment">Giá tăng dần</option>
                    <option value="descrement">Giá giảm dần</option>
                </select>

                {/* icon dropdown */}
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    ▼
                </span>
            </div>
        </div>

    </>)
}