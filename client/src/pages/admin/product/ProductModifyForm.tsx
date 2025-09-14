import React, { useCallback, useEffect, useReducer, useState } from "react";
import VariantForm from "./VariantCreateForm.tsx";
import { NormalButton } from "../../../components/buttons/Button.tsx";
import ProductService, { Variant, Product } from "../../../services/ProductService.ts";
import TextAreaInput from "../../../components/TextAreaInput.tsx";


type VariantReducerAction = (
    | {
        type: "add",
        data: Variant,
        sku?: never
    }

    | {
        type: "delete",
        sku: string,
        data?: never,
    }

    | {
        type: "modify",
        sku: string,
        data: Partial<Variant>

    }
)
// variantReducer
function variantReducer(state: Variant[], action: VariantReducerAction) {
    switch (action.type) {
        case "add":
            return [action.data, ...state]
        case "delete":
            return state.filter(s => s.sku !== action.sku)
        case "modify":
            const dataToUpdate = action.data
            const allSku = state.map((vari) => vari.sku)
            let isDone = false
            for (let i=0; i<state.length; i++) {
                const variant = state[i]!
                if (variant.sku == action.sku) {
                    if (dataToUpdate.name) variant.name = dataToUpdate.name
                    if (dataToUpdate.price) variant.price = dataToUpdate.price
                    if (dataToUpdate.sku) {
                        if (dataToUpdate.sku in allSku) throw new Error("sku already exits")
                        variant.sku = dataToUpdate.sku
                    }
                    if (dataToUpdate.stock) variant.stock = dataToUpdate.stock
                    isDone = true
                    break
                }
            }
            if (!isDone) throw new Error("variant was not found")
            return [...state]
    }
}



const productService = new ProductService()
// Product modify form
export default function ProductModifyForm({ product }: { product: Product }) {
    const [productName, setProductName] = useState<string>(product.productName)
    const [productDescription, setProductDescription] = useState<string>(product.description)
    const [variants, variantDispatch] = useReducer(variantReducer, product.variants)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    // click save
    useEffect(() => {
        if (!isSaving) return
        const createData = async () => {
            try {
                const newProduct = await productService.modifyProductById(product.id, {
                    productName: productName,
                    description: productDescription,
                    category: "Demo category",
                    imgUrl: "",
                    variants: variants

                })
                window.alert("Xong")
                setIsSaving(false)
                return newProduct
            } catch (error) {
                window.alert("có lỗi xảy ra")
                console.error("Can't create product: ", error)
            }
        }
        createData()
    }, [productName, productDescription, variants, isSaving])

    const onChangeName = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProductName(e.target.value)
    }, [productName])

    const onChangeDescription = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProductDescription(e.target.value)
    }, [productDescription])

    const onClickSave = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setIsSaving(true)
    }, [])

    return (<>
        <link rel="stylesheet" href="/public/css/product-form.css" />
        <section className="w-full">
            <div className="product-form-field w-full">
                <h3>Thêm ảnh</h3>
                <input type="file" multiple />
                <div className="pad-12px">
                    <div className="grid">
                        <div className="row">
                            <div className="col l-2">Ảnh 1</div>
                            <div className="col l-2">Ảnh 2</div>
                            <div className="col l-2">Ảnh 3</div>
                            <div className="col l-2">Ảnh 4</div>
                            <div className="col l-2">Ảnh 5</div>
                            <div className="col l-2">Ảnh 6</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-form-field w-full">
                <div className="grid">
                    <div className="row">
                        <div className="col l-6">
                            <TextAreaInput
                                labelName="Tên sản phẩm"
                                textareaName="name"
                                textareaId="product-name"
                                placeholder="Tên sản phẩm không quá 50 kí tự"
                                value={productName}
                                onChange={onChangeName}
                            />
                        </div>
                        <div className="col l-6">
                            <TextAreaInput
                                labelName="Mô tả"
                                textareaName="description"
                                textareaId="product-description"
                                placeholder="viết mô tả sản phẩm ở đây"
                                value={productDescription}
                                onChange={onChangeDescription}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-form-field w-full">
                <h3>Thêm phân loại</h3>
                <VariantForm variants={variants} variantsDispatch={variantDispatch} />
            </div>

            <div className="dash-dark"></div>
            <div className="w-full">
                {isSaving
                    ? <NormalButton>Đang xử lý</NormalButton>
                    : <NormalButton onClick={onClickSave}>Lưu</NormalButton>
                }
            </div>
        </section>
    </>)
}