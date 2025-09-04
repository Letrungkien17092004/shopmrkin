import React from "react";


export function DangerButton({ children, onClick }: { children: string | React.ReactElement, onClick?: React.MouseEventHandler}) {

    return (<>
        <button onClick={onClick} className="btn btn-danger">{children}</button>
    </>)
}

export function NormalButton({ children, onClick }: { children: string | React.ReactElement, onClick?: React.MouseEventHandler}) {
    return (<>
        <button onClick={onClick}  className="btn btn-blue">{children}</button>
    </>)
}