import React from "react";

interface Props {
    children: React.ReactNode,
    className?: string
}
export default function TableDataActions({children, className}: Props) {
    className = className || ""
    return (<>
        <td className={`flex flex-col gap-y-2 justify-center items-center py-4 ${className}`}>
            {children}
        </td>
    </>)
}