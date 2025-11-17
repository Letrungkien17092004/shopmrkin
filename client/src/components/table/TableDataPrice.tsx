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
            <td className={`text-center text-red-500 ${className}`}>
                Chưa có giá
            </td>
        </>)
    }
    if (!price.minPrice && price.maxPrice) {
        return (<>
            <td className={`text-center text-green-500 ${className}`}>
                {price.maxPrice}
            </td>
        </>)
    }

    if (price.minPrice && !price.maxPrice) {
        return (<>
            <td className={`text-center text-green-500 ${className}`}>
                {price.minPrice}
            </td>
        </>)
    }

    return (<>
        <td className={`text-center text-green-500 ${className}`}>
            {price.minPrice} - {price.maxPrice}
        </td>
    </>)
}