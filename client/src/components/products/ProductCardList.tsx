import React, { useEffect, useState } from "react"
import ProductService from "../../services/ProductService.ts"
import { Product } from "../../entities/index.ts"
import ProductCard from "./ProductCard.tsx"
import ProductSortingOptions from "./ProductSortingOptions.tsx"
import ProductFilteringInfo from "./ProductFilteringInfo.tsx"
import { Link } from "react-router-dom"
const productService = new ProductService()

export default function ProductCardList() {
    const [products, setProducts] = useState<Product[]>([])

    // fetching products
    useEffect(() => {
        const fetchData = async () => {
            const fetchedProduct = await productService.getAll({
                include: {
                    variants: true,
                    media: true
                }
            })
            setProducts(fetchedProduct)
        }
        fetchData()
    }, [])
    return (<>
        <section className="home-product-list">
            {/* header */}
            <section className="home-product-list__header">
                <div className="home-product-list__header__result-count">
                    <span>Tìm thấy {products.length} kết quả</span>
                </div>
                <ProductSortingOptions />
            </section>

            <ProductFilteringInfo />

            <section className="home-product-list__items">
                <div className="grid">
                    <div className="row">

                        {products.map(p => (
                            <div key={p.id} className="col c-6 m-6 l-3">
                                <Link className="text-base disable-link" to={`/product-detail/${p.id}`}>
                                    <ProductCard
                                        imgURL={`${p.thumbnailURL}`}
                                        discount={0}
                                        starPoint={5}
                                        name={p.name}
                                        price={p.maxPrice || 0}
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </section>

    </>)
}