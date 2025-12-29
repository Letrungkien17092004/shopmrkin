import React, { useEffect, useRef, useState, ChangeEvent } from "react";
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


export default function CreateImageForm({
    onImagesChange,
    maxFiles,
}: CreateImageFormProps) {
    const [items, setItems] = useState<ImageItem[]>([]);
    const { addMedia, deleteMedia } = useCreateProduct()

    // keep latest items ref for unmount cleanup
    const itemsRef = useRef<ImageItem[]>(items);
    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    // call parent callback whenever items change
    useEffect(() => {
        onImagesChange?.(items.map((it) => it.file));
        for (let i = 0; i < items.length; i++) {
            const item = items[i]!
            addMedia({
                id: item.id,
                file: item.file
            })
        }
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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length === 0) {
            e.target.value = "";
            return;
        }

        const newItems = files.map((f) => ({
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
                return allowed;
            }
            return combined;
        });

        e.target.value = "";
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
        deleteMedia(id)
    };

    const handleRemoveAll = () => {
        items.forEach((it) => {
            try {
                URL.revokeObjectURL(it.preview);
            } catch { }
        });
        setItems([]);
    };

    return (
        <div className="px-2">
            {/* scoped styles inserted here */}
            <div className="mb-2">
                <input
                    id="selectFilesInput"
                    className="hidden"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
                {/* label như button để kích hoạt file input */}
                <label
                    htmlFor="selectFilesInput"
                    className="inline-block p-2 bg-blue-500 text-base text-white rounded cursor-pointer hover:bg-blue-600"
                >
                    Chọn ảnh
                </label>

                {items.length > 0 && (
                    <button
                        type="button"
                        className="inline-block p-2 ml-2 text-base bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
                        onClick={handleRemoveAll}
                    >
                        Xóa tất cả ({items.length})
                    </button>
                )}
            </div>

            <div className="flex gap-x-2">
                {items.map((it) => (
                    <div
                        key={it.id}
                        className="relative p-1 bg-white border border-gray-200 rounded-xl"
                        aria-label={it.file.name}
                    >
                        <img
                            draggable={false}
                            className="w-45 h-30 object-contain"
                            src={it.preview}
                            alt={it.file.name}
                        />
                        <button
                            type="button"
                            className="absolute top-0 right-0 size-6 rounded-full bg-red-500/80 text-white hover:bg-red-500/95 cursor-pointer"
                            onClick={() => handleRemoveImage(it.id)}
                            aria-label={`Xóa ${it.file.name}`}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}