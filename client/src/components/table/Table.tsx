import React from "react";

type Props = {
    children: React.ReactNode,
    className?: string
}
export default function Table({children, className}: Props) {
    className = className || ""
    return (<>
    <table className={`table text-sm font-normal ${className}`}>
        {children}
    </table>
    </>)
}