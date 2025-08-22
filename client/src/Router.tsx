import React from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import HomePage from "./pages/home/Home.tsx"
import Login from "./pages/auth/Login.tsx"
import Register from "./pages/auth/Register.tsx"
import Dashboard from "./pages/admin/Dashboard.tsx"

export default function Router() {
    return (<>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    </>)
}
