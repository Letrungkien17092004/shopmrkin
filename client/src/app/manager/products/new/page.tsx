'use client'

import React, { useCallback, useEffect, useState } from "react"
import { CreateProductForm, CreateVariantForm } from "@/components/products/index.ts"
import { CreateImageForm } from "@/components/media/index.ts"
import Loading from "@/components/waiter/Loading.tsx"
import { NoticeManager } from "@/components/notifications/index.tsx"
import { useNoticeManager } from "@/hooks/index.ts"
import { NormalButton } from "@/components/button/Button.tsx"
import { CreateProductProvider, useCreateProduct } from "@/contexts/CreateProductContext.tsx"
import { MediaService, ProductService, VariantService, AuthService } from "@/services/index.ts"

const authService = new AuthService()
const mediaService = new MediaService(authService)
const productService = new ProductService(authService)
const variantService = new VariantService(authService)

function CreateProductWrapper() {
    const { product, variants, media } = useCreateProduct()
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const { noticeList, pushMessage } = useNoticeManager()

    useEffect(() => {
        if (!isSaving) { return }
        const postData = async () => {
            try {
                const uploadedMedia = await mediaService.upload(media.map(med => med.file))
                const createdProduct = await productService.create({
                    name: product.name,
                    description: product.description,
                    categoryId: 1
                })
                for (let i = 0; i < variants.length; i++) {
                    const v = variants[i]!
                    await variantService.create({
                        name: v.name,
                        sku: v.sku,
                        price: v.price,
                        stock: v.stock,
                        productId: createdProduct.id
                    })
                }
                const listMediaId = uploadedMedia.map(item => item.id)
                for (let i = 0; i < listMediaId.length; i++) {
                    await mediaService.updateById(listMediaId[i], { productId: createdProduct.id })
                }
                setIsSaving(false)
            } catch (error) {
                console.log(error)
                setIsSaving(false)
            }
        }
        postData()
    }, [isSaving])

    const onClickSave = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (isSaving) { return }
        if (media.length == 0) {
            pushMessage({ message: "Cần ít nhất một ảnh", noticeType: "error" })
            return
        }
        if (product.name.length <= 5 || product.description.length <= 5) {
            pushMessage({ message: "Tên và mô tả quá ngắn", noticeType: "error" })
            return
        }
        if (variants.length <= 0) {
            pushMessage({ message: "Cần ít nhất 1 biến thể", noticeType: "error" })
            return
        }
        setIsSaving(true)
    }, [product, variants, media])

    if (isSaving) {
        return (
            <div className="p-3 h-full overflow-scroll">
                <h1>Thêm sản phẩm</h1>
                <Loading />
            </div>
        )
    }

    return (
        <>
            <NoticeManager noticeList={noticeList} />
            <div className="p-3">
                <h1 className="text-xl text-black py-2 border-b">Thêm sản phẩm</h1>
                <div className="w-full p-2 flex justify-end">
                    <NormalButton className="text-xl" onClick={onClickSave}>Lưu</NormalButton>
                </div>
                <CreateImageForm />
                <CreateProductForm />
                <CreateVariantForm />
            </div>
        </>
    )
}

export default function NewProductPage() {
    return (
        <CreateProductProvider>
            <CreateProductWrapper />
        </CreateProductProvider>
    )
}
