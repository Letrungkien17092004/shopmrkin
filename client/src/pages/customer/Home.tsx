import "./style.css"
import React, { useEffect } from "react";
import { Navbar } from "../../components/nav/index.tsx";
import ProductCardList from "../../components/products/ProductCardList.tsx";
import ProductFilter from "../../components/products/ProductFilter.tsx";
import { AuthProvider } from "../../contexts/AuthContext.tsx";


export default function Home() {
    return (
        <AuthProvider>
            <Navbar />
            <section className="home-main-content">
                <div className="grid">
                    <div className="row">
                        <div className="col c-12 m-12 l-3">
                            <ProductFilter />
                        </div>
                        <div className="col c-12 m-12 l-9">
                            <ProductCardList />
                        </div>
                    </div>
                </div>
            </section>
        </AuthProvider>
    )
}