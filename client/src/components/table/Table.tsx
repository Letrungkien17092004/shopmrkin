import React from "react";

type Props = {
    children: React.ReactElement[],
    className?: string
}
export default function Table({children, className}: Props) {
    className = className || ""
    return (<>
    <div className={`table text-sm font-normal ${className}`}>
        {children}
    </div>
    </>)
}