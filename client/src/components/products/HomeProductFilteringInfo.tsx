import React, { useState } from "react";
import { useProductFilter } from "../../contexts/ProductFilterContext.tsx";

const INITIAL_TAGS = [
    "Chính hãng 100%",
    "Còn hàng",
    "Giao nhanh 2h",
];

export default function HomeProductFilteringInfo() {
    const [tags, setTags] = useState<string[]>(INITIAL_TAGS);
    const { categoryId, categoryName, changeCategory } = useProductFilter();

    if (tags.length === 0 && !categoryId) return null;

    const removeTag = (tagToRemove: string) => {
        setTags((prev) => prev.filter((t) => t !== tagToRemove));
    };

    const clearAll = () => {
        setTags([]);
        changeCategory(undefined, undefined);
    };

    return (
        <section className="mt-3 w-full">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 mr-1">
                    Đang lọc theo:
                </span>

                {categoryId !== undefined && categoryName && (
                    <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white border border-emerald-600">
                        <span>Danh mục: {categoryName}</span>
                        <button
                            type="button"
                            onClick={() => changeCategory(undefined, undefined)}
                            className="size-4 rounded-full inline-flex items-center justify-center hover:bg-emerald-700 text-white transition cursor-pointer"
                            aria-label={`Xóa lọc danh mục ${categoryName}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3">
                                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                            </svg>
                        </button>
                    </span>
                )}

                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                    >
                        <span>{tag}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="size-4 rounded-full inline-flex items-center justify-center hover:bg-emerald-200/70 text-emerald-600 transition cursor-pointer"
                            aria-label={`Xóa bộ lọc ${tag}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3">
                                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                            </svg>
                        </button>
                    </span>
                ))}

                <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline ml-1 cursor-pointer transition"
                >
                    Xóa tất cả
                </button>
            </div>
        </section>
    )
}
