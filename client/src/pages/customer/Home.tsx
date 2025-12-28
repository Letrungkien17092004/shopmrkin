import React, { useEffect } from "react";
import { MainLayout } from "../../components/layout/index.tsx"

import {
    HomeProductFilter,
    HomeShowProduct,
} from "../../components/products/index.ts"

export default function Home() {
    return (
        <MainLayout>
            <section className="sm:mt-6 w-full h-fit lg:w-[1000px] mx-auto">
                <div className="grid grid-cols-12 gap-x-3">
                    <div className="col-span-12 md:col-span-3">
                        <HomeProductFilter />
                    </div>
                    <div className="col-span-12 md:col-span-9">
                        <HomeShowProduct />
                    </div>
                </div>
            </section>
            {/* <ChatContainer /> */}
        </MainLayout>
    )
}