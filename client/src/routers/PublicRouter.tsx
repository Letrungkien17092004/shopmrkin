import { Route } from "react-router-dom";
import Home from "../pages/customer/Home.tsx"
import ShowProductDetail from "../pages/customer/ShowProductDetail.tsx"
import Login from "../pages/auth/Login.tsx"
import Register from "../pages/auth/SignIn.tsx"
import AuthGoogleCallback from "../pages/auth/AuthGoogleCallback.tsx"

export default function PublicRouter() {
    return (
        <>
            <Route path="/" element={<Home />} />
            <Route path="/product-detail/:productId" element={<ShowProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-in" element={<Register />} />
            <Route path="/auth/google/callback" element={<AuthGoogleCallback />} />
        </>
    );
}