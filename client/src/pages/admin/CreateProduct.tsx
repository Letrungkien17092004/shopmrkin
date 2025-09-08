import React from "react";
import ProductForm from "./ProductForm.tsx";

export default function CreateProduct() {
    return (<>
        <div className="pad-12px h-full-vh  overflow-scroll-y">
            <h1>Thêm sản phẩm</h1>
            <div className="dash-dark"></div>
            <ProductForm/>
        </div>
    </>)
}
