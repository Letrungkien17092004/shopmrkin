import React from "react";

type Props = {
    children: React.ReactElement[] | React.ReactElement
    className?: string
}
export default function TableBody({children, className}: Props) {
    className = className || ""
    return (<>
        <tbody className={className}>
            {children}
        </tbody>
    </>)
}