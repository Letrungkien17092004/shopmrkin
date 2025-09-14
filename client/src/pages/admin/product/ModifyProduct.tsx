import React, { useEffect, useState } from "react";
import ProductModifyForm from "./ProductModifyForm.tsx";
import { useParams } from "react-router-dom";
import ProductService, { Product } from "../../../services/ProductService.ts";

const productService = new ProductService()
export default function ModifyProduct() {
    const [prod, setProd] = useState<Product | undefined>()
    const { id } = useParams()

    // load product
    useEffect(() => {
        if (id) {
            const findProd = async () => {
                const prod = await productService.findById(id)
                setProd(prod || undefined)
            }
            findProd()
        }
    }, [])
    if (prod) {
        return (<>
            <div className="pad-12px h-full-vh  overflow-scroll-y">
                <h1>Chỉnh sửa sản phẩm</h1>
                <div className="dash-dark"></div>
                <ProductModifyForm product={prod} />
            </div>
        </>)
    } else {
        return (<>
            <h3>Không tìm thấy sản phẩm hoặc sản phẩm không còn tồn tại</h3>
        </>)
    }

}
