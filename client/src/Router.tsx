import React from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Home from "./pages/customer/Home.tsx"
import CustomerProductDetail from "./pages/customer/CustomerProductDetail.tsx"
import Login from "./pages/auth/Login.tsx"
import Register from "./pages/auth/Register.tsx"
import AuthGoogleCallback from "./pages/auth/AuthGoogleCallback.tsx"
// manager
import { Manager, Dashboard, OrderManager } from "./pages/admin/index.tsx"
import {ProductManager, ProductDetail, CreateProduct, ModifyProduct} from "./pages/admin/product/index.ts"
import Test from "./pages/test/Test.tsx"

export default function Router() {
    return (<>
        <BrowserRouter>
            <Routes>
                {/* Customer route */}
                <Route path="/" element={<Home />} />
                <Route path="/product-detail/:productId" element={<CustomerProductDetail />} />

                {/* Auth route */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/google/callback" element={<AuthGoogleCallback/>}></Route>

                {/* Admin route */}
                <Route path="/manager/" element={<Manager />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<ProductManager />} />
                    <Route path="products/:id" element={<ProductDetail />} />
                    <Route path="products/new" element={<CreateProduct />} />
                    <Route path="products/modify/:id" element={<ModifyProduct />} />
                    <Route path="orders" element={<OrderManager />} />
                </Route>

                
                <Route path="/test" element={<Test />} />
            </Routes>
        </BrowserRouter>
    </>)
}
