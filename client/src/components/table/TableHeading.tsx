import React, { type ReactHTMLElement } from "react";

type Props = {
    text: string
}
export default function TableHeading({text}: Props) {
    return (<>
        <th>
            {text}
        </th>
    </>)
}