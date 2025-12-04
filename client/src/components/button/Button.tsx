import React from "react";

export function DangerButton({ children, onClick }: { children: string | React.ReactElement, onClick?: React.MouseEventHandler}) {

    return (<>
        <button onClick={onClick} className="cursor-pointer p-1 ring-2 ring-red-400 rounded text-red-400 hover:scale-105 transition">{children}</button>
    </>)
}


interface NormalButtonProps {
    children: React.ReactNode,
    className?: string,
    onClick?: React.MouseEventHandler
}
export function NormalButton({ children, className,onClick }: NormalButtonProps) {
    return (<>
        <button onClick={onClick}  className={`cursor-pointer p-1 ring-2 ring-sky-400 rounded text-sky-400 hover:scale-105 transition`}>{children}</button>
    </>)
}