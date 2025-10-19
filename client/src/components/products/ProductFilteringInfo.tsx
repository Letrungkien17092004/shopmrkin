import React from "react";

export default function ProductFilteringInfo() {
    return (
        <section className="home-product-list__applied-filters">
            <span className="home-product-list__applied-filters-label">Áp dụng lọc</span>
            <div className="home-product-list__applied-filters-list">
                <div className="home-product-list__applied-filter-item">
                    <span>Price: $10 - $1000</span>
                    <span className="home-product-list__applied-filter-item-delete">X</span>
                </div>
                <div className="home-product-list__applied-filter-item">
                    <span>Còn hàng</span>
                    <span className="home-product-list__applied-filter-item-delete">X</span>
                </div>
                <div className="home-product-list__applied-filter-item">
                    <span>Bán chạy</span>
                    <span className="home-product-list__applied-filter-item-delete">X</span>
                </div>
            </div>
            <div className="home-product-list__applied-filters-clear">
                <span>Xóa tất cả</span>
            </div>
        </section>
    )
}