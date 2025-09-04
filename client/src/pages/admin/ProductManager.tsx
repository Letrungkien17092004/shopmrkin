import React, { useCallback, useEffect, useState } from "react";
import ProductService from "../../services/ProductService.ts";
import type { Product } from "../../services/ProductService.ts";
import { NormalButton, DangerButton } from "../../components/buttons/Button.tsx";

const productService = new ProductService()
export default function ProductManager() {
    const [products, setProducts] = useState<Product[]>([])
    console.log(products)

    // initial data
    useEffect(() => {
        const controller = new AbortController()
        const fetch = async () => {
            setProducts(await productService.getData())
        }

        fetch()
        return () => controller.abort()
    }, [])

    const OnDeleteItem = useCallback((id: string) => {
        return async (e: React.MouseEvent) => {
            e.stopPropagation()
            await productService.deleteById(id)
            setProducts(prev => prev.filter(prod => prod.id !== id))
        }
    }, [])
    return (<>
        <div className="pad-24px h-full-vh">
            <div className="h-10pt">
                <span className="text-3xl font-normal">
                    Danh sách sản phẩm
                </span>
            </div>
            <div className="dash-dark"></div>
            <div className="h-90pt product-table-wrapper overflow-scroll-y">
                <table className="product-table text-sm font-normal">
                    <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Ảnh</th>
                            <th>Tên SP</th>
                            <th>Khoảng giá</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(prod => (
                            <tr key={prod.id}>
                                <td title={prod.id} className="product-table-id">{prod.id}</td>
                                <td className="product-image">
                                    <img src={prod.imgUrl} alt="Tên SP" />
                                </td>
                                <td>{prod.productName}</td>
                                <td className="price">{prod.minPrice} - {prod.maxPrice}</td>
                                <td className="stock">{prod.stock}</td>
                                <td className="actions">
                                    <NormalButton>Chi tiết</NormalButton>
                                    <DangerButton onClick={OnDeleteItem(prod.id)}>Xóa</DangerButton>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    </>)
}