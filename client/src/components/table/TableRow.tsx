import React from "react";

type Props = {
    children: React.ReactElement[] | React.ReactElement,
    className?: string
}
export default function TableRow({children, className}: Props) {
    className = className || "" 
    return (<>
        <tr className={className}>
            {children}
        </tr>
    </>)
}