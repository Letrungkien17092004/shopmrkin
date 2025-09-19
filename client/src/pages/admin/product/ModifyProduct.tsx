import React, { useEffect, useState } from "react";
import ProductModifyForm from "./ProductModifyForm.tsx";
import { useParams } from "react-router-dom";

export default function ModifyProduct() {
    const { id } = useParams()
    if (!id) return <><h1>WTF</h1></>
    return (<>
        <div className="pad-12px h-full-vh  overflow-scroll-y">
            <h1>Chỉnh sửa sản phẩm</h1>
            <div className="dash-dark"></div>
            <ProductModifyForm id ={id}/>
        </div>
    </>)

}
