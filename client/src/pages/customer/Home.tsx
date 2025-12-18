import React, { useEffect } from "react";
import { Navivation } from "../../components/nav/index.tsx";
import ProductCardList from "../../components/products/ProductCardList.tsx";
import ProductFilter from "../../components/products/ProductFilter.tsx";
import { ChatContainer } from "../../components/chat/index.tsx";

export default function Home() {
    return (<>
        <Navivation />
        <section className="sm:mt-6 w-full h-fit lg:w-[1000px] mx-auto">
            <div className="grid grid-cols-12 gap-x-3">
                <div className="col-span-12 md:col-span-3">
                    <ProductFilter />
                </div>
                <div className="col-span-12 md:col-span-9">
                    <ProductCardList />
                </div>
            </div>
        </section>
        <ChatContainer />
    </>
    )
}