import React, { useCallback, useState } from "react";

interface Image {
    url: string
}

interface ProductImageSliderProps {
    images: Image[]
}

const FALLBACK_IMAGE = "https://i.pinimg.com/1200x/fd/3d/8e/fd3d8e2a1dd4f09b4170d31e26913bab.jpg";

export default function ProductImageSlider({ images }: ProductImageSliderProps) {
    const safeImages = images && images.length > 0 ? images : [{ url: FALLBACK_IMAGE }];
    const totalImage = safeImages.length;
    const [currentIdx, setCurrentIdx] = useState<number>(0);

    const activeIdx = currentIdx < totalImage ? currentIdx : 0;

    const goToNext = useCallback((event: React.MouseEvent) => {
        event.stopPropagation();
        setCurrentIdx((prev) => (prev >= totalImage - 1 ? 0 : prev + 1));
    }, [totalImage]);

    const goToPrevious = useCallback((event: React.MouseEvent) => {
        event.stopPropagation();
        setCurrentIdx((prev) => (prev <= 0 ? totalImage - 1 : prev - 1));
    }, [totalImage]);

    const setByItem = useCallback((index: number) => {
        return (event: React.MouseEvent) => {
            event.stopPropagation();
            setCurrentIdx(index);
        };
    }, []);

    return (
        <section className="w-full space-y-3.5 select-none">
            {/* Main Image Viewer */}
            <div className="group relative w-full pt-[100%] rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                <img
                    className="absolute inset-0 size-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-103"
                    src={safeImages[activeIdx]?.url}
                    alt={`Hình sản phẩm ${activeIdx + 1}`}
                />

                {/* Image counter badge */}
                {totalImage > 1 && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-xs text-white text-xs font-semibold">
                        {activeIdx + 1} / {totalImage}
                    </div>
                )}

                {/* Navigation Arrows */}
                {totalImage > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={goToPrevious}
                            aria-label="Ảnh trước"
                            className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-emerald-600 border border-slate-200/80 shadow-md flex items-center justify-center transition cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={goToNext}
                            aria-label="Ảnh tiếp theo"
                            className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-emerald-600 border border-slate-200/80 shadow-md flex items-center justify-center transition cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Strip */}
            {totalImage > 1 && (
                <div className="grid grid-cols-5 gap-2.5">
                    {safeImages.map((img, idx) => {
                        const isSelected = idx === activeIdx;
                        return (
                            <button
                                type="button"
                                key={`${img.url}-${idx}`}
                                onClick={setByItem(idx)}
                                className={`relative pt-[100%] rounded-xl overflow-hidden border bg-white transition cursor-pointer ${
                                    isSelected
                                        ? "border-emerald-500 ring-2 ring-emerald-500/25"
                                        : "border-slate-200 hover:border-emerald-300 opacity-75 hover:opacity-100"
                                }`}
                            >
                                <img
                                    className="absolute inset-0 size-full object-contain p-1.5"
                                    src={img.url}
                                    alt={`Thumbnail ${idx + 1}`}
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
