import React, { useCallback, useReducer, useState, type ChangeEvent } from "react";
import VariantForm from "./VariantForm.tsx";
import { NormalButton } from "../../components/buttons/Button.tsx";


type Variant = {
    name: string,
    sku: string,
    price: number,
    stock: number
}

type VariantReducerAction = {
    type: string,
    data?: Variant
}
function variantReducer(state: Variant[], action: VariantReducerAction) {
    switch (action.type) {
        case "add":
            if (action.data) {
                return [action.data, ...state]
            }
            throw new Error("No data provide")
    }

    throw new Error("Unknow actions: " + action.type)
}

export default function ProductForm() {
    const [productName, setProductName] = useState<string>("")
    const [productDescription, setProductDescription] = useState<string>("")
    const [variants, variantDispatch] = useReducer(variantReducer, [])


    const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
    }, [productName])

    const onChangeDescription = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log(e.target.value)
    }, [productDescription])

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
                <VariantForm variants={variants} variantsDispatch={variantDispatch}/>
            </div>
            
            <div className="dash-dark"></div>
            <div className="w-full">
                <NormalButton>Lưu</NormalButton>
            </div>
        </section>
    </>)
}