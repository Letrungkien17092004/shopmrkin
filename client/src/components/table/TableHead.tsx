import React from "react";

type Props = {
    children: React.ReactElement[] | React.ReactElement,
    className?: string
}
export default function TableHead({children, className}: Props) {
    className = className || "" 
    return (<>
        <thead className={className}>
            {children}
        </thead>
    </>)
}