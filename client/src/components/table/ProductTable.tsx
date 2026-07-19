import React from "react";
import Table from "./Table.tsx";
import TableHead from "./TableHead.tsx";
import TableHeading from "./TableHeading.tsx";
import TableRow from "./TableRow.tsx";
import TableBody from "./TableBody.tsx";
import TableData from "./TableData.tsx";
import TableDataImage from "./TableDataImage.tsx";
import TableDataPrice from "./TableDataPrice.tsx";
import TableDataStock from "./TableDataStock.tsx";
import TableDataActions from "./TableDataActions.tsx";
import { NormalButton, DangerButton } from "../button/Button.tsx";
import Link from "next/link";

type Props = {
    listProduct: {
        id: string,
        product_code: number,
        name: string,
        imageURL: string,
        minPrice?: number | null,
        maxPrice?: number | null,
        stock: number
    }[],
    createDeleteEventHandler: (id: string) => (e: React.MouseEvent) => void
}
export default function ProductTable({ listProduct, createDeleteEventHandler }: Props) {
    return (<>
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeading text="CODE" />
                    <TableHeading text="Name" />
                    <TableHeading text="Image" />
                    <TableHeading text="Price" />
                    <TableHeading text="Stock" />
                    <TableHeading text="Actions" />
                </TableRow>
            </TableHead>
            <TableBody>
                {listProduct.map(p => (
                    <TableRow key={p.id} className="odd:bg-white even:bg-gray-100">
                        <TableData data={p.product_code}/>
                        <TableData data={p.name} />
                        <TableDataImage imageURL={p.imageURL} />
                        <TableDataPrice price={{ minPrice: p.minPrice || undefined, maxPrice: p.maxPrice || undefined}} />
                        <TableDataStock stock={p.stock} />
                        <TableDataActions>
                            <NormalButton>
                                <Link
                                    href={`/manager/products/${p.id}`}
                                >
                                    Chi tiết
                                </Link>
                            </NormalButton>
                            <DangerButton onClick={createDeleteEventHandler(p.id)}>Xóa</DangerButton>
                        </TableDataActions>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </>)
}