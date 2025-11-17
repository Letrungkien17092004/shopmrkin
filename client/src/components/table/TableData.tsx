import React from "react";



type Props = {
    data: string | number,
    className?: string
}
export default function TableData({ data, className }: Props) {
    return (<>
        <td className={`p-3 ${className} text-center`}>
            {data}
        </td>
    </>)
}