import React from "react"

export default function HomeListProduct() {
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
                        <div className="col c-6 m-4 l-3">
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
                        <div className="col c-6 m-4 l-3">
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
                        <div className="col c-6 m-4 l-3">
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
                        <div className="col c-6 m-4 l-3">
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
                        <div className="col c-6 m-4 l-3">
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
                        <div className="col c-6 m-4 l-3">
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
                        <div className="col c-6 m-4 l-3">
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
                        <div className="col c-6 m-4 l-3">
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
                        <div className="col c-6 m-4 l-3">
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
                        <div className="col c-6 m-4 l-3">
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