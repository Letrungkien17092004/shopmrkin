import React from "react";


type Props = {
    stock: number,
    className?: string
}
export default function TableDataStock({ stock, className }: Props) {
    return (<>
        <td className={`table-data-stock ${className}`}>
            {stock}
        </td>
    </>)
}