import React, { useCallback, useEffect, useReducer, useState } from "react";
import { DangerButton, NormalButton } from "../../../components/buttons/Button.tsx";
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
    const [productSavingState, setProductSavingState] = useState<"nosaving" | "saving" | "done" | "error">("nosaving")
    const [variantsSavingState, setVariantsSavingState] = useState<"nosaving" | "saving" | "done" | "error">("nosaving")
    const [totalSavingState, setTotalSavingState] = useState<"nosaving" | "saving" | "done" | "error">("nosaving")
    const [isChanged, setIsChanged] = useState<boolean>(false)

    // fetch product
    useEffect(() => {
        if (loaded) return
        const fetchProd = async () => {
            try {
                const prod_ = await productService.findById(id)
                if (prod_) {
                    setProd(prod_)
                    setProdName(prod_.name)
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

    // handle save product
    useEffect(() => {
        if (productSavingState !== "saving") return
        if (!isChanged) {
            setProductSavingState("done")
            return
        }
        if (!prod) return

        const modifyData = async () => {
            try {
                const updated = await productService.updateById(prod.id, {
                    name: prodName,
                    description: prodDescription
                })
                setProductSavingState("done")
            } catch (error) {
                setProductSavingState("error")
                console.error("Can't create product: ", error)
            }
        }
        modifyData()
    }, [prodName, prodDescription, productSavingState])

    // update total saving state when all update is done
    useEffect(() => {
        if (totalSavingState !== "saving") { return }
        if (productSavingState === "done" && variantsSavingState === "done") {
            setTotalSavingState("done")
            return
        }
        if (productSavingState === "error" || variantsSavingState === "error") {
            setTotalSavingState("error")
            return
        }
    }, [productSavingState, variantsSavingState, totalSavingState])

    // Create event handler, set product name
    const onChangeName = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setIsChanged(true)
        setProdName(e.target.value)
    }, [prodName])

    // Create event handler, set product description
    const onisChangedescription = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setIsChanged(true)
        setProdDescription(e.target.value)
    }, [prodDescription])

    // Craete event handler, handle when user clicks "save"
    const onClickSave = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setProductSavingState("saving")
        setVariantsSavingState("saving")
        setTotalSavingState("saving")
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
                                    onChange={onisChangedescription}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="product-form-field w-full">
                    <h3>Thêm phân loại</h3>
                    <VariantModifyForm id={prod.id} savingState={variantsSavingState} setSavingState={setVariantsSavingState} />
                </div>

                <div className="dash-dark"></div>
                <div className="w-full">
                    {totalSavingState === "saving"
                        ? <NormalButton>Đang xử lý</NormalButton>
                        :
                        totalSavingState === "nosaving"
                            ? <NormalButton onClick={onClickSave}>Lưu</NormalButton>
                            :
                            totalSavingState === "done"
                                ? <NormalButton>Xong</NormalButton>
                                : <DangerButton>Có lỗi xảy ra</DangerButton>
                    }
                </div>
            </section>
        </>)
    }

    return <h1>loading</h1>
}