import React, { useEffect, useRef, useState, ChangeEvent, DragEvent } from "react";
import { useCreateProduct } from "../../contexts/CreateProductContext.tsx";

type ImageItem = {
    id: string;
    file: File;
    preview: string;
};

export interface CreateImageFormProps {
    onImagesChange?: (files: File[]) => void;
    thumbnailSize?: number;
    maxFiles?: number;
    className?: string;
}

function genId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CreateImageForm({
    onImagesChange,
    maxFiles,
}: CreateImageFormProps) {
    const [items, setItems] = useState<ImageItem[]>([]);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const { addMedia, deleteMedia } = useCreateProduct();

    // keep latest items ref for unmount cleanup
    const itemsRef = useRef<ImageItem[]>(items);
    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    // call parent callback whenever items change
    useEffect(() => {
        onImagesChange?.(items.map((it) => it.file));
    }, [items, onImagesChange]);

    // cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            itemsRef.current.forEach((it) => {
                try {
                    URL.revokeObjectURL(it.preview);
                } catch { }
            });
        };
    }, []);

    const processFiles = (files: File[]) => {
        const validImages = files.filter((f) => f.type.startsWith("image/"));
        if (validImages.length === 0) return;

        const newItems = validImages.map((f) => ({
            id: genId(),
            file: f,
            preview: URL.createObjectURL(f),
        }));

        setItems((prev) => {
            const combined = [...prev, ...newItems];
            if (typeof maxFiles === "number" && combined.length > maxFiles) {
                const allowed = combined.slice(0, maxFiles);
                const removed = combined.slice(maxFiles);
                removed.forEach((it) => {
                    try {
                        URL.revokeObjectURL(it.preview);
                    } catch { }
                });
                const addedAllowed = newItems.filter((ni) =>
                    allowed.some((al) => al.id === ni.id)
                );
                addedAllowed.forEach((it) => addMedia({ id: it.id, file: it.file }));
                return allowed;
            }
            newItems.forEach((it) => addMedia({ id: it.id, file: it.file }));
            return combined;
        });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) {
            processFiles(files);
        }
        e.target.value = "";
    };

    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFiles = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
        if (droppedFiles.length > 0) {
            processFiles(droppedFiles);
        }
    };

    const handleRemoveImage = (id: string) => {
        setItems((prev) => {
            const found = prev.find((p) => p.id === id);
            if (found) {
                try {
                    URL.revokeObjectURL(found.preview);
                } catch { }
            }
            return prev.filter((p) => p.id !== id);
        });
        deleteMedia(id);
    };

    const handleRemoveAll = () => {
        items.forEach((it) => {
            try {
                URL.revokeObjectURL(it.preview);
            } catch { }
            deleteMedia(it.id);
        });
        setItems([]);
    };

    return (
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
            {/* Section Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-800">Hình ảnh sản phẩm</h2>
                        <p className="text-xs text-slate-500">
                            Tải lên tối thiểu 1 ảnh. Ảnh đầu tiên sẽ được dùng làm ảnh bìa (thumbnail).
                        </p>
                    </div>
                </div>

                {items.length > 0 && (
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                            Đã chọn {items.length} ảnh
                        </span>
                        <button
                            type="button"
                            onClick={handleRemoveAll}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
                        >
                            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Xóa tất cả
                        </button>
                    </div>
                )}
            </div>

            {/* Drag and Drop Upload Area */}
            <div>
                <input
                    id="selectFilesInput"
                    className="hidden"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
                <label
                    htmlFor="selectFilesInput"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center w-full py-8 px-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                        isDragging
                            ? "border-emerald-500 bg-emerald-50/70"
                            : "border-slate-300 bg-slate-50/60 hover:bg-emerald-50/30 hover:border-emerald-400"
                    }`}
                >
                    <div className="size-12 rounded-2xl bg-white shadow-xs border border-slate-200/80 text-emerald-600 flex items-center justify-center mb-3">
                        <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                        Kéo thả hình ảnh vào đây, hoặc{" "}
                        <span className="text-emerald-600 underline">nhấn để chọn tệp</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        Hỗ trợ định dạng PNG, JPG, WEBP (Khuyến nghị tỉ lệ 1:1)
                    </p>
                </label>
            </div>

            {/* Preview Gallery */}
            {items.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 pt-1">
                    {items.map((it, idx) => (
                        <div
                            key={it.id}
                            className={`group relative rounded-2xl border overflow-hidden bg-slate-50 transition-all ${
                                idx === 0
                                    ? "border-emerald-500 ring-2 ring-emerald-500/20"
                                    : "border-slate-200 hover:border-slate-300"
                            }`}
                            aria-label={it.file.name}
                        >
                            {/* Aspect Square Image */}
                            <div className="relative pt-[100%] w-full bg-white">
                                <img
                                    draggable={false}
                                    className="absolute inset-0 size-full object-contain p-2"
                                    src={it.preview}
                                    alt={it.file.name}
                                />
                            </div>

                            {/* Cover Badge */}
                            {idx === 0 && (
                                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                                    Ảnh bìa
                                </span>
                            )}

                            {/* Remove Button */}
                            <button
                                type="button"
                                className="absolute top-2 right-2 size-7 rounded-full bg-slate-900/75 text-white hover:bg-rose-600 flex items-center justify-center transition shadow-sm cursor-pointer"
                                onClick={() => handleRemoveImage(it.id)}
                                aria-label={`Xóa ${it.file.name}`}
                                title="Xóa ảnh này"
                            >
                                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* File Footer Info */}
                            <div className="px-2.5 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                                <span className="truncate max-w-[70%]" title={it.file.name}>
                                    {it.file.name}
                                </span>
                                <span className="shrink-0 font-medium text-slate-400">
                                    {formatFileSize(it.file.size)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
