import React, { useCallback, useState } from "react";
import TextAreaInput from "../../../components/inputs/TextAreaInput.tsx";
import { useCreateProduct } from "../../../contexts/CreateProductContext.tsx";



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
        <section className="w-full p-4">
            <div className="grid grid-cols-12 gap-x-2">
                    <div className="col-span-6">
                        <TextAreaInput
                            labelName="Tên sản phẩm"
                            textareaName="name"
                            textareaId="product-name"
                            placeholder="Tên sản phẩm không quá 50 kí tự"
                            onChange={onChangeName}
                        />
                    </div>
                    <div className="col-span-6">
                        <TextAreaInput
                            labelName="Mô tả"
                            textareaName="description"
                            textareaId="product-description"
                            placeholder="viết mô tả sản phẩm ở đây"
                            onChange={onChangeDescription}
                        />
                    </div>
            </div>
        </section>
    </>)
}