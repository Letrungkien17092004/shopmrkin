import React, { useCallback, useEffect, useState } from "react";
import CreateProductForm from "./CreateProductForm.tsx";
import CreateVariantForm from "./CreateVariantForm.tsx";
import CreateImageForm from "./CreateImageForm.tsx";
import Loading from "../../../components/Loading.tsx";
import { NormalButton } from "../../../components/buttons/Button.tsx";
import { CreateProductProvider, useCreateProduct } from "../../../contexts/CreateProductContext.tsx";
import { MediaService, ProductService, VariantService } from "../../../services/index.ts"

const mediaService = new MediaService()
const productService = new ProductService()
const variantService = new VariantService()

function CreateProductWrapper() {
    const { product, variants, media } = useCreateProduct()
    const [isSaving, setIsSaving] = useState<boolean>(false)

    // post data to server
    useEffect(() => {
        // if not saving then skip
        if (!isSaving) { return }
        const postData = async () => {
            try {
                // upload media
                const uploadedMedia = await mediaService.upload(media.map(med => med.file))

                // create product
                const createdProduct = await productService.create({
                    name: product.name,
                    description: product.description,
                    categoryId: 1
                })

                // create variants
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

                // assign media to product
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

    // Create event handler when user click to save button
    const onClickSave = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()

        // if saving then skip
        if (isSaving) { return }
        if (media.length == 0) {
            window.alert("Cần ít nhất 1 ảnh")
            return
        }
        setIsSaving(true)
    }, [product, variants, media])

    if (isSaving) {
        return (<>
            <div className="pad-12px h-full-vh  overflow-scroll-y">
                <h1>Thêm sản phẩm</h1>
                <Loading />
            </div>
        </>)
    }
    return (<>
        <div className="p-3">
            <h1 className="text-xl text-gray-500 py-2">Thêm sản phẩm</h1>

            <div className="border border-green-400"></div>
            <h3 className="text-xl text-gray-500 py-1">Thêm ảnh</h3>
            <CreateImageForm />

            <div className="border border-green-400"></div>
            <h3 className="text-xl text-gray-500 py-1">Thông tin sản phẩm</h3>
            <CreateProductForm />

            <div className="border border-green-400"></div>
            <h3 className="text-xl text-gray-500 py-1">Thêm biến thể</h3>
            <CreateVariantForm />

            <div className="border border-green-400"></div>
            <div className="w-full flex flex-center justify-start">
                <NormalButton className="text-xl" onClick={onClickSave}>Lưu</NormalButton>
            </div>
        </div>
    </>)
}

export default function CreateProduct() {
    return (
        <CreateProductProvider>
            <CreateProductWrapper />
        </CreateProductProvider>
    )
}
