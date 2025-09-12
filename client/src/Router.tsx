import React from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import HomePage from "./pages/customer/Home.tsx"
import Login from "./pages/auth/Login.tsx"
import Register from "./pages/auth/Register.tsx"

// manager
import { Manager, Dashboard, OrderManager } from "./pages/admin/index.tsx"
import {ProductManager, ProductDetail, CreateProduct, ModifyProduct} from "./pages/admin/product/index.ts"

export default function Router() {
    return (<>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/manager/" element={<Manager />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<ProductManager />} />
                    <Route path="products/:id" element={<ProductDetail />} />
                    <Route path="products/new" element={<CreateProduct />} />
                    <Route path="products/modify/:id" element={<ModifyProduct />} />
                    <Route path="orders" element={<OrderManager />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </>)
}
