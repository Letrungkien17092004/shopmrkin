import React from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import HomePage from "./pages/home/Home.tsx"
import Login from "./pages/auth/Login.tsx"
import Register from "./pages/auth/Register.tsx"
import Manager from "./pages/admin/Manager.tsx"
import Dashboard from "./pages/admin/Dashboard.tsx"
import ProductManager from "./pages/admin/ProductManager.tsx"
import OrderManager from "./pages/admin/OrderManager.tsx"
export default function Router() {
    return (<>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/manager/" element={<Manager />}>
                    <Route index element={<Dashboard/>}/>
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="products" element={<ProductManager/>}/>
                    <Route path="orders" element={<OrderManager/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </>)
}
