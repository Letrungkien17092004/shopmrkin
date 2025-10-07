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
import { NormalButton, DangerButton } from "../buttons/Button.tsx";
import { Link } from "react-router-dom";

type Props = {
    listProduct: {
        id: string,
        product_code: number,
        name: string,
        imageURL: string
        minPrice?: number,
        maxPrice?: number
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
                    <TableHeading text="Price" />
                    <TableHeading text="Stock" />
                    <TableHeading text="Actions" />
                </TableRow>
            </TableHead>
            <TableBody>
                {listProduct.map(p => (
                    <TableRow>
                        <TableData data={p.product_code} className="table-data-code" />
                        <TableDataImage imageURL={p.imageURL} />
                        <TableData data={p.name} />
                        <TableDataPrice price={{minPrice: p.maxPrice, maxPrice: p.maxPrice}} />
                        <TableDataStock stock={p.stock} />
                        <TableDataActions>
                            <NormalButton>
                                <Link
                                    style={
                                        {
                                            fontSize: 'inherit',
                                            textDecoration: "none",
                                            color: "inherit"
                                        }}
                                    to={p.id}
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