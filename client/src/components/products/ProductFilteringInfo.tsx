import React from "react";

export default function ProductFilteringInfo() {
    return (
        <section className="mt-2 w-full">
            <div className="flex flex-wrap items-center justify-start gap-1">
                {/* label */}
                <span className="text-base font-semibold mr-4 truncate">Áp dụng lọc:</span>

                <div className="relative overflow-hidden p-1 pr-5 bg-green-600 text-sm rounded text-white font-bold">
                    <span>Giá từ 500k - 2tr</span>
                    <div className="absolute inset-y-0 right-0 ml-1 h-full bg-red-500 cursor-pointer">
                        <div className="w-full h-full flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="relative overflow-hidden p-1 pr-5 bg-green-600 text-sm rounded text-white font-bold">
                    <span>Còn hàng</span>
                    <div className="absolute inset-y-0 right-0 ml-1 h-full bg-red-500 cursor-pointer">
                        <div className="w-full h-full flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="relative overflow-hidden p-1 pr-5 bg-green-600 text-sm rounded text-white font-bold">
                    <span>Bán chạy</span>
                    <div className="absolute inset-y-0 right-0 ml-1 h-full bg-red-500 cursor-pointer">
                        <div className="w-full h-full flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="relative overflow-hidden p-1 pr-5 bg-green-600 text-sm rounded text-white font-bold">
                    <span>Bán chạy</span>
                    <div className="absolute inset-y-0 right-0 ml-1 h-full bg-red-500 cursor-pointer">
                        <div className="w-full h-full flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="p-1 cursor-pointer bg-red-600 text-sm rounded text-white">
                    <span>Xóa tất cả</span>
                </div>
            </div>
        </section>
    )
}