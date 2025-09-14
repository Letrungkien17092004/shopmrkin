import React, { useCallback, useReducer, useState } from "react";
import { NormalButton, DangerButton } from "../../../components/buttons/Button.tsx";
import VariantService, { Variant } from "../../../services/VariantService.ts";

const variantService = new VariantService()

type VariantField = {
    name: string,
    sku: string,
    price: string,
    stock: string
}

type VariantFieldReducerAction = {
    type: "change",
    field: VariantField
}

type VariantCreateFormProp = {
    variants: Variant[],
    addVariant: (options: Omit<Variant, "id" | "productId">) => void
    deleteVariant: (sku: string) => void
}
function variantFieldRecuder(state: VariantField, action: VariantFieldReducerAction): VariantField {
    switch (action.type) {
        case "change":
            return {
                ...action.field
            }
    }
}

export default function VariantCreateForm({ variants, addVariant, deleteVariant }: VariantCreateFormProp) {

    const [variantField, variantFieldDispatch] = useReducer(variantFieldRecuder, {
        name: "",
        sku: "",
        price: "",
        stock: ""
    })

    const createOnChange = useCallback((fieldName: keyof VariantField) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation()
            const newField = {
                ...variantField
            }

            newField[`${fieldName}`] = e.target.value
            variantFieldDispatch({
                type: "change",
                field: newField
            })
        }
    }, [variantField])


    const onDeleteBySku = useCallback((sku: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            if (!window.confirm("Xóa phân loại sku: " + sku)) return
            deleteVariant(sku)
        }
    }, [deleteVariant])

    const onClickAdd = useCallback(() => {
        try {
            if (variantField.name.length < 5) { throw new Error("invalid data") }
            if (variantField.sku.length < 5) { throw new Error("invalid data") }
            if (variantField.price.length < 1) { throw new Error("invalid data") }
            if (variantField.stock.length === 0) { throw new Error("invalid data") }
            if (variants.find(v => v.sku === variantField.sku)) { throw new Error("invalid data: sku") }
            addVariant({
                name: variantField.name,
                sku: variantField.sku,
                price: Number(variantField.price),
                stock: Number(variantField.stock)
            })
        } catch (error) {
            console.error(error)
        }
    }, [variantField, addVariant, variants])

    return (<>
        <section className="w-full">
            {/* variant input */}
            <div className="variant-form">
                <div className="w-full">
                    <h4>Tên phân loại</h4>
                    <input onChange={createOnChange("name")} className="vf-inp" type="text" />
                </div>
                <div className="w-full">
                    <h4>SKU</h4>
                    <input onChange={createOnChange("sku")} className="vf-inp" type="text" />
                </div>
                <div className="w-full">
                    <h4>Giá</h4>
                    <input onChange={createOnChange("price")} className="vf-inp" type="number" />
                </div>
                <div className="w-full">
                    <h4>Stock</h4>
                    <input onChange={createOnChange("stock")} className="vf-inp" type="number" />
                </div>
                <div className="w-full flex flex-center">
                    <NormalButton onClick={onClickAdd}>Thêm</NormalButton>
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
                        {variants.map(v => (
                            <tr key={v.sku}>
                                <td>{v.name}</td>
                                <td>{v.sku}</td>
                                <td className="vt-price">{v.price}đ</td>
                                <td>{v.stock}</td>
                                <td className="vt-actions">
                                    <DangerButton onClick={onDeleteBySku(v.sku)}>Xóa</DangerButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    </>)
}