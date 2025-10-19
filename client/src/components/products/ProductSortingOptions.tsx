import React from "react"

export default function ProductSortingOptions() {
    return (<>
        <div className="home-list-product__header__sort">
            <span className="home-list-product__header__sort-label">Xắp sếp theo:</span>
            <div className="home-list-product__header__sort-select-wrapper">
                <select className="home-list-product__header__sort-select" name="list-product-sort-select" id="list-product-sort-select">
                    <option value="default">Mặc định</option>
                    <option value="increment">Giá tăng dần</option>
                    <option value="descrement">Giá giảm dần</option>
                </select>
            </div>
        </div>
    </>)
}