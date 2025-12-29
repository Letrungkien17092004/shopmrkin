import React from "react";

export function DangerButton({ children, onClick }: { children: string | React.ReactElement, onClick?: React.MouseEventHandler}) {

    return (<>
        <button onClick={onClick} className="cursor-pointer p-1 font-semibold bg-red-500 text-amber-50 min-w-14 rounded hover:scale-102 transition">{children}</button>
    </>)
}


interface NormalButtonProps {
    children: React.ReactNode,
    className?: string,
    onClick?: React.MouseEventHandler
}
export function NormalButton({ children, className,onClick }: NormalButtonProps) {
    return (<>
        <button onClick={onClick}  className={`cursor-pointer p-1 font-semibold bg-blue-500 text-white  min-w-14 rounded hover:scale-102 transition`}>{children}</button>
    </>)
}