import React from "react";

type Props = {
    children: React.ReactNode
    className?: string
}
export default function TableBody({children, className}: Props) {
    return (<>
        <tbody className="">
            {children}
        </tbody>
    </>)
}