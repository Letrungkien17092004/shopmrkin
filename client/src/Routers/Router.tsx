import React from "react"
import { BrowserRouter, Routes } from "react-router-dom"


import Test from "../pages/test/Test.tsx"
import PublicRouter from "./PublicRouter.tsx"
import PrivateRouter from "./PrivateRouter.tsx"
export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                {PublicRouter()}

                {PrivateRouter()}

                {/* <Route path="/test" element={<Test />} /> */}
            </Routes>
        </BrowserRouter>
    );
}







