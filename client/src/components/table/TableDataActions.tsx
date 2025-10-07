import React from "react";

type Props = {
    children: React.ReactElement[] | React.ReactElement,
}
export default function TableDataActions({children}: Props) {
    return (<>
        <td className="table-data-actions">
            {children}
        </td>
    </>)
}