import React, { useEffect } from "react";
import HomeNavbar from "./HomeNavbar.tsx";
import HomeListProduct from "./HomeListProduct.tsx";
import HomeFilter from "./HomeFilter.tsx";
import { AuthProvider } from "../../contexts/AuthContext.tsx";

function HomeContentLayout() {
    return (<>
        <main className="home-main-content">
            <div className="grid">
                <div className="row">
                    <div className="col c-12 m-12 l-3">
                        <HomeFilter />
                    </div>
                    <div className="col c-12 m-12 l-9">
                        <HomeListProduct />
                    </div>
                </div>
            </div>
        </main>
    </>)
}
export default function Home() {
    return (
        <AuthProvider>
            <HomeNavbar />
            <HomeContentLayout />
        </AuthProvider>
    )
}