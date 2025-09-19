import React, { useCallback, useEffect, useReducer, useState } from "react";
import { NormalButton, DangerButton } from "../../../components/buttons/Button.tsx";
import VariantService, { Variant, validVariant } from "../../../services/VariantService.ts";

const variantService = new VariantService()

type ExtendedVariant = Variant & {
    state: "not_modify" | "modified" | "delete"
}

type VariantReducerAction = (
    | {
        type: "init",
        variants: ExtendedVariant[]
    }
    | {
        type: "add",
        variant: ExtendedVariant
    }

    | {
        type: "modify",
        sku: string,
        dataToModify: Partial<ExtendedVariant>
    }

    | {
        type: "delete",
        sku: string
    }
)

type FieldData = { name: string, sku: string, price: string, stock: string }

function variantsReducer(state: ExtendedVariant[], action: VariantReducerAction) {
    switch (action.type) {
        case "init":
            return action.variants
        case "add":
            return [
                ...state,
                action.variant
            ]
        case "modify":
            const variant = state.find(v => v.sku === action.sku)
            if (!variant) { throw new Error("variant not found") }
            variant.name = action.dataToModify?.name || variant.name
            variant.sku = action.dataToModify?.sku || variant.sku
            variant.price = action.dataToModify?.price || variant.price
            variant.stock = action.dataToModify?.stock || variant.stock
            variant.state = "modified"
            return [
                ...state
            ]

        case "delete":
            const variantToDel = state.find(v => v.sku === action.sku)
            if (!variantToDel) { throw new Error("variant not found") }
            variantToDel.state = "delete"
            return [
                ...state
            ]
    }
}

export default function VariantModifyForm({ id, isSaving }: { id: string, isSaving: boolean }) {
    const [fieldData, setFieldData] = useState<FieldData>({
        name: "",
        sku: "",
        price: "",
        stock: "",
    })

    const [updateData, setUpdateData] = useState<FieldData>({
        name: "",
        sku: "",
        price: "",
        stock: "",
    })

    const [variants, variantsDispatch] = useReducer(variantsReducer, [])
    const [markedSku, setMarkedSku] = useState<string | null>(null)
    const [varForRender, setVarForRender] = useState<ExtendedVariant[]>([])
    // init variant
    useEffect(() => {
        const fetdata = async () => {
            const variants_ = await variantService.getManyByProductId(id)
            const _: ExtendedVariant[] = variants_.map(v => ({
                ...v,
                state: "not_modify"
            }))
            variantsDispatch({
                type: "init",
                variants: _
            })
        }

        fetdata()
    }, [])

    // disable variant have state === "delete" 
    useEffect(() => {
        const filted = variants.filter(v => v.state !== "delete")
        setVarForRender(filted)
    }, [variants])


    // auto generate onChange handler by key of FieldData
    const generateOnChangeForm = useCallback((fieldToChange: keyof FieldData) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation()
            fieldData[fieldToChange] = e.target.value
            setFieldData({
                ...fieldData
            })
        }
    }, [fieldData])

    // handler when click add Variant
    const onAddVariant = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        const newVariant: Variant = {
            id: "",
            name: fieldData.name,
            sku: fieldData.sku,
            price: Number(fieldData.price),
            stock: Number(fieldData.stock),
            productId: id
        }

        const isValid = validVariant(newVariant)
        if (isValid) {
            variantsDispatch({
                type: "add",
                variant: {
                    ...newVariant,
                    state: "not_modify"
                }
            })
        }
    }, [fieldData])


    // delete variant
    const onDeleteVariant = useCallback((sku: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            variantsDispatch({
                type: "delete",
                sku: sku
            })
        }
    }, [variants])

    // change variant need update
    const changeToUpdateState = useCallback((sku: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            const variantToUpdate = variants.find(v => v.sku === sku)
            if (!variantToUpdate) { throw new Error("variant not found") }
            setUpdateData({
                name: variantToUpdate.name,
                sku: variantToUpdate.sku,
                price: `${variantToUpdate.price}`,
                stock: `${variantToUpdate.stock}`,
            })
            setMarkedSku(sku)
        }
    }, [variants])

    // auto generate update on table handler each field
    const updateFieldOnTable = useCallback((fieldName: keyof FieldData) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation()
            updateData[fieldName] = e.target.value
            setUpdateData({
                ...updateData
            })
        }
    }, [updateData])

    // update on table done
    const clickDone = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        const variant: Variant = {
            id: "",
            name: updateData.name,
            sku: updateData.sku,
            price: Number(updateData.price),
            stock: Number(updateData.stock),
            productId: id
        }

        if (!validVariant(variant)) {
            console.log(variant)
            window.alert("Dữ liệu không hợp lệ!")
            return
        }

        if (!markedSku) { throw new Error("sku is null when update") }
        variantsDispatch({
            type: "modify",
            sku: markedSku,
            dataToModify: variant
        })
        setMarkedSku(null)
    }, [updateData])

    const clickCancel = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setUpdateData({
            name: "",
            sku: "",
            price: "",
            stock: "",
        })
        setMarkedSku(null)
    }, [updateData])
    return (<>
        <section className="w-full">
            {/* variant input */}
            <div className="variant-form">
                <div className="w-full">
                    <h4>Tên phân loại</h4>
                    <input onChange={generateOnChangeForm("name")} className="vf-inp" type="text" />
                </div>
                <div className="w-full">
                    <h4>SKU</h4>
                    <input onChange={generateOnChangeForm("sku")} className="vf-inp" type="text" />
                </div>
                <div className="w-full">
                    <h4>Giá</h4>
                    <input onChange={generateOnChangeForm("price")} className="vf-inp" type="number" />
                </div>
                <div className="w-full">
                    <h4>Stock</h4>
                    <input onChange={generateOnChangeForm("stock")} className="vf-inp" type="number" />
                </div>
                <div className="w-full flex flex-center">
                    <NormalButton onClick={onAddVariant}>Thêm</NormalButton>
                </div>
            </div>

            {/* variant list */}
            <div className="dash-dark"></div>
            <div className="w-full variant-table-wrapper">
                <table className="variant-table text-base">
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>SKU</th>
                            <th>Giá</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {varForRender.map(v => (
                            v.sku === markedSku
                                // if is update then render form
                                ? (<tr key={v.sku}>
                                    <td>
                                        <input onChange={updateFieldOnTable("name")} defaultValue={v.name} type="text" className="vf-inp" />
                                    </td>
                                    <td>
                                        <input onChange={updateFieldOnTable("sku")} defaultValue={v.sku} type="text" className="vf-inp" />
                                    </td>
                                    <td className="vt-price">
                                        <input onChange={updateFieldOnTable("price")} defaultValue={v.price} type="number" className="vf-inp" />
                                    </td>
                                    <td>
                                        <input onChange={updateFieldOnTable("stock")} defaultValue={v.stock} type="number" className="vf-inp" />
                                    </td>
                                    <td className="vt-actions">
                                        <NormalButton onClick={clickDone}>Xong</NormalButton>
                                        <DangerButton onClick={clickCancel}>Hủy</DangerButton>
                                    </td>
                                </tr>)
                                // otherwise
                                : (<tr key={v.sku}>
                                    <td>{v.name}</td>
                                    <td>{v.sku}</td>
                                    <td className="vt-price">{v.price}đ</td>
                                    <td>{v.stock}</td>
                                    <td className="vt-actions">
                                        <NormalButton onClick={changeToUpdateState(v.sku)}>Sửa</NormalButton>
                                        <DangerButton onClick={onDeleteVariant(v.sku)}>Xóa</DangerButton>
                                    </td>
                                </tr>
                                )

                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    </>)
}