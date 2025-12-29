import React, { useCallback, useState } from "react";
import { useCreateProduct } from "../../contexts/CreateProductContext.tsx";
import { NormalButton, DangerButton } from "../button/Button.tsx";
import { Input } from "../inputs/index.tsx"
import { NoticeManager } from "../notifications/index.tsx"
import { useNoticeManager } from "../../hooks/index.ts"
import { formatPrice } from "../../utils/index.ts";
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
    const { noticeList, pushMessage } = useNoticeManager()

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

        const found = variants.find(v => v.sku === formData.sku)
        // if SKU already exist
        if (found) {
            pushMessage({
                message: "SKU này đã tồn tại",
                noticeType: "error"
            })
            return
        }

        if (formData.sku.length < 5 || formData.name.length < 5) {
            pushMessage({
                message: "SKU và tên dài hơn 5 ký tự",
                noticeType: "error"
            })
            return
        }

        const splitedSku = formData.sku.split("")
        if (splitedSku.includes(" ")) {
            pushMessage({
                message: "SKU không được có khoảng trắng",
                noticeType: "error"
            })
            return
        }

        if (formData.price == "" || formData.stock == "" ) {
            pushMessage({
                message: "Giá và Stock không hợp lệ",
                noticeType: "error"
            })
            return
        }
        addVariant({
            name: formData.name,
            sku: formData.sku,
            price: Number(formData.price),
            stock: Number(formData.stock),
        })
    }, [variants, formData])

    // Create Delete event handler
    const createDeleteEventHandler = useCallback((sku: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            deleteVariant(sku)
        }
    }, [variants])

    return (<>
        <section className="pl-2 w-full">
            <NoticeManager noticeList={noticeList} />
            {/* variant input */}
            <div className="py-2 flex">
                <div className="not-first:ml-3">
                    <label>SKU</label>
                    <Input
                        type="text"
                        onChange={createFormDataEventHandler("sku")}
                        placeHolder="iphone_air_256"
                    />
                </div>
                <div className="not-first:ml-3">
                    <label>Tên phân loại</label>
                    <Input
                        type="text"
                        onChange={createFormDataEventHandler("name")}
                        placeHolder="Bản 256GB"
                    />
                </div>
                <div className="not-first:ml-3">
                    <label>Giá</label>
                    <Input type="number"
                        onChange={createFormDataEventHandler("price")}
                        placeHolder="20000000"
                    />
                </div>
                <div className="not-first:ml-3">
                    <label>Stock</label>
                    <Input
                        type="number"
                        onChange={createFormDataEventHandler("stock")}
                        placeHolder="100"
                    />
                </div>

                <div className="not-first:ml-3 content-center pt-6">
                    <NormalButton onClick={onAddVariant}>Thêm</NormalButton>
                </div>
            </div>

            {/* variant list */}
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
                            <TableRow className="even:bg-gray-200">
                                <TableData data={v.sku} />
                                <TableData data={v.name} />
                                <TableDataPrice price={{ maxPrice: v.price }} />
                                <TableData data={v.stock} />
                                <TableDataActions>
                                    <DangerButton
                                        onClick={createDeleteEventHandler(v.sku)}
                                    >
                                        Xóa
                                    </DangerButton>
                                </TableDataActions>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    </>)
}