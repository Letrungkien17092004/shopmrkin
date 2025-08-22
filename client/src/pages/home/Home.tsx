import React from "react";
import HomeNavbar from "./HomeNavbar.tsx";

function HomeFilterOptions() {
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

function HomeListProduct() {
    return (<>
        <section className="home-list-product">
            {/* header */}
            <section className="home-list-product__header">
                <div className="home-list-product__header__result-count">
                    <span>Hiển thị 12/2560 kết quả</span>
                </div>
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
            </section>

            {/* applied filters */}
            <section className="home-list-product__applied-filters">
                <span className="home-list-product__applied-filters-label">Áp dụng lọc</span>
                <div className="home-list-product__applied-filters-list">
                    <div className="home-list-product__applied-filter-item">
                        <span>Price: $10 - $1000</span>
                        <span className="home-list-product__applied-filter-item-delete">X</span>
                    </div>
                    <div className="home-list-product__applied-filter-item">
                        <span>Còn hàng</span>
                        <span className="home-list-product__applied-filter-item-delete">X</span>
                    </div>
                    <div className="home-list-product__applied-filter-item">
                        <span>Bán chạy</span>
                        <span className="home-list-product__applied-filter-item-delete">X</span>
                    </div>
                </div>
                <div className="home-list-product__applied-filters-clear">
                    <span>Xóa tất cả</span>
                </div>
            </section>
            <section className="home-list-product__items">
                <div className="grid">
                    <div className="row">
                        <div className="col l-3">
                            <div className="product__item">
                                <div className="product__item__image">
                                    <img src="https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-mafv9rx9y364f7.webp" alt="" />
                                    <div className="product__item__image-off-value">
                                        <span>15%</span>
                                    </div>
                                </div>
                                <div className="product__item__info">
                                    <div className="product__item__info--score">
                                        <img src="/public/svg/star-solid-full.svg" alt="" />
                                        <span>4.9</span>
                                    </div>
                                    <div className="product__item__info--name">
                                        <span>ĐIỆN THOẠI SAMSUNG S24 ULTRA 5G RAM12GB ascn jcjacs najcnjas cnajcnsj jacna ncjasjc</span>
                                    </div>
                                    <div className="product__item__info__wraper">
                                        <span className="product__item__info--real-cost">
                                            18.599.000
                                        </span>
                                        <span className="product__item__info--origin-cost">
                                            22.000.000
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col l-3">
                            <div className="product__item">
                                <div className="product__item__image">
                                    <img src="https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-mafv9rx9y364f7.webp" alt="" />
                                    <div className="product__item__image-off-value">
                                        <span>15%</span>
                                    </div>
                                </div>
                                <div className="product__item__info">
                                    <div className="product__item__info--score">
                                        <img src="/public/svg/star-solid-full.svg" alt="" />
                                        <span>4.9</span>
                                    </div>
                                    <div className="product__item__info--name">
                                        <span>ĐIỆN THOẠI SAMSUNG S24 ULTRA 5G RAM12GB ascn jcjacs najcnjas cnajcnsj jacna ncjasjc</span>
                                    </div>
                                    <div className="product__item__info__wraper">
                                        <span className="product__item__info--real-cost">
                                            18.599.000
                                        </span>
                                        <span className="product__item__info--origin-cost">
                                            22.000.000
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col l-3">
                            <div className="product__item">
                                <div className="product__item__image">
                                    <img src="https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-mafv9rx9y364f7.webp" alt="" />
                                    <div className="product__item__image-off-value">
                                        <span>15%</span>
                                    </div>
                                </div>
                                <div className="product__item__info">
                                    <div className="product__item__info--score">
                                        <img src="/public/svg/star-solid-full.svg" alt="" />
                                        <span>4.9</span>
                                    </div>
                                    <div className="product__item__info--name">
                                        <span>ĐIỆN THOẠI SAMSUNG S24 ULTRA 5G RAM12GB ascn jcjacs najcnjas cnajcnsj jacna ncjasjc</span>
                                    </div>
                                    <div className="product__item__info__wraper">
                                        <span className="product__item__info--real-cost">
                                            18.599.000
                                        </span>
                                        <span className="product__item__info--origin-cost">
                                            22.000.000
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col l-3">
                            <div className="product__item">
                                <div className="product__item__image">
                                    <img src="https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-mafv9rx9y364f7.webp" alt="" />
                                    <div className="product__item__image-off-value">
                                        <span>15%</span>
                                    </div>
                                </div>
                                <div className="product__item__info">
                                    <div className="product__item__info--score">
                                        <img src="/public/svg/star-solid-full.svg" alt="" />
                                        <span>4.9</span>
                                    </div>
                                    <div className="product__item__info--name">
                                        <span>ĐIỆN THOẠI SAMSUNG S24 ULTRA 5G RAM12GB ascn jcjacs najcnjas cnajcnsj jacna ncjasjc</span>
                                    </div>
                                    <div className="product__item__info__wraper">
                                        <span className="product__item__info--real-cost">
                                            18.599.000
                                        </span>
                                        <span className="product__item__info--origin-cost">
                                            22.000.000
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col l-3">
                            <div className="product__item">
                                <div className="product__item__image">
                                    <img src="https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-mafv9rx9y364f7.webp" alt="" />
                                    <div className="product__item__image-off-value">
                                        <span>15%</span>
                                    </div>
                                </div>
                                <div className="product__item__info">
                                    <div className="product__item__info--score">
                                        <img src="/public/svg/star-solid-full.svg" alt="" />
                                        <span>4.9</span>
                                    </div>
                                    <div className="product__item__info--name">
                                        <span>ĐIỆN THOẠI SAMSUNG S24 ULTRA 5G RAM12GB ascn jcjacs najcnjas cnajcnsj jacna ncjasjc</span>
                                    </div>
                                    <div className="product__item__info__wraper">
                                        <span className="product__item__info--real-cost">
                                            18.599.000
                                        </span>
                                        <span className="product__item__info--origin-cost">
                                            22.000.000
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col l-3">
                            <div className="product__item">
                                <div className="product__item__image">
                                    <img src="https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-mafv9rx9y364f7.webp" alt="" />
                                    <div className="product__item__image-off-value">
                                        <span>15%</span>
                                    </div>
                                </div>
                                <div className="product__item__info">
                                    <div className="product__item__info--score">
                                        <img src="/public/svg/star-solid-full.svg" alt="" />
                                        <span>4.9</span>
                                    </div>
                                    <div className="product__item__info--name">
                                        <span>ĐIỆN THOẠI SAMSUNG S24 ULTRA 5G RAM12GB ascn jcjacs najcnjas cnajcnsj jacna ncjasjc</span>
                                    </div>
                                    <div className="product__item__info__wraper">
                                        <span className="product__item__info--real-cost">
                                            18.599.000
                                        </span>
                                        <span className="product__item__info--origin-cost">
                                            22.000.000
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col l-3">
                            <div className="product__item">
                                <div className="product__item__image">
                                    <img src="https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-mafv9rx9y364f7.webp" alt="" />
                                    <div className="product__item__image-off-value">
                                        <span>15%</span>
                                    </div>
                                </div>
                                <div className="product__item__info">
                                    <div className="product__item__info--score">
                                        <img src="/public/svg/star-solid-full.svg" alt="" />
                                        <span>4.9</span>
                                    </div>
                                    <div className="product__item__info--name">
                                        <span>ĐIỆN THOẠI SAMSUNG S24 ULTRA 5G RAM12GB ascn jcjacs najcnjas cnajcnsj jacna ncjasjc</span>
                                    </div>
                                    <div className="product__item__info__wraper">
                                        <span className="product__item__info--real-cost">
                                            18.599.000
                                        </span>
                                        <span className="product__item__info--origin-cost">
                                            22.000.000
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col l-3">
                            <div className="product__item">
                                <div className="product__item__image">
                                    <img src="https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-mafv9rx9y364f7.webp" alt="" />
                                    <div className="product__item__image-off-value">
                                        <span>15%</span>
                                    </div>
                                </div>
                                <div className="product__item__info">
                                    <div className="product__item__info--score">
                                        <img src="/public/svg/star-solid-full.svg" alt="" />
                                        <span>4.9</span>
                                    </div>
                                    <div className="product__item__info--name">
                                        <span>ĐIỆN THOẠI SAMSUNG S24 ULTRA 5G RAM12GB ascn jcjacs najcnjas cnajcnsj jacna ncjasjc</span>
                                    </div>
                                    <div className="product__item__info__wraper">
                                        <span className="product__item__info--real-cost">
                                            18.599.000
                                        </span>
                                        <span className="product__item__info--origin-cost">
                                            22.000.000
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col l-3">
                            <div className="product__item">
                                <div className="product__item__image">
                                    <img src="https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-mafv9rx9y364f7.webp" alt="" />
                                    <div className="product__item__image-off-value">
                                        <span>15%</span>
                                    </div>
                                </div>
                                <div className="product__item__info">
                                    <div className="product__item__info--score">
                                        <img src="/public/svg/star-solid-full.svg" alt="" />
                                        <span>4.9</span>
                                    </div>
                                    <div className="product__item__info--name">
                                        <span>ĐIỆN THOẠI SAMSUNG S24 ULTRA 5G RAM12GB ascn jcjacs najcnjas cnajcnsj jacna ncjasjc</span>
                                    </div>
                                    <div className="product__item__info__wraper">
                                        <span className="product__item__info--real-cost">
                                            18.599.000
                                        </span>
                                        <span className="product__item__info--origin-cost">
                                            22.000.000
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col l-3">
                            <div className="product__item">
                                <div className="product__item__image">
                                    <img src="https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-mafv9rx9y364f7.webp" alt="" />
                                    <div className="product__item__image-off-value">
                                        <span>15%</span>
                                    </div>
                                </div>
                                <div className="product__item__info">
                                    <div className="product__item__info--score">
                                        <img src="/public/svg/star-solid-full.svg" alt="" />
                                        <span>4.9</span>
                                    </div>
                                    <div className="product__item__info--name">
                                        <span>ĐIỆN THOẠI SAMSUNG S24 ULTRA 5G RAM12GB ascn jcjacs najcnjas cnajcnsj jacna ncjasjc</span>
                                    </div>
                                    <div className="product__item__info__wraper">
                                        <span className="product__item__info--real-cost">
                                            18.599.000
                                        </span>
                                        <span className="product__item__info--origin-cost">
                                            22.000.000
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>

    </>)
}

function HomeContentLayout() {
    return (<>
        <main className="home-main-content">
            <div className="grid">
                <div className="row">
                    <div className="col l-3">
                        <HomeFilterOptions />
                    </div>
                    <div className="col l-9">
                        <HomeListProduct />
                    </div>
                </div>
            </div>
        </main>
    </>)
}
export default function HomePage() {
    return (<>
        <HomeNavbar />
        <HomeContentLayout />
    </>)
}