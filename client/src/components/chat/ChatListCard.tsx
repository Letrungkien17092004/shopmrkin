import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../services/ProductService.ts";
import AuthService from "../../services/AuthService.ts";
import { Product } from "../../types/product/index.ts"
import { getMinPrice, getMaxPrice, makeThumbnailURL, formatPrice } from "../../utils/index.ts"
const authService = new AuthService()
const productService = new ProductService(authService)

interface Props {
    productId: string
}

export default function ChatListCard({ productId }: Props) {
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | undefined>(undefined)

    useEffect(() => {
        const fetch = async () => {
            const searchProduct = await productService.findById(productId)
            if (searchProduct) {
                setProduct(searchProduct)
            }
        }

        fetch()
    }, [])
    return (
        <div
            onClick={() => navigate(`/product-detail/${productId}`)}
            className="shrink-0 w-32 bg-white rounded-lg border border-gray-300 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow hover:border-blue-400"
        >
            {/* Product Image */}
            <div className="w-full h-28 p-2 bg-gray-100 flex items-center justify-center overflow-hidden">
                <div className="text-gray-400 text-center">
                    <img className="" src={`${makeThumbnailURL(product?.media)}`} alt="" />
                </div>
            </div>

            {/* Product Info */}
            <div className="p-2">
                {/* Product name */}
                <p className="text-xs text-gray-500 truncate mb-1">{product?.name}</p>

                {/* Price */}
                <div className="bg-blue-50 rounded px-2 py-1.5">
                    <p className="text-xs text-gray-600 mb-0.5">Giá:</p>
                    <p className="text-sm font-bold text-blue-600">
                        {/* Placeholder for price */}
                        {formatPrice(getMinPrice(product?.variants) || 0)}
                    </p>
                </div>
            </div>
        </div>
    )
}