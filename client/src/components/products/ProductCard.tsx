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
        <div className="product__item">
            <div style={{ backgroundImage: `url(${imgURL})` }} className="product__item__image">
            </div>
            {/* if discount == 0 then hide discount */}
            {
                discount > 0 && <>
                    <div className="product__discount">
                        {discount} %
                    </div>
                </>
            }
            <div className="product__item__info">
                <div className="product__item__info--score">
                    <img src="/public/svg/star-solid-full.svg" alt="" />
                    <span>{starPoint}</span>
                </div>
                <div className="product__item__info--name">
                    <span>{name}</span>
                </div>
                <div className="product__item__info__wraper">
                    {/* if discount <=0 then hiden origin price */}
                    {
                        discount > 0
                            ? <>
                                <span className="product__item__info--priceAfterDiscount">
                                    {price * ((100 - discount) / 100)}
                                </span>
                                <span className="product__item__info--origin-price">
                                    {price}
                                </span>
                            </>
                            : <>
                                <span className="product__item__info--priceAfterDiscount">
                                    {price}
                                </span>
                            </>
                    }
                </div>
            </div>
        </div>
    )
}