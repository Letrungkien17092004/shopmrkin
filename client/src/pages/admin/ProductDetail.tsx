import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NormalButton, DangerButton } from "../../components/buttons/Button.tsx";
import ProductService from "../../services/ProductService.ts";
import type { Product } from "../../services/ProductService.ts";

const productService = new ProductService()
export default function ProductDetail() {
    const { id } = useParams()
    const [product, setProduct] = useState<Product | null>(null)

    useEffect(() => {
        const fetdata = async () => {
            if (id) {
                const searchProduct = await productService.findById(id)
                setProduct(searchProduct)
            } else {
                throw new Error("id param is not found")
            }
        }

        fetdata()
    }, [])

    if (!product) {
        return (<>
            <h1>Không tìm thấy sản phẩm này</h1>
        </>)
    }

    return (<>
        <section className="pad-24px">
            <div className="w-full">
                <div className="grid">
                    <div className="row no-gutters">
                        {/* product section */}
                        <div className="col l-8">
                            {/* image and name, price, stock */}
                            <div className="w-full">
                                <div className="grid">
                                    <div className="row no-gutters">
                                        {/* image */}
                                        <div className="col l-7">
                                            <div className="w-full">
                                                <img className="image-contain" src={product.imgUrl} alt={`img ${product.productName}`} />
                                            </div>
                                        </div>
                                        {/* name, price, stock */}
                                        <div className="col l-5">
                                            {/* name */}
                                            <div className="w-full pad-bot-12px">
                                                <p className="paragraph font-medium">
                                                    {product.productName}
                                                </p>
                                            </div>
                                            {/* price */}
                                            <div className="w-full text-color-price font-medium pad-bot-12px">{product.minPrice}đ - {product.maxPrice}đ</div>
                                            {/* stock */}
                                            <div className="w-full font-bold pad-bot-12px">Stock: {product.stock}</div>
                                            {/* actions */}
                                            <div className="w-full">
                                                <NormalButton>Chỉnh sửa</NormalButton>
                                                <DangerButton>Xóa</DangerButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dash-dark"></div>
                            {/* description */}
                            <div className="w-full">
                                <p className="paragraph text-sm">
                                    {product.description}
                                </p>
                            </div>
                        </div>

                        {/* variant section */}
                        <div className="col l-4">
                            <div className="mar-left-12px pad-12px">
                                <div className="text-lg font-medium">
                                    <span>Phân loại</span>
                                </div>
                                <div className="dash-dark"></div>
                                <div className="flex-flex-col">
                                    <div className="cursor-pointer w-full">
                                        <div className="grid">
                                            <div className="row no-gutters">
                                                <div className="col l-3">
                                                    <img className="image-contain" src="/public/image/van_hi.jpg" alt="van hi" />
                                                </div>
                                                <div className="col l-9">
                                                    <div className="flex align-center  h-full">
                                                        AKSNC-129
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cursor-pointer w-full">
                                        <div className="grid">
                                            <div className="row no-gutters">
                                                <div className="col l-3">
                                                    <img className="image-contain" src="/public/image/van_hi.jpg" alt="van hi" />
                                                </div>
                                                <div className="col l-9">
                                                    <div className="flex align-center  h-full">
                                                        AKSNC-130
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cursor-pointer w-full">
                                        <div className="grid">
                                            <div className="row no-gutters">
                                                <div className="col l-3">
                                                    <img className="image-contain" src="/public/image/van_hi.jpg" alt="van hi" />
                                                </div>
                                                <div className="col l-9">
                                                    <div className="flex align-center  h-full">
                                                        AKSNC-131
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>)
}