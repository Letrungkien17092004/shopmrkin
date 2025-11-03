import "./style.css"
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../../components/nav/index.tsx";
import { AuthProvider } from "../../contexts/AuthContext.tsx";
import { ProductImageSlider } from "../../components/products/index.tsx"
import Loading from "../../components/Loading.tsx";
import ProductService from "../../services/ProductService.ts";
import { Product, Variant } from "../../entities/index.ts";

const productService = new ProductService()
const containerStyle: React.CSSProperties = {
    maxWidth: "1000px",
    margin: "0 auto"
}

interface VariantListProps {
    variants: Variant[],
    selectedVariant: Variant | undefined,
    createSelectedEvent: (id: string) => ((e: React.MouseEvent) => void) | undefined
}

function VariantList({ variants, selectedVariant, createSelectedEvent }: VariantListProps) {
    return <>
        {variants.map(v => {

            return (
                <div onClick={createSelectedEvent(v.id)} key={v.sku} className="col l-6 mar-top-4px">
                    {
                        selectedVariant && selectedVariant.id === v.id
                            ? <>
                                <div className="w-full pad-4px border-radius-4px text-center text-sm variant-options variant-options--selected">
                                    {v.name}
                                </div>
                            </>
                            : <>
                                <div className="w-full pad-4px border-radius-4px text-center text-sm variant-options">
                                    {v.name}
                                </div>
                            </>
                    }
                </div>
            )
        })}
    </>
}

export default function CustomerProductDetail() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [product, setProduct] = useState<Product | undefined>(undefined)
    const [defaultPrice, setDefaultPrice] = useState<string | undefined>(undefined)
    const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(undefined)
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

    const createSelectedEvent = useCallback((id: string) => {
        if (!product) { return }
        if (product.variants.length <= 0) { return }
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            if (selectedVariant && selectedVariant.id === id) {
                setSelectedVariant(undefined)
                return
            }
            setSelectedVariant(product.variants.find(v => v.id === id))
        }
    }, [product, selectedVariant])
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
                                    <ProductImageSlider
                                    images={product.media.map(med => ({ url: `${med.hostname}${med.filePath}` }))}
                                    />
                                </div>
                                {/* info (name, price, variant, ...) */}
                                <div className="col c-11 m-6 l-4">
                                    <div className="w-full">
                                        <p className="text-xl font-semibold">
                                            {product.name}
                                        </p>

                                        <p className="text-xl font-semibold text-color-priceHightlight">
                                            {selectedVariant ? `${selectedVariant.price}` : defaultPrice}
                                        </p>

                                        {/* variant options */}
                                        <div className="w-full mar-top-12px">
                                            <p className="text-base font-normal">Tùy chọn:</p>
                                            <div className="grid">
                                                <div className="row">
                                                    <VariantList
                                                    variants={product.variants}
                                                    selectedVariant={selectedVariant}
                                                    createSelectedEvent={createSelectedEvent}
                                                    />
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