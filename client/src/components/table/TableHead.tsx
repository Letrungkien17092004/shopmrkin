import React from "react";

type Props = {
    children: React.ReactNode,
}
export default function TableHead({children}: Props) {
    return (<>
        <thead className="bg-gray-200">
            {children}
        </thead>
    </>)
}