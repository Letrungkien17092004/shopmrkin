import React, { useCallback, useEffect, useReducer, useState } from "react";
import { NormalButton } from "../../../components/buttons/Button.tsx";
import ProductService, { Product } from "../../../services/ProductService.ts";
import TextAreaInput from "../../../components/TextAreaInput.tsx";
import VariantModifyForm from "./VariantModifyForm.tsx";


const productService = new ProductService()
// Product modify form
export default function ProductModifyForm({ id }: { id: string }) {
    const [loaded, setLoaded] = useState<boolean>(false)
    const [prod, setProd] = useState<Product | null>(null)
    const [prodName, setProdName] = useState<string>("")
    const [prodDescription, setProdDescription] = useState<string>("")
    const [isSaving, setIsSaving] = useState<boolean>(false)

    // fetch product
    useEffect(() => {
        if (loaded) return
        const fetchProd = async () => {
            try {
                const prod_ = await productService.findById(id)
                if (prod_) {
                    setProd(prod_)
                    setProdName(prod_.productName)
                    setProdDescription(prod_.description)
                }
            } catch (error) {
                window.alert("Có lỗi xảy ra khi load sản phẩm!")
                console.error(error)
            } finally {
                setLoaded(true)
            }
        }

        fetchProd()
    }, [loaded])

    // click save
    useEffect(() => {
        if (!isSaving) return
        if (!prod) return
        const modifyData = async () => {
            try {
                const updated = await productService.updateById(prod.id, {
                    productName: prodName,
                    description: prodDescription
                })
                window.alert("Xong!")
            } catch (error) {
                window.alert("có lỗi xảy ra")
                console.error("Can't create product: ", error)
            } finally {
                setIsSaving(false)
            }
        }
        modifyData()
    }, [prodName, prodDescription, isSaving])

    const onChangeName = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProdName(e.target.value)
    }, [prodName])

    const onChangeDescription = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProdDescription(e.target.value)
    }, [prodDescription])

    const onClickSave = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setIsSaving(true)
    }, [])

    if (loaded && !prod) {
        return <h1>Không tìm thấy sản phẩm này</h1>
    }

    if (loaded && prod) {
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
                                    value={prodName}
                                    onChange={onChangeName}
                                />
                            </div>
                            <div className="col l-6">
                                <TextAreaInput
                                    labelName="Mô tả"
                                    textareaName="description"
                                    textareaId="product-description"
                                    placeholder="viết mô tả sản phẩm ở đây"
                                    value={prodDescription}
                                    onChange={onChangeDescription}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="product-form-field w-full">
                    <h3>Thêm phân loại</h3>
                    <VariantModifyForm id={prod.id} isSaving={isSaving}/>
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

    return <h1>loading</h1>
}