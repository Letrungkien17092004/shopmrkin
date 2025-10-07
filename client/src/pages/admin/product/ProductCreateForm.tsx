import React, { useCallback, useEffect, useReducer, useState, type ChangeEvent } from "react";
import VariantForm from "./VariantCreateForm.tsx";
import { NormalButton } from "../../../components/buttons/Button.tsx";
import TextAreaInput from "../../../components/TextAreaInput.tsx";
import ProductService, { Product } from "../../../services/ProductService.ts";
import VariantService, { Variant } from "../../../services/VariantService.ts";

const productService = new ProductService()
const variantService = new VariantService()



// Product form component
export default function ProductCreateForm() {
    const [variants, setVariants] = useState<Variant[]>([])
    const [prodName, setProdName] = useState<string>("")
    const [prodDesctiption, setProdDesctiption] = useState<string>("")
    const [isSaving, setIsSaving] = useState<boolean>(false)
    // click save
    useEffect(() => {
        if (!isSaving) return
        const createData = async () => {
            try {
                const newProduct = await productService.create({
                    productName: prodName,
                    description: prodDesctiption,
                    category: "Demo category",
                    imgUrl: "",
                })
                
                for (let i=0; i<variants.length; i++) {
                    const variant = variants[i]!
                    await variantService.create({
                        ...variant,
                        productId: newProduct.id
                    })
                }
                window.alert("Xong")
                setIsSaving(false)
            } catch (error) {
                window.alert("có lỗi xảy ra")
                console.error("Can't create product: ", error)
                setIsSaving(false)
            }
        }
        createData()
    }, [prodName, prodDesctiption, isSaving, variants])

    const onChangeName = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProdName(e.target.value)
    }, [prodName])

    const onChangeDescription = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProdDesctiption(e.target.value)
    }, [prodDesctiption])

    const addVariant = useCallback((options: Omit<Variant, "id" | "productId">) => {
        const newVariant = new Variant({
            ...options,
            id: "",
            productId: ""
        })
        // variants.push(newVariant)
        const newArr = [...variants, newVariant]
        setVariants(newArr)
    }, [variants])

    const deleleVariant = useCallback((sku: string) => {
        setVariants(pred => pred.filter(v => v.sku !== sku))
    }, [variants])

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
                                onChange={onChangeName}
                            />
                        </div>
                        <div className="col l-6">
                            <TextAreaInput
                                labelName="Mô tả"
                                textareaName="description"
                                textareaId="product-description"
                                placeholder="viết mô tả sản phẩm ở đây"
                                onChange={onChangeDescription}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-form-field w-full">
                <h3>Thêm phân loại</h3>
                <VariantForm variants={variants} addVariant={addVariant} deleteVariant={deleleVariant} />
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