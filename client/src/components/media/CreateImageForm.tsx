import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { useCreateProduct } from "../../contexts/CreateProductContext.tsx";
type ImageItem = {
    id: string;
    file: File;
    preview: string;
};

export interface CreateImageFormProps {
    onImagesChange?: (files: File[]) => void;
    /** kích thước thumbnail cố định (pixel). width = height = thumbnailSize */
    thumbnailSize?: number;
    /** giới hạn tổng số file (undefined = không giới hạn) */
    maxFiles?: number;
    /** optional class để gắn vào wrapper (vẫn giữ scoping nội bộ) */
    className?: string;
}

function genId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * CreateImageForm
 * - preview cố định (thumbnailSize)
 * - lưu File[] thực tế để gửi lên server
 * - styles nội tuyến có prefix duy nhất => không ảnh hưởng tới UI khác
 */
export default function CreateImageForm({
    onImagesChange,
    thumbnailSize = 150,
    maxFiles,
    className,
}: CreateImageFormProps) {
    const [items, setItems] = useState<ImageItem[]>([]);
    const { addMedia, deleteMedia } = useCreateProduct()
    // unique prefix (scoped class names)
    const uidRef = useRef<string>(genId());
    const prefix = `cif-${uidRef.current}`;
    const inputId = `cif-input-${uidRef.current}`;

    // keep latest items ref for unmount cleanup
    const itemsRef = useRef<ImageItem[]>(items);
    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    // call parent callback whenever items change
    useEffect(() => {
        onImagesChange?.(items.map((it) => it.file));
        for (let i=0; i<items.length; i++) {
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
                // nếu vượt maxFiles -> giữ phần đầu, revoke phần thừa
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

        // reset input để có thể chọn lại cùng file
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

    // scoped CSS (class names prefixed by `prefix`)
    const css = `
.${prefix} {
  box-sizing: border-box;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  font-size: 14px;
  color: #111;
  width: 100%;
  padding: 8px;
}
.${prefix} * { box-sizing: inherit; }

/* controls */
.${prefix}__controls {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

/* hide native file input, use label button */
.${prefix}__file-input{
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

/* custom choose button */
.${prefix}__choose-btn {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #cfcfcf;
  background: #fff;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
}
.${prefix}__choose-btn:hover { background: #f5f5f5; }
.${prefix}__choose-btn:focus { outline: 2px solid rgba(0,110,255,0.15); outline-offset: 2px; }

/* remove all button */
.${prefix}__remove-all {
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  background: #d9534f;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
}
.${prefix}__remove-all:hover { background: #c12b2b; }

/* grid */
.${prefix}__grid {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: flex-start;
}

/* thumbnail wrapper - size set inline via style attribute (px) */
.${prefix}__thumb {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
  background: #f8f8f8;
  flex: 0 0 auto;
  display: inline-block;
}

/* image cover the thumb and crop if needed */
.${prefix}__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

/* remove single */
.${prefix}__remove {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 10;
  background: rgba(0,0,0,0.6);
  color: #fff;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor: pointer;
  font-size: 14px;
}
.${prefix}__remove:hover { background: rgba(255,0,0,0.85); }

/* caption (file name) */
.${prefix}__caption {
  position:absolute;
  left:0;
  right:0;
  bottom:0;
  background: rgba(0,0,0,0.45);
  color:#fff;
  padding:4px 6px;
  font-size: 11px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

/* small responsive tweak */
@media (max-width:420px) {
  .${prefix}__choose-btn, .${prefix}__remove-all { font-size: 12px; padding: 6px 8px; }
}
`;

    return (
        <div className={`${prefix} ${className ?? ""}`} aria-live="polite">
            {/* scoped styles inserted here */}
            <style dangerouslySetInnerHTML={{ __html: css }} />
            <div className={`${prefix}__controls`}>
                <input
                    id={inputId}
                    className={`${prefix}__file-input`}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
                {/* label như button để kích hoạt file input */}
                <label htmlFor={inputId} className={`${prefix}__choose-btn`} role="button">
                    Chọn ảnh
                </label>

                {items.length > 0 && (
                    <button
                        type="button"
                        className={`${prefix}__remove-all`}
                        onClick={handleRemoveAll}
                        aria-label="Xóa tất cả ảnh"
                    >
                        Xóa tất cả ({items.length})
                    </button>
                )}
            </div>

            <div className={`${prefix}__grid`}>
                {items.map((it) => (
                    <div
                        key={it.id}
                        className={`${prefix}__thumb`}
                        style={{ width: thumbnailSize, height: thumbnailSize }}
                        aria-label={it.file.name}
                    >
                        <img
                            draggable={false}
                            className={`${prefix}__img`}
                            src={it.preview}
                            alt={it.file.name}
                        />
                        <button
                            type="button"
                            className={`${prefix}__remove`}
                            onClick={() => handleRemoveImage(it.id)}
                            aria-label={`Xóa ${it.file.name}`}
                        >
                            ✕
                        </button>
                        <div className={`${prefix}__caption`} title={it.file.name}>
                            {it.file.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}