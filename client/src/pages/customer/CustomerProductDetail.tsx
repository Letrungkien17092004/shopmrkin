import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.tsx";
import { AuthProvider } from "../../contexts/AuthContext.tsx";
import AuthService from "../../services/AuthService.ts";
const authService = new AuthService()

export default function CustomerProductDetail() {
    const { productId } = useParams()
    console.log(authService.accessIsExpired())
    return (
        <AuthProvider>
            <Navbar />
            <h1>Product detail ID: {productId}</h1>
        </AuthProvider>
    )
}