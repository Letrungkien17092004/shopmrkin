import React from "react";
import "./button.css"

export function DangerButton({ children, onClick }: { children: string | React.ReactElement, onClick?: React.MouseEventHandler}) {

    return (<>
        <button onClick={onClick} className="btn btn-danger">{children}</button>
    </>)
}


interface NormalButtonProps {
    children: React.ReactNode,
    className?: string,
    onClick?: React.MouseEventHandler
}
export function NormalButton({ children, className,onClick }: NormalButtonProps) {
    return (<>
        <button onClick={onClick}  className={`btn btn-blue ${className}`}>{children}</button>
    </>)
}