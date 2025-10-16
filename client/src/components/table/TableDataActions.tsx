import React from "react";

interface Props {
    children: React.ReactNode,
    className?: string
}
export default function TableDataActions({children, className}: Props) {
    className = className || ""
    return (<>
        <td className={`table-data-actions ${className}`}>
            {children}
        </td>
    </>)
}