import { Route } from "react-router-dom";
import { Manager, Dashboard, OrderManager } from "../pages/admin/index.tsx"
import { ProductManager, ProductDetail, CreateProduct, ModifyProduct } from "../pages/admin/product/index.ts"
import { ProtectedRoute } from "./ProtectedRoute.tsx";

export default function PrivateRouter() {
    return (
        <>
            {/* Admin route */}
            <Route path="/manager/" element={<ProtectedRoute allowedRoles={['admin']}><Manager /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<ProductManager />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="products/new" element={<CreateProduct />} />
                <Route path="products/modify/:id" element={<ModifyProduct />} />
                <Route path="orders" element={<OrderManager />} />
            </Route>
        </>
    );
}