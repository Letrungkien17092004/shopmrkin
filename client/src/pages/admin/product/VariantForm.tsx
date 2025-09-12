import React, { useCallback, useState } from "react";
import { NormalButton, DangerButton } from "../../../components/buttons/Button.tsx";
import { Variant } from "../../../services/ProductService.ts";

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
export default function VariantForm({ variants, variantsDispatch }: { variants: Variant[], variantsDispatch: React.ActionDispatch<[action: VariantReducerAction]> }) {
    const [name, setName] = useState<string>("")
    const [sku, setSku] = useState<string>("")
    const [price, setPrice] = useState<string>("")
    const [stock, setStock] = useState<string>("")

    const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }, [name])

    const onChangeSku = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSku(e.target.value)
    }, [name])

    const onChangePrice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.value)
    }, [name])

    const onChangeStock = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setStock(e.target.value)
    }, [name])

    const onClickAdd = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            if (name.length <= 4) throw new Error("name invalid")
            if (sku.length <= 4) throw new Error("sku invalid")
            if (price.length === 0) throw new Error("price invalid")
            if (stock.length === 0) throw new Error("stock invalid")
            
            variantsDispatch({
                type: "add",
                data: {
                    id: "NOID",
                    name: name,
                    sku: sku,
                    price: Number(price),
                    stock: Number(stock),
                }
            })
        } catch (error) {
            console.log("Variant is invalid")
        }

    }, [name, sku, price, stock])

    const onDeleteBySku = useCallback((sku: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            variantsDispatch({
                type: "delete",
                sku: sku
            })
        }
    }, [])

    return (<>
        <section className="w-full">
            {/* variant input */}
            <div className="variant-form">
                <div className="w-full">
                    <h4>Tên phân loại</h4>
                    <input onChange={onChangeName} className="vf-inp" type="text" />
                </div>
                <div className="w-full">
                    <h4>SKU</h4>
                    <input onChange={onChangeSku} className="vf-inp" type="text" />
                </div>
                <div className="w-full">
                    <h4>Giá</h4>
                    <input onChange={onChangePrice} className="vf-inp" type="number" />
                </div>
                <div className="w-full">
                    <h4>Stock</h4>
                    <input onChange={onChangeStock} className="vf-inp" type="number" />
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