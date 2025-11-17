import React from "react";

type Props = {
    children: React.ReactNode,
}
export default function Table({ children }: Props) {
    return (<>
        <table className="border-separate border-spacing-0 rounded-lg overflow-hidden text-sm font-normal w-full">
            {children}
        </table>
    </>)
}