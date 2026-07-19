'use client'

import React, { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ProductService, VariantService, AuthService } from "@/services/index.ts"
import { Product, Variant } from "@/types/product/index.ts"
import { getMinPrice, getMaxPrice } from "@/utils/index.ts"
import ProductImageSlider from "@/components/products/ProductImageSlider.tsx"

const authService = new AuthService()
const productService = new ProductService(authService)

interface VariantListProps {
    variants: Variant[],
    selectedVariant: Variant | undefined,
    createSelectedEvent: (id: string) => ((e: React.MouseEvent) => void) | undefined
}

function VariantList({ variants, selectedVariant, createSelectedEvent }: VariantListProps) {
    return (
        <>
            {variants.map(v => {
                const isSelected = selectedVariant && selectedVariant.id === v.id
                return (
                    <div
                        key={v.sku}
                        onClick={createSelectedEvent(v.id)}
                        className={`cursor-pointer select-none rounded shadow-[0_4px_12px_rgba(0,0,0,0.3)] ${
                            isSelected
                                ? "bg-green-400"
                                : "hover:ring hover:ring-green-500"
                        }`}
                    >
                        <div className={`w-full p-1 px-2 text-sm text-center text-nowrap ${isSelected ? "text-white" : "text-black"}`}>
                            {v.name}
                        </div>
                    </div>
                )
            })}
        </>
    )
}

export default function AdminProductDetailPage() {
    const params = useParams()
    const id = params?.id as string | undefined
    const [product, setProduct] = useState<Product | null>(null)
    const [defaultPrice, setDefaultPrice] = useState<string | undefined>(undefined)
    const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(undefined)

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const searchedProduct = await productService.findById(id)
                if (searchedProduct) {
                    setDefaultPrice(`${getMinPrice(searchedProduct.variants)} - ${getMaxPrice(searchedProduct.variants)}`)
                }
                setProduct(searchedProduct)
            }
        }
        fetchData()
    }, [id])

    const createSelectedEvent = useCallback((variantId: string) => {
        if (!product) { return }
        if (product.variants.length <= 0) { return }
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            if (selectedVariant && selectedVariant.id === variantId) {
                setSelectedVariant(undefined)
                return
            }
            setSelectedVariant(product.variants.find(v => v.id === variantId))
        }
    }, [product, selectedVariant])

    if (!product) {
        return <h1>Không tìm thấy sản phẩm này</h1>
    }

    return (
        <section className="p-6 h-[80vh] overflow-y-scroll">
            <div className="w-full mt-3 sm:flex sm:justify-end">
                <div className="w-[70%] mx-auto sm:w-1/3 sm:mr-36">
                    <ProductImageSlider
                        images={product.media.map(med => ({ url: `${med.filePath}` }))}
                    />
                </div>
                <div className="w-[70%] mx-auto sm:w-1/3">
                    <div className="w-full">
                        <p title={product.name} className="text-lg text-black line-clamp-4">
                            {product.name}
                        </p>
                        <p className="text-2xl font-semibold text-orange-500">
                            {selectedVariant ? `${selectedVariant.price}` : defaultPrice}
                        </p>
                        <div className="w-full mt-3 flex justify-start items-center flex-wrap gap-2">
                            <p className="text-base font-bold flex items-center">Tùy chọn:</p>
                            <VariantList
                                variants={product.variants}
                                selectedVariant={selectedVariant}
                                createSelectedEvent={createSelectedEvent}
                            />
                        </div>
                        <div className="w-full mt-4">
                            <div className="inline-block rounded p-2 text-base font-normal bg-sky-500 text-white cursor-pointer hover:scale-105 transition">
                                <Link href="#">Chỉnh sửa</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <p className="text-base font-light">{product.description}</p>
            </div>
        </section>
    )
}
