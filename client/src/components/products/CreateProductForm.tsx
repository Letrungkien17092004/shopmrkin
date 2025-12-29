import React, { useCallback, useState } from "react";
import TextAreaInput from "../inputs/TextAreaInput.tsx";
import { useCreateProduct } from "../../contexts/CreateProductContext.tsx";



// Product form component
export default function CreateProductForm() {
    const { product, updateProduct } = useCreateProduct()

    const onChangeName = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateProduct({
            name: e.target.value
        })
    }, [product])

    const onChangeDescription = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateProduct({
            description: e.target.value
        })
    }, [product])


    return (<>
        <section className="w-full p-2">
            <div className="grid grid-cols-12 gap-x-2">
                    <div className="col-span-12">
                        <TextAreaInput
                            labelName="Tên sản phẩm"
                            textareaName="name"
                            textareaId="product-name"
                            placeholder="Ví dụ: iPhone Air 256GB | Chính hãng"
                            onChange={onChangeName}
                        />
                    </div>
                    <div className="col-span-12">
                        <TextAreaInput
                            labelName="Mô tả"
                            textareaName="description"
                            textareaId="product-description"
                            placeholder="Ví dụ: iPhone Air 256GB được Apple ra mắt với thiết kế siêu mỏng 5,64mm..."
                            onChange={onChangeDescription}
                        />
                    </div>
            </div>
        </section>
    </>)
}