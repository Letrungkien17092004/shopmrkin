import React, { useCallback, useEffect, useReducer, useState, type ChangeEvent } from "react";
import VariantForm from "./VariantForm.tsx";
import { NormalButton } from "../../components/buttons/Button.tsx";
import ProductService, { Variant } from "../../services/ProductService.ts";

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
)


function variantReducer(state: Variant[], action: VariantReducerAction) {
    switch (action.type) {
        case "add":
            return [action.data, ...state]
        case "delete":
            return state.filter(s => s.sku !== action.sku)
    }
}


const productService = new ProductService()
export default function ProductForm() {
    const [productName, setProductName] = useState<string>("")
    const [productDescription, setProductDescription] = useState<string>("")
    const [variants, variantDispatch] = useReducer(variantReducer, [])
    const [isSaving, setIsSaving] = useState<boolean>(false)

    useEffect(() => {
        if (!isSaving) return
        const createData = async () => {
            try {
                const newProduct = await productService.createData({
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

    const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
                <h3>Tên sản phẩm</h3>
                <input onChange={onChangeName} id="product-form-name-inp" className="text-lg font-light" type="search" />
            </div>

            <div className="product-form-field w-full">
                <h3>Mô tả sản phẩm</h3>
                <textarea onChange={onChangeDescription} name="product-description" id="product-description" className="text-base font-normal"></textarea>
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