import "./style.css"
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../../components/nav/index.tsx";
import { AuthProvider } from "../../contexts/AuthContext.tsx";
import { ProductImageSlider } from "../../components/products/index.tsx"
import Loading from "../../components/Loading.tsx";
import ProductService from "../../services/ProductService.ts";
import { Product } from "../../entities/index.ts";

const productService = new ProductService()
const containerStyle: React.CSSProperties = {
    maxWidth: "1000px",
    margin: "0 auto"
}
export default function CustomerProductDetail() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [product, setProduct] = useState<Product | undefined>(undefined)
    const [defaultPrice, setDefaultPrice] = useState<string | undefined>(undefined)
    const [price, setPrice] = useState<number | undefined>(undefined)
    const { productId } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            const productData = await productService.findById(productId!)
            if (productData) {
                setProduct(productData)
                setDefaultPrice(`${productData.minPrice} ${productData.maxPrice}`)
            }
            setIsLoading(false)
        }
        fetchData()
    }, [])
    if (isLoading) {
        return (
            <div className="w-full h-full-vh flex flex-center">
                <Loading />
            </div>
        )
    }

    if (isLoading === false && product === undefined) {
        return (
            <div className="w-full h-full-vh flex flex-center">
                <h1>Không tìm thấy sản phẩm bạn yêu cầu</h1>
            </div>
        )
    }

    if (product) {
        return (
            <AuthProvider>
                <div style={containerStyle}>
                    <Navbar />
                    <div className="w-full mar-top-12px">
                        <div className="grid">
                            <div className="row justify-center">
                                {/* Slider */}
                                <div className="col c-11 m-6 l-6">
                                    <ProductImageSlider images={product.media.map(med => ({ url: `${med.hostname}${med.filePath}` }))} />
                                </div>
                                {/* info (name, price, variant, ...) */}
                                <div className="col c-11 m-6 l-4">
                                    <div className="w-full">
                                        <p className="text-xl font-semibold">
                                            {product.name}
                                        </p>

                                        <p className="text-xl font-semibold text-color-priceHightlight">
                                            {defaultPrice}
                                        </p>

                                        {/* variant options */}
                                        <div className="w-full mar-top-12px">
                                            <p className="text-base font-normal">Tùy chọn:</p>
                                            <div className="grid">
                                                <div className="row">
                                                    {product.variants.map(v => {
                                                        return (
                                                            <div key={v.sku} className="col l-6 mar-top-4px">
                                                                <div className="w-full pad-4px border-radius-4px text-center border-style1 text-sm box-hover-style1">
                                                                    {v.name}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* actions */}
                                        <div className="w-full mar-top-8px">
                                            <div className="text-base font-normal add-card-btn">
                                                Thêm vào giỏ hàng
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dash-dark"></div>
                            {/* description */}
                            <div className="row no-gutters justify-center">
                                <div className="col l-10">
                                    <p className="text-base font-light">{product.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthProvider>
        )
    }
}