import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductService, { Product } from "../../../services/ProductService.ts";

const productService = new ProductService()
export default function ModifyProduct() {
    return (<>
    <h1>Edit product</h1>
    </>)
}
