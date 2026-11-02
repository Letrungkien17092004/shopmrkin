'use client'

import React, { useEffect, useState, useCallback, ChangeEvent, DragEvent } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ProductService, VariantService, MediaService, AuthService } from "@/services/index.ts"
import { Product, Variant } from "@/types/product/index.ts"
import { getMinPrice, getMaxPrice, formatPrice } from "@/utils/index.ts"
import ProductImageSlider from "@/components/products/ProductImageSlider.tsx"
import Loading from "@/components/waiter/Loading.tsx"
import { NoticeManager } from "@/components/notifications/index.tsx"
import { useNoticeManager } from "@/hooks/index.ts"

const authService = new AuthService()
const productService = new ProductService(authService)
const variantService = new VariantService(authService)
const mediaService = new MediaService(authService)

interface VariantListProps {
    variants: Variant[],
    selectedVariant: Variant | undefined,
    createSelectedEvent: (id: string) => ((e: React.MouseEvent) => void) | undefined
}

function VariantList({ variants, selectedVariant, createSelectedEvent }: VariantListProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {variants.map(v => {
                const isSelected = selectedVariant && selectedVariant.id === v.id
                return (
                    <button
                        type="button"
                        key={v.sku}
                        onClick={createSelectedEvent(v.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            isSelected
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                : "bg-white text-slate-700 border-slate-200 hover:border-emerald-400"
                        }`}
                    >
                        {v.name}
                    </button>
                )
            })}
        </div>
    )
}

type NewMediaItem = {
    id: string
    file: File
    preview: string
}

type EditableVariant = {
    id: string
    sku: string
    name: string
    price: number
    stock: number
    isModified: boolean
}

type NewVariantDraft = {
    tempId: string
    sku: string
    name: string
    price: number
    stock: number
}

function genTempId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export default function AdminProductDetailPage() {
    const params = useParams()
    const id = params?.id as string | undefined

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [product, setProduct] = useState<Product | null>(null)
    const [defaultPrice, setDefaultPrice] = useState<string | undefined>(undefined)
    const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(undefined)
    const [isEditing, setIsEditing] = useState<boolean>(false)

    // Edit form states
    const [editName, setEditName] = useState<string>("")
    const [editDescription, setEditDescription] = useState<string>("")
    const [removedMediaIds, setRemovedMediaIds] = useState<string[]>([])
    const [newMediaItems, setNewMediaItems] = useState<NewMediaItem[]>([])
    const [isDragging, setIsDragging] = useState<boolean>(false)

    const [editableVariants, setEditableVariants] = useState<EditableVariant[]>([])
    const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([])
    const [newVariants, setNewVariants] = useState<NewVariantDraft[]>([])
    const [newVariantForm, setNewVariantForm] = useState<{
        sku: string
        name: string
        price: string
        stock: string
    }>({ sku: "", name: "", price: "", stock: "" })

    const { noticeList, pushMessage } = useNoticeManager()

    const syncEditStateFromProduct = useCallback((prod: Product) => {
        setEditName(prod.name)
        setEditDescription(prod.description)
        setRemovedMediaIds([])
        setNewMediaItems((prev) => {
            prev.forEach((it) => {
                try {
                    URL.revokeObjectURL(it.preview)
                } catch {}
            })
            return []
        })
        setEditableVariants(
            prod.variants.map((v) => ({
                id: v.id,
                sku: v.sku,
                name: v.name,
                price: v.price,
                stock: v.stock,
                isModified: false,
            }))
        )
        setDeletedVariantIds([])
        setNewVariants([])
        setNewVariantForm({ sku: "", name: "", price: "", stock: "" })
    }, [])

    const fetchProductData = useCallback(async () => {
        if (!id) return
        try {
            setIsLoading(true)
            const searchedProduct = await productService.findById(id)
            if (searchedProduct) {
                const minP = getMinPrice(searchedProduct.variants) || 0
                const maxP = getMaxPrice(searchedProduct.variants) || 0
                setDefaultPrice(
                    minP === maxP ? formatPrice(minP) : `${formatPrice(minP)} - ${formatPrice(maxP)}`
                )
                setSelectedVariant(undefined)
                syncEditStateFromProduct(searchedProduct)
            }
            setProduct(searchedProduct)
        } catch (err) {
            console.error("Failed to load product:", err)
        } finally {
            setIsLoading(false)
        }
    }, [id, syncEditStateFromProduct])

    useEffect(() => {
        fetchProductData()
        if (typeof window !== "undefined") {
            const sp = new URLSearchParams(window.location.search)
            if (sp.get("edit") === "true") {
                setIsEditing(true)
            }
        }
    }, [fetchProductData])

    const createSelectedEvent = useCallback((variantId: string) => {
        if (!product || product.variants.length <= 0) { return }
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            if (selectedVariant && selectedVariant.id === variantId) {
                setSelectedVariant(undefined)
                return
            }
            setSelectedVariant(product.variants.find(v => v.id === variantId))
        }
    }, [product, selectedVariant])

    // Image handlers in Edit mode
    const toggleRemoveExistingMedia = (mediaId: string) => {
        setRemovedMediaIds((prev) =>
            prev.includes(mediaId) ? prev.filter((item) => item !== mediaId) : [...prev, mediaId]
        )
    }

    const addFilesToNewMedia = (files: File[]) => {
        const validImages = files.filter((f) => f.type.startsWith("image/"))
        if (validImages.length === 0) return
        const created = validImages.map((file) => ({
            id: genTempId(),
            file,
            preview: URL.createObjectURL(file),
        }))
        setNewMediaItems((prev) => [...prev, ...created])
    }

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : []
        if (files.length > 0) {
            addFilesToNewMedia(files)
        }
        e.target.value = ""
    }

    const handleDropFiles = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : []
        if (files.length > 0) {
            addFilesToNewMedia(files)
        }
    }

    const removeNewMediaItem = (tempId: string) => {
        setNewMediaItems((prev) => {
            const target = prev.find((p) => p.id === tempId)
            if (target) {
                try {
                    URL.revokeObjectURL(target.preview)
                } catch {}
            }
            return prev.filter((p) => p.id !== tempId)
        })
    }

    // Variant handlers in Edit mode
    const handleExistingVariantChange = (
        variantId: string,
        field: "sku" | "name" | "price" | "stock",
        value: string
    ) => {
        setEditableVariants((prev) =>
            prev.map((v) => {
                if (v.id !== variantId) return v
                const updated = {
                    ...v,
                    [field]: field === "price" || field === "stock" ? Number(value) : value,
                    isModified: true,
                }
                return updated
            })
        )
    }

    const toggleDeleteExistingVariant = (variantId: string) => {
        setDeletedVariantIds((prev) =>
            prev.includes(variantId) ? prev.filter((idItem) => idItem !== variantId) : [...prev, variantId]
        )
    }

    const handleAddNewVariantDraft = () => {
        const trimmedSku = newVariantForm.sku.trim()
        const trimmedName = newVariantForm.name.trim()

        if (trimmedSku.length < 5 || trimmedName.length < 5) {
            pushMessage({ message: "Mã SKU và tên phân loại phải từ 5 ký tự trở lên", noticeType: "error" })
            return
        }
        if (trimmedSku.includes(" ")) {
            pushMessage({ message: "Mã SKU không được chứa khoảng trắng", noticeType: "error" })
            return
        }
        if (
            newVariantForm.price === "" ||
            newVariantForm.stock === "" ||
            Number(newVariantForm.price) <= 0 ||
            Number(newVariantForm.stock) < 0
        ) {
            pushMessage({ message: "Giá bán (> 0) và tồn kho (>= 0) không hợp lệ", noticeType: "error" })
            return
        }

        const activeExistingSkus = editableVariants
            .filter((v) => !deletedVariantIds.includes(v.id))
            .map((v) => v.sku)
        const newSkus = newVariants.map((nv) => nv.sku)

        if (activeExistingSkus.includes(trimmedSku) || newSkus.includes(trimmedSku)) {
            pushMessage({ message: "Mã SKU này đã tồn tại trong sản phẩm", noticeType: "error" })
            return
        }

        setNewVariants((prev) => [
            ...prev,
            {
                tempId: genTempId(),
                sku: trimmedSku,
                name: trimmedName,
                price: Number(newVariantForm.price),
                stock: Number(newVariantForm.stock),
            },
        ])
        setNewVariantForm({ sku: "", name: "", price: "", stock: "" })
    }

    const removeNewVariantDraft = (tempId: string) => {
        setNewVariants((prev) => prev.filter((nv) => nv.tempId !== tempId))
    }

    // Save all product updates
    const handleSaveUpdate = async () => {
        if (!product || isSaving) return

        const trimmedName = editName.trim()
        const trimmedDesc = editDescription.trim()

        if (trimmedName.length <= 5 || trimmedDesc.length <= 5) {
            pushMessage({ message: "Tên và mô tả sản phẩm phải dài hơn 5 ký tự", noticeType: "error" })
            return
        }

        const validExistingMedia = product.media.filter((m) => m.id && !removedMediaIds.includes(m.id))
        if (validExistingMedia.length + newMediaItems.length === 0) {
            pushMessage({ message: "Sản phẩm cần có ít nhất 1 hình ảnh", noticeType: "error" })
            return
        }

        const keptExistingVariants = editableVariants.filter((v) => !deletedVariantIds.includes(v.id))
        if (keptExistingVariants.length + newVariants.length === 0) {
            pushMessage({ message: "Sản phẩm cần có ít nhất 1 phân loại", noticeType: "error" })
            return
        }

        // Validate edited existing variants
        for (const v of keptExistingVariants) {
            if (v.sku.trim().length < 5 || v.name.trim().length < 5) {
                pushMessage({ message: `Phân loại "${v.name || v.sku}" cần có SKU và tên ít nhất 5 ký tự`, noticeType: "error" })
                return
            }
            if (v.sku.trim().includes(" ")) {
                pushMessage({ message: `SKU "${v.sku}" không được có khoảng trắng`, noticeType: "error" })
                return
            }
            if (v.price <= 0 || v.stock < 0) {
                pushMessage({ message: `Phân loại "${v.name}" có giá hoặc tồn kho không hợp lệ`, noticeType: "error" })
                return
            }
        }

        try {
            setIsSaving(true)

            // 1. Update Product basic info if changed
            if (trimmedName !== product.name || trimmedDesc !== product.description) {
                await productService.updateById(product.id, {
                    name: trimmedName,
                    description: trimmedDesc,
                })
            }

            // 2. Orphan removed images (set productId = null & status = "ORPHANED")
            for (const mediaId of removedMediaIds) {
                if (mediaId) {
                    await mediaService.updateById(mediaId, {
                        productId: null,
                        status: "ORPHANED",
                    })
                }
            }

            // 3. Upload & assign newly added images
            if (newMediaItems.length > 0) {
                const uploadedMedia = await mediaService.upload(newMediaItems.map((it) => it.file))
                for (const up of uploadedMedia) {
                    await mediaService.updateById(up.id, {
                        productId: product.id,
                        status: "ASSIGNED",
                    })
                }
            }

            // 4. Delete removed existing variants
            for (const varId of deletedVariantIds) {
                await variantService.deleteById(varId)
            }

            // 5. Update modified existing variants
            for (const v of keptExistingVariants) {
                if (v.isModified) {
                    await variantService.updateById(v.id, {
                        name: v.name.trim(),
                        sku: v.sku.trim(),
                        price: Number(v.price),
                        stock: Number(v.stock),
                    })
                }
            }

            // 6. Create newly added variants
            for (const nv of newVariants) {
                await variantService.create({
                    name: nv.name.trim(),
                    sku: nv.sku.trim(),
                    price: Number(nv.price),
                    stock: Number(nv.stock),
                    productId: product.id,
                })
            }

            await fetchProductData()
            setIsEditing(false)
            pushMessage({ message: "Cập nhật sản phẩm thành công!", noticeType: "normal" })
        } catch (err) {
            console.error("Update product error:", err)
            pushMessage({ message: "Có lỗi xảy ra khi cập nhật sản phẩm!", noticeType: "error" })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-[75vh] flex items-center justify-center bg-white rounded-3xl border border-slate-200/80 p-8">
                <Loading label="Đang tải chi tiết sản phẩm..." size="lg" />
            </div>
        )
    }

    if (isSaving) {
        return (
            <div className="min-h-[75vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
                <Loading label="Đang lưu các thay đổi của sản phẩm..." size="lg" />
                <p className="text-xs text-slate-400">
                    Đang đồng bộ thông tin sản phẩm, hình ảnh và các phân loại hàng...
                </p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
                <p className="text-base font-bold text-slate-700">Không tìm thấy sản phẩm này</p>
                <Link
                    href="/manager/products"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold no-underline"
                >
                    Quay lại danh sách
                </Link>
            </div>
        )
    }

    const keptExistingMediaCount = product.media.filter((m) => m.id && !removedMediaIds.includes(m.id)).length
    const activeExistingVariants = editableVariants.filter((v) => !deletedVariantIds.includes(v.id))
    const modifiedVariantsCount = activeExistingVariants.filter((v) => v.isModified).length
    const totalUpdatedStock =
        activeExistingVariants.reduce((s, v) => s + (Number(v.stock) || 0), 0) +
        newVariants.reduce((s, v) => s + (Number(v.stock) || 0), 0)

    return (
        <>
            <NoticeManager noticeList={noticeList} />
            <div className="max-w-6xl mx-auto space-y-6 pb-12">
                {/* Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                    <div className="space-y-1">
                        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
                            <Link href="/manager" className="hover:text-emerald-600 no-underline text-slate-400">
                                Quản lý
                            </Link>
                            <span>/</span>
                            <Link href="/manager/products" className="hover:text-emerald-600 no-underline text-slate-400">
                                Sản phẩm
                            </Link>
                            <span>/</span>
                            <span className="text-slate-700 font-semibold">
                                {isEditing ? `Chỉnh sửa #${product.product_code}` : `Chi tiết #${product.product_code}`}
                            </span>
                        </nav>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 line-clamp-1">
                            {isEditing ? "Chỉnh sửa sản phẩm" : product.name}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        syncEditStateFromProduct(product)
                                        setIsEditing(false)
                                    }}
                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition cursor-pointer"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveUpdate}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm shadow-emerald-600/20 transition cursor-pointer"
                                >
                                    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                    <span>Lưu cập nhật</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/manager/products"
                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition no-underline"
                                >
                                    ← Quay lại
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        syncEditStateFromProduct(product)
                                        setIsEditing(true)
                                    }}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm shadow-emerald-600/20 transition cursor-pointer"
                                >
                                    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                    <span>Chỉnh sửa sản phẩm</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* VIEW MODE */}
                {!isEditing ? (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-5">
                            <ProductImageSlider
                                images={product.media.map(med => ({ url: `${med.filePath}` }))}
                            />
                        </div>
                        <div className="md:col-span-7 space-y-5">
                            <div>
                                <span className="inline-block font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 mb-2">
                                    Mã SP: #{product.product_code}
                                </span>
                                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                                    {product.name}
                                </h2>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <span className="text-xs font-medium text-slate-500 block">Giá bán niêm yết</span>
                                <p className="text-2xl font-extrabold text-rose-600 mt-0.5">
                                    {selectedVariant ? formatPrice(selectedVariant.price) : defaultPrice}
                                </p>
                                {selectedVariant && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        SKU: <code className="font-mono font-semibold">{selectedVariant.sku}</code> • Tồn kho:{" "}
                                        <strong className="text-emerald-600">{selectedVariant.stock} SP</strong>
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Phân loại ({product.variants.length})
                                </p>
                                <VariantList
                                    variants={product.variants}
                                    selectedVariant={selectedVariant}
                                    createSelectedEvent={createSelectedEvent}
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Mô tả sản phẩm
                                </p>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* EDIT MODE */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column: Edit Forms */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* 1. Basic Information Card */}
                            <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                    <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-800">Thông tin cơ bản</h2>
                                        <p className="text-xs text-slate-500">
                                            Cập nhật tên sản phẩm và nội dung mô tả chi tiết.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-semibold text-slate-700">
                                                Tên sản phẩm <span className="text-rose-500">*</span>
                                            </label>
                                            <span className="text-xs text-slate-400">{editName.length}/150 ký tự</span>
                                        </div>
                                        <input
                                            type="text"
                                            maxLength={150}
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-semibold text-slate-700">
                                                Mô tả sản phẩm <span className="text-rose-500">*</span>
                                            </label>
                                            <span className="text-xs text-slate-400">{editDescription.length} ký tự</span>
                                        </div>
                                        <textarea
                                            rows={6}
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-y leading-relaxed"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* 2. Product Images Management Card */}
                            <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
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
                                                Ảnh bị xóa khỏi sản phẩm sẽ được chuyển sang trạng thái ảnh mồ côi (Orphaned) để hệ thống dọn dẹp sau.
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                                        Tổng cộng: {keptExistingMediaCount + newMediaItems.length} ảnh
                                    </span>
                                </div>

                                {/* Existing Images */}
                                {product.media.filter(m => m.id).length > 0 && (
                                    <div className="space-y-2.5">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Ảnh hiện tại ({keptExistingMediaCount}/{product.media.filter(m => m.id).length})
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                                            {product.media.filter(m => m.id).map((med, idx) => {
                                                const isMarkedRemoved = removedMediaIds.includes(med.id)
                                                return (
                                                    <div
                                                        key={med.id}
                                                        className={`relative rounded-2xl border overflow-hidden transition-all ${
                                                            isMarkedRemoved
                                                                ? "border-rose-300 bg-rose-50/40 opacity-60"
                                                                : "border-slate-200 bg-white"
                                                        }`}
                                                    >
                                                        <div className="relative pt-[100%] w-full">
                                                            <img
                                                                src={`${med.filePath}`}
                                                                alt={med.fileName}
                                                                className="absolute inset-0 size-full object-contain p-2"
                                                            />
                                                        </div>

                                                        {!isMarkedRemoved && idx === 0 && (
                                                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold uppercase">
                                                                Ảnh bìa
                                                            </span>
                                                        )}

                                                        {isMarkedRemoved && (
                                                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold uppercase">
                                                                Sẽ gỡ (Mồ côi)
                                                            </span>
                                                        )}

                                                        <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleRemoveExistingMedia(med.id)}
                                                                className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                                                    isMarkedRemoved
                                                                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                                                        : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                                                }`}
                                                            >
                                                                {isMarkedRemoved ? "Hoàn tác (Giữ lại)" : "Gỡ khỏi sản phẩm"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Upload New Images */}
                                <div className="space-y-3 pt-2">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Thêm ảnh mới
                                    </h3>
                                    <input
                                        id="editProductFilesInput"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="editProductFilesInput"
                                        onDragOver={(e) => {
                                            e.preventDefault()
                                            setIsDragging(true)
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault()
                                            setIsDragging(false)
                                        }}
                                        onDrop={handleDropFiles}
                                        className={`flex flex-col items-center justify-center w-full py-6 px-4 border-2 border-dashed rounded-2xl cursor-pointer transition ${
                                            isDragging
                                                ? "border-emerald-500 bg-emerald-50/70"
                                                : "border-slate-300 bg-slate-50/60 hover:bg-emerald-50/30 hover:border-emerald-400"
                                        }`}
                                    >
                                        <p className="text-sm font-semibold text-slate-700">
                                            Kéo thả ảnh mới vào đây hoặc <span className="text-emerald-600 underline">nhấn để tải thêm</span>
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5">Hỗ trợ PNG, JPG, WEBP</p>
                                    </label>

                                    {newMediaItems.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 pt-2">
                                            {newMediaItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="relative rounded-2xl border border-emerald-400 bg-white overflow-hidden"
                                                >
                                                    <div className="relative pt-[100%] w-full">
                                                        <img
                                                            src={item.preview}
                                                            alt={item.file.name}
                                                            className="absolute inset-0 size-full object-contain p-2"
                                                        />
                                                    </div>
                                                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-teal-600 text-white text-[10px] font-bold uppercase">
                                                        Ảnh mới
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewMediaItem(item.id)}
                                                        className="absolute top-2 right-2 size-6 rounded-full bg-slate-900/75 text-white hover:bg-rose-600 flex items-center justify-center text-xs cursor-pointer"
                                                        title="Xóa ảnh mới này"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* 3. Variants Management Card */}
                            <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                            <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-slate-800">Quản lý phân loại (Variants)</h2>
                                            <p className="text-xs text-slate-500">
                                                Chỉnh sửa trực tiếp giá bán, tồn kho, tên phân loại hiện có hoặc thêm phân loại mới.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Add New Variant Form */}
                                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Thêm phân loại mới
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
                                        <div className="lg:col-span-3 space-y-1">
                                            <label className="block text-xs font-semibold text-slate-700">Mã SKU</label>
                                            <input
                                                type="text"
                                                value={newVariantForm.sku}
                                                onChange={(e) => setNewVariantForm((p) => ({ ...p, sku: e.target.value }))}
                                                placeholder="ip16_512_black"
                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-mono"
                                            />
                                        </div>
                                        <div className="lg:col-span-3 space-y-1">
                                            <label className="block text-xs font-semibold text-slate-700">Tên phân loại</label>
                                            <input
                                                type="text"
                                                value={newVariantForm.name}
                                                onChange={(e) => setNewVariantForm((p) => ({ ...p, name: e.target.value }))}
                                                placeholder="Bản 512GB - Đen"
                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                                            />
                                        </div>
                                        <div className="lg:col-span-2 space-y-1">
                                            <label className="block text-xs font-semibold text-slate-700">Giá bán (VNĐ)</label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={newVariantForm.price}
                                                onChange={(e) => setNewVariantForm((p) => ({ ...p, price: e.target.value }))}
                                                placeholder="32990000"
                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                                            />
                                        </div>
                                        <div className="lg:col-span-2 space-y-1">
                                            <label className="block text-xs font-semibold text-slate-700">Tồn kho</label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={newVariantForm.stock}
                                                onChange={(e) => setNewVariantForm((p) => ({ ...p, stock: e.target.value }))}
                                                placeholder="50"
                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                                            />
                                        </div>
                                        <div className="lg:col-span-2">
                                            <button
                                                type="button"
                                                onClick={handleAddNewVariantDraft}
                                                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition cursor-pointer"
                                            >
                                                + Thêm
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Existing & New Variants Table */}
                                <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                <th className="py-3 px-3">Mã SKU</th>
                                                <th className="py-3 px-3">Tên phân loại</th>
                                                <th className="py-3 px-3">Giá bán (VNĐ)</th>
                                                <th className="py-3 px-3">Tồn kho</th>
                                                <th className="py-3 px-3 text-right">Trạng thái / Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {editableVariants.map((v) => {
                                                const isDeleted = deletedVariantIds.includes(v.id)
                                                return (
                                                    <tr
                                                        key={v.id}
                                                        className={isDeleted ? "bg-rose-50/40 opacity-50" : "hover:bg-slate-50/70"}
                                                    >
                                                        <td className="py-2.5 px-3">
                                                            <input
                                                                type="text"
                                                                disabled={isDeleted}
                                                                value={v.sku}
                                                                onChange={(e) => handleExistingVariantChange(v.id, "sku", e.target.value)}
                                                                className="w-full min-w-[120px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono"
                                                            />
                                                        </td>
                                                        <td className="py-2.5 px-3">
                                                            <input
                                                                type="text"
                                                                disabled={isDeleted}
                                                                value={v.name}
                                                                onChange={(e) => handleExistingVariantChange(v.id, "name", e.target.value)}
                                                                className="w-full min-w-[140px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                                                            />
                                                        </td>
                                                        <td className="py-2.5 px-3">
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                disabled={isDeleted}
                                                                value={v.price}
                                                                onChange={(e) => handleExistingVariantChange(v.id, "price", e.target.value)}
                                                                className="w-full min-w-[110px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-rose-600"
                                                            />
                                                        </td>
                                                        <td className="py-2.5 px-3">
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                disabled={isDeleted}
                                                                value={v.stock}
                                                                onChange={(e) => handleExistingVariantChange(v.id, "stock", e.target.value)}
                                                                className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                                                            />
                                                        </td>
                                                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                                            <div className="inline-flex items-center gap-2">
                                                                {!isDeleted && v.isModified && (
                                                                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold">
                                                                        Đã sửa
                                                                    </span>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleDeleteExistingVariant(v.id)}
                                                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                                                        isDeleted
                                                                            ? "bg-emerald-600 text-white"
                                                                            : "text-rose-600 bg-rose-50 hover:bg-rose-100"
                                                                    }`}
                                                                >
                                                                    {isDeleted ? "Hoàn tác" : "Xóa"}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}

                                            {/* Newly added variants */}
                                            {newVariants.map((nv) => (
                                                <tr key={nv.tempId} className="bg-emerald-50/30">
                                                    <td className="py-2.5 px-3 font-mono text-xs font-semibold text-slate-700">
                                                        {nv.sku}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-xs font-semibold text-slate-800">
                                                        {nv.name}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-xs font-bold text-rose-600">
                                                        {formatPrice(nv.price)}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-xs font-semibold text-emerald-700">
                                                        {nv.stock} SP
                                                    </td>
                                                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                                        <div className="inline-flex items-center gap-2">
                                                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                                                                Mới thêm
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeNewVariantDraft(nv.tempId)}
                                                                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
                                                            >
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Update Summary Card */}
                        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
                            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
                                <div className="pb-3 border-b border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-800">Tóm tắt thay đổi</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Kiểm tra lại các cập nhật trước khi lưu
                                    </p>
                                </div>

                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Thông tin cơ bản:</span>
                                        <span className="font-semibold text-slate-800">
                                            {editName !== product.name || editDescription !== product.description
                                                ? "Đã thay đổi"
                                                : "Giữ nguyên"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Ảnh giữ lại:</span>
                                        <span className="font-semibold text-slate-800">{keptExistingMediaCount} ảnh</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Ảnh mới tải lên:</span>
                                        <span className="font-semibold text-emerald-600">+{newMediaItems.length} ảnh</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Ảnh chuyển mồ côi:</span>
                                        <span className="font-semibold text-rose-600">{removedMediaIds.length} ảnh</span>
                                    </div>
                                    <div className="pt-2 border-t border-slate-100 flex justify-between">
                                        <span className="text-slate-500">Phân loại đang hoạt động:</span>
                                        <span className="font-semibold text-slate-800">
                                            {activeExistingVariants.length + newVariants.length} loại
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Phân loại sửa / mới / xóa:</span>
                                        <span className="font-semibold text-slate-700">
                                            {modifiedVariantsCount} sửa • {newVariants.length} mới • {deletedVariantIds.length} xóa
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Tổng tồn kho sau cập nhật:</span>
                                        <span className="font-bold text-emerald-600">{totalUpdatedStock} SP</span>
                                    </div>
                                </div>

                                <div className="pt-2 space-y-2.5">
                                    <button
                                        type="button"
                                        onClick={handleSaveUpdate}
                                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm shadow-emerald-600/20 transition cursor-pointer"
                                    >
                                        Lưu cập nhật sản phẩm
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            syncEditStateFromProduct(product)
                                            setIsEditing(false)
                                        }}
                                        className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs transition cursor-pointer"
                                    >
                                        Hủy thay đổi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}


