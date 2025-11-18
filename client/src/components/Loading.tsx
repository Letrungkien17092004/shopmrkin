import React from "react";

export default function Loading() {
    return (<>
        <div className="w-full h-full flex flex-col justify-center items-center">
            <img src="/public/image/Yin_and_Yang.gif" alt="Loading" />
            <h3 className="text-lg text-sky-500">Loading...</h3>
        </div>
    </>)
}