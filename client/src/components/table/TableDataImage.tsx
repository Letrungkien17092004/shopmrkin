import React from "react";

type Props = {
    imageURL: string,
    alt?: string,
    className?: string
}
export default function TableDataImage({ imageURL, alt, className }: Props) {
    className = className || ""
    return (<>
        <td className={`table-data-image ${className}`}>
            <img src={`${imageURL}`} alt={`${alt || imageURL}`} />
        </td>
    </>)
}