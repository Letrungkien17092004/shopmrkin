import React from "react";

interface ProductCardProps {
    imgURL: string
    discount: number,
    starPoint: number,
    name: string,
    price: number
}

export default function ProductCard({ imgURL, discount, starPoint, name, price }: ProductCardProps) {
    return (
        <div className="relative w-full shadow-2xl hover:scale-103 hover:ring-1 hover:ring-green-400 transition overflow-hidden rounded">
            <div style={{ backgroundImage: `url(${imgURL})` }} className="pt-[100%] bg-center bg-cover">
            </div>
            {/* if discount == 0 then hide discount */}
            {
                discount > 0 && <>
                    <div className="absolute left-0 top-4 bg-red-500 text-white text-base px-1">
                        -{discount} %
                    </div>
                </>
            }
            <div className="w-full">
                <div className="flex justify-end items-center pr-1">
                    <img className="size-4" src="/public/svg/star-solid-full.svg" alt="product-star"/>
                    <img className="size-4" src="/public/svg/star-solid-full.svg" alt="product-star"/>
                    <img className="size-4" src="/public/svg/star-solid-full.svg" alt="product-star"/>
                    <img className="size-4" src="/public/svg/star-solid-full.svg" alt="product-star"/>
                    <img className="size-4" src="/public/svg/star-solid-full.svg" alt="product-star"/>
                    <span className="pl-2">{starPoint}</span>
                </div>
                <div className="w-full h-12 px-1">
                    <span className="line-clamp-2 text-start">{name}</span>
                </div>
                <div className="w-full flex justify-center pb-2">
                    {/* if discount <=0 then hiden origin price */}
                    {
                        discount > 0
                            ? <>
                                <span className="text-base font-semibold text-orange-600">
                                    {price * ((100 - discount) / 100)}
                                </span>
                                <span className="text-base ml-4 font-semibold text-gray-600 line-through">
                                    {price}
                                </span>
                            </>
                            : <>
                                <span className="text-base font-semibold text-orange-600">
                                    {price}
                                </span>
                            </>
                    }
                </div>
            </div>
        </div>
    )
}