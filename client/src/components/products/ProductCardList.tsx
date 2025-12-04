import React, { useEffect, useState } from "react"
import { ProductService, AuthService } from "../../services/index.ts"
import { Product } from "../../types/product/index.ts"
import {
    getTotalStock,
    getMinPrice,
    getMaxPrice,
    makeThumbnailURL
} from "../../utils/index.ts"

import ProductCard from "./ProductCard.tsx"
import ProductSortingOptions from "./ProductSortingOptions.tsx"
import ProductFilteringInfo from "./ProductFilteringInfo.tsx"
import { Link } from "react-router-dom"

const authService = new AuthService()
const productService = new ProductService(authService)

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
        <section className="w-full mt-4 px-4 pb-12">
            {/* header */}
            <section className="flex justify-between">
                <div className="flex justify-center items-center text-sm text-gray-500">
                    <span>Tìm thấy {products.length} kết quả</span>
                </div>
                <ProductSortingOptions />
            </section>

            <ProductFilteringInfo />

            <section className="mt-2 w-full">
                <div className="grid grid-cols-12 gap-y-4 gap-x-3">
                    {products.map(p => (
                        <div key={p.id} className="col-span-6 sm:col-span-4 lg:col-span-3">
                            <Link className="text-base no-underline" to={`/product-detail/${p.id}`}>
                                <ProductCard
                                    imgURL={`${makeThumbnailURL(p.media)}`}
                                    discount={0}
                                    starPoint={5}
                                    name={p.name}
                                    price={getMaxPrice(p.variants)}
                                />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </section>

    </>)
}