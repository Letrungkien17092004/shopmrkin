import React, { useCallback, useEffect, useReducer, useState } from "react";
import { NormalButton, DangerButton } from "../../../components/buttons/Button.tsx";
import VariantService, { Variant, validVariant } from "../../../services/VariantService.ts";

const variantService = new VariantService()

type ExtendedVariant = Variant & {
    state: "original" | "modified" | "delete" | "new"
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

type CreateFieldData = { name: string, sku: string, price: string, stock: string }
type EditFielData = { name: string, sku: string, price: string, stock: string }
type Props = {
    id: string,
    savingState: "nosaving" | "saving" | "done" | "error",
    setSavingState: (value: React.SetStateAction<"nosaving" | "saving" | "done" | "error">) => void
}
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

export default function VariantModifyForm({ id, savingState, setSavingState }: Props) {
    const [createField, setCreateField] = useState<CreateFieldData>({
        name: "",
        sku: "",
        price: "",
        stock: "",
    })

    const [editField, setEditField] = useState<EditFielData>({
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
            const variantsData = await variantService.getManyByProductId(id)
            const varianstInitState: ExtendedVariant[] = variantsData.map(v => ({
                ...v,
                state: "original"
            }))
            variantsDispatch({
                type: "init",
                variants: varianstInitState
            })
        }

        fetdata()
    }, [])

    // disable variant have state === "delete" 
    useEffect(() => {
        const filted = variants.filter(v => v.state !== "delete")
        setVarForRender(filted)
    }, [variants])

    // on saving
    useEffect(() => {
        const handler = async () => {

            if (savingState !== "saving") return
            let count = 3
            const forUpdate = variants.filter(v => v.state === "modified")
            const forCreate = variants.filter(v => v.state === "new")
            const forDelete = variants.filter(v => v.state === "delete")

            // if there is nothing to update
            if (forUpdate.length + forCreate.length + forDelete.length === 0) {
                setSavingState("done")
                return
            }

            /**
             * count dùng để đếm xem có bao nhiêu cái thành công
             * ban đầu ta giả định cả 3 đều thành công (count = 3)
             * nếu forUpdate hoặc forCreate, forDelete có tồn tại 
             * phần tử (tức là cần update, create, delete) ta sẽ
             * trừ cho 1 để không đánh dấu là thành công nữa và nó
             * sẽ được quyết định khi gọi API, nếu sau khi gọi API
             * thành công, ta tăng count để đánh dấu là đã xong
             * cuối cùng, ta check count. nếu count === 3 thì tất 
             * cả thành công, ta set SavingState = Done, nếu không
             * ta set là error
             */
            if (forUpdate.length !== 0) {
                count -= 1
            }

            if (forCreate.length !== 0) {
                count -= 1
            }

            if (forDelete.length !== 0) {
                count -= 1
            }
            const updateData = async () => {
                for (let i = 0; i < forUpdate.length; i++) {
                    try {
                        console.log("run update")
                        const item = forUpdate[i]!
                        await variantService.updateById(item.id, {
                            name: item.name,
                            // sku: item.sku,
                            price: item.price,
                            stock: item.stock
                        })
                        console.log("Update variant successfully")
                        count++
                    } catch (error) {
                        console.error("Error when update variant: ", error)
                    }
                }
            }

            const createData = async () => {
                for (let i = 0; i < forCreate.length; i++) {
                    try {
                        console.log("run create")
                        const item = forCreate[i]!
                        await variantService.create({
                            name: item.name,
                            sku: item.sku,
                            price: item.price,
                            stock: item.stock,
                            productId: item.productId,
                            userId: item.userId
                        })
                        console.log("Create variant successfully")
                        count++
                    } catch (error) {
                        console.error("Error when create variant: ", error)
                    }
                }
            }

            const deleteData = async () => {
                for (let i = 0; i < forDelete.length; i++) {
                    try {
                        console.log("run delete")
                        const item = forDelete[i]!
                        await variantService.deleteById(item.id)
                        console.log("Delete variant successfully")
                        count++
                    } catch (error) {
                        console.error("Error when delete variant: ", error)
                    }
                }
            }

            await updateData()
            await createData()
            await deleteData()
            if (count === 3) {
                setSavingState("done")
            } else {
                setSavingState("error")
            }
        }
        handler()
    }, [savingState])

    // create event handler for CreateField
    const generateOnChangeForm = useCallback((fieldToChange: keyof CreateFieldData) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation()
            createField[fieldToChange] = e.target.value
            setCreateField({
                ...createField
            })
        }
    }, [createField])

    // create event hander when user click add on create-form
    const onAddVariant = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        const newVariant: Variant = {
            id: "",
            name: createField.name,
            sku: createField.sku,
            price: Number(createField.price),
            stock: Number(createField.stock),
            productId: id,
            userId: ""
        }

        const isValid = validVariant(newVariant)
        if (isValid) {
            variantsDispatch({
                type: "add",
                variant: {
                    ...newVariant,
                    state: "new"
                }
            })
        }
    }, [createField])


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

    // create event hander, select which variant is being edited
    const changeToUpdateState = useCallback((sku: string) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            const variantToUpdate = variants.find(v => v.sku === sku)
            if (!variantToUpdate) { throw new Error("variant not found") }
            setEditField({
                name: variantToUpdate.name,
                sku: variantToUpdate.sku,
                price: `${variantToUpdate.price}`,
                stock: `${variantToUpdate.stock}`,
            })
            setMarkedSku(sku)
        }
    }, [variants])

    // create event hander, update each property of the variant being edited
    const updateFieldOnTable = useCallback((fieldName: keyof EditFielData) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation()
            editField[fieldName] = e.target.value
            setEditField({
                ...editField
            })
        }
    }, [editField])

    // create event handler, handle when user clicks "done" when editing variation
    const clickDone = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        const variant: Variant = {
            id: "",
            name: editField.name,
            sku: editField.sku,
            price: Number(editField.price),
            stock: Number(editField.stock),
            productId: id,
            userId: ""
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
    }, [editField, markedSku])

    // Create event handler, handle when user click "cancel" when editing variant
    const clickCancel = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setEditField({
            name: "",
            sku: "",
            price: "",
            stock: "",
        })
        setMarkedSku(null)
    }, [])
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
                                        {v.sku}
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