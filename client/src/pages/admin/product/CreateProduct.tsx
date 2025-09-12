import React from "react";
import ProductCreateForm from "./ProductCreateForm.tsx";

export default function CreateProduct() {
    return (<>
        <div className="pad-12px h-full-vh  overflow-scroll-y">
            <h1>Thêm sản phẩm</h1>
            <div className="dash-dark"></div>
            <ProductCreateForm/>
        </div>
    </>)
}
