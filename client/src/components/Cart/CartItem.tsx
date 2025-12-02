import React from "react";

interface CartItemProps  {
    key: string
    imgUrl?: string
    productName: string
    variantName: string
    quantity: number
    price: number
}

const defaultCartImage = "https://down-vn.img.susercontent.com/file/vn-11134207-820l4-metxmobo5f5wf2@resize_w900_nl.webp";

function formatPrice(value: number) {
    if (typeof value === 'number') return value.toLocaleString('vi-VN') + ' đ';
    return value;
}

export default function CartItem({ key, imgUrl = defaultCartImage, productName, variantName, quantity, price }: CartItemProps) {
    return (
        <li key={key} className="p-2 hover:bg-gray-100 cursor-pointer">
            <div className="w-full flex">
                <div className="size-20">
                    <img className="w-full h-full object-contain aspect-square" src={imgUrl} alt={imgUrl} />
                </div>
                <div className="pl-2 w-[60%]">
                    <p title="product name" className="text-sm font-semibold line-clamp-2 text-start">
                        {productName}
                    </p>

                    <p title="variant name" className="text-sm font-light line-clamp-2 text-start truncate">
                        {variantName}
                    </p>

                    <p className="text-sm font-semibold line-clamp-2 text-start truncate text-orange-500">
                        {formatPrice(price)}
                    </p>
                </div>
                <div className="ml-2 grow flex justify-center items-center gap-x-3">
                    <div className="cursor-pointer p-1 hover:scale-130 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                            <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="text-base rounded-full font-semibold text-orange-500">
                        {quantity}
                    </div>
                    <div className="cursor-pointer p-1 hover:scale-130 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </li>
    );
}
