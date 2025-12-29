import React from "react";
import { formatPrice } from "../../utils/index.ts"

interface ProductCardProps {
    imgURL: string
    discount: number,
    starPoint: number,
    name: string,
    price?: number | null
}

export default function ProductCard({ imgURL, discount, starPoint, name, price = 1 }: ProductCardProps) {
    return (
        <div className="relative w-full shadow-2xl hover:scale-101 hover:ring-1 hover:ring-green-300 transition overflow-hidden rounded">
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
                    <img className="size-4" src="/public/svg/star-solid-full.svg" alt="product-star" />
                    <img className="size-4" src="/public/svg/star-solid-full.svg" alt="product-star" />
                    <img className="size-4" src="/public/svg/star-solid-full.svg" alt="product-star" />
                    <img className="size-4" src="/public/svg/star-solid-full.svg" alt="product-star" />
                    <img className="size-4" src="/public/svg/star-solid-full.svg" alt="product-star" />
                    <span className="pl-2">{starPoint}</span>
                </div>
                <div className="w-full h-12 px-1">
                    <span className="line-clamp-2 text-start">{name}</span>
                </div>
                <div className="w-full flex justify-around items-center pb-2">
                    {/* if discount <=0 then hiden origin price */}
                    {
                        discount > 0
                            ? <>
                                <span className="text-base font-semibold text-orange-600">
                                    {formatPrice((price || 0) * ((100 - discount) / 100))}
                                </span>
                                <span className="text-base ml-4 font-semibold text-gray-600 line-through">
                                    {formatPrice(price || 0)}
                                </span>
                            </>
                            : <>
                                <span className="text-base font-semibold text-orange-600">
                                    {formatPrice(price || 0)}
                                </span>
                            </>
                    }
                    <div className="p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M440-600v-120H320v-80h120v-120h80v120h120v80H520v120h-80ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z" /></svg>
                    </div>

                </div>
            </div>
        </div>
    )
}