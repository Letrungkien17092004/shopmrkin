import React from "react";


type Props = {
    price: {
        minPrice?: number,
        maxPrice?: number
    },
    className?: string
}
export default function TableDataPrice({ price, className }: Props) {
    if (!price.minPrice && !price.maxPrice) {
        return (<>
            <td className={`table-data-price ${className}`}>
                Chưa có giá
            </td>
        </>)
    }
    if (!price.minPrice && price.maxPrice) {
        return (<>
            <td className={`table-data-price ${className}`}>
                {price.maxPrice}
            </td>
        </>)
    }

    if (price.minPrice && !price.maxPrice) {
        return (<>
            <td className={`table-data-price ${className}`}>
                {price.minPrice}
            </td>
        </>)
    }

    return (<>
        <td className={`table-data-price ${className}`}>
            {price.minPrice} - {price.maxPrice}
        </td>
    </>)
}