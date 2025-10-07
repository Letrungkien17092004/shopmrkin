import React from "react"

export default function HomeFilter() {
    return (<>
        <section className="home-filter">
            <div className="heading-1"><span>Lựa chọn lọc</span></div>

            <div className="home-filter-by">
                <div className="heading-2"><span>Lọc theo danh mục</span></div>
                <ul className="home-filter-by__list">
                    <li className="filter-list-items"> Điện thoại </li>
                    <li className="filter-list-items"> Máy tính </li>
                    <li className="filter-list-items"> Laptop </li>
                    <li className="filter-list-items"> PC </li>
                    <li className="filter-list-items"> Thời trang nam </li>
                    <li className="filter-list-items"> Thời trang nữ </li>
                </ul>
            </div>

            <div className="home-filter-by">
                <div className="heading-2">Lọc theo tình trạng</div>
                <ul className="home-filter-by__list">
                    <li className="filter-list-items"> Đồ cũ </li>
                    <li className="filter-list-items"> Like new </li>
                    <li className="filter-list-items"> Mới </li>
                </ul>
            </div>
        </section>
    </>)
}