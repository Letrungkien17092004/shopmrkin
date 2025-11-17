import React from "react";


type Props = {
    stock: number,
    className?: string
}
export default function TableDataStock({ stock, className }: Props) {
    return (<>
        <td className={`text-center ${className}`}>
            {
                stock>=10?<span className="text-green-400">{stock}</span>:<span className="text-red-400">{stock}</span>
            }
        </td>
    </>)
}