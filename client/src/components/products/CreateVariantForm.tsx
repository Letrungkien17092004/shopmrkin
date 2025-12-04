import React, { useCallback, useState } from "react";
import { useCreateProduct } from "../../contexts/CreateProductContext.tsx";
import { NormalButton, DangerButton } from "../button/Button.tsx";
import { Input } from "../inputs/index.tsx"
import { Table, TableHead, TableBody, TableRow, TableHeading, TableData, TableDataPrice, TableDataActions } from "../table/index.ts"

interface VariantType {
    name: string,
    sku: string,
    price: string,
    stock: string
}

export default function CreateVariantForm() {
    const [formData, setFormData] = useState<VariantType>({
        name: "",
        sku: "",
        price: "",
        stock: ""
    })
    const { variants, addVariant, deleteVariant } = useCreateProduct()

    const createFormDataEventHandler = useCallback((fieldName: keyof VariantType) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation()
            setFormData({
                ...formData,
                [fieldName]: e.target.value
            })
        }
    }, [formData])

    // Create Add event handler
    const onAddVariant = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        addVariant({
            name: formData.name,
            sku: formData.sku,
            price: Number(formData.price),
            stock: Number(formData.stock),
        })
    }, [formData])

    // Create Delete event handler
    const createDeleteEventHandler = useCallback((sku: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            deleteVariant(sku)
        }
    }, [variants])

    return (<>
        <section className="w-full">
            {/* variant input */}
            <div className="p-3 flex">
                <div className="ml-3">
                    <label>SKU</label>
                    <Input type="text" onChange={createFormDataEventHandler("sku")} />
                </div>
                <div className="ml-3">
                    <label>Tên phân loại</label>
                    <Input type="text" onChange={createFormDataEventHandler("name")} />
                </div>
                <div className="ml-3">
                    <label>Giá</label>
                    <Input type="number" onChange={createFormDataEventHandler("price")} />
                </div>
                <div className="ml-3">
                    <label>Stock</label>
                    <Input type="number" onChange={createFormDataEventHandler("stock")} />
                </div>

                <div className="ml-3 content-center pt-4">
                    <NormalButton onClick={onAddVariant}>Thêm</NormalButton>
                </div>
            </div>

            {/* variant list */}
            <div className="dash-dark"></div>
            <div className="w-full">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeading text="SKU" />
                            <TableHeading text="Name" />
                            <TableHeading text="Price" />
                            <TableHeading text="Stock" />
                            <TableHeading text="Actions" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {variants.map(v => (
                            <TableRow>
                                <TableData data={v.sku} />
                                <TableData data={v.name} />
                                <TableDataPrice price={{ maxPrice: v.price }} />
                                <TableData data={v.stock} />
                                <TableDataActions>
                                    No actions
                                </TableDataActions>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    </>)
}