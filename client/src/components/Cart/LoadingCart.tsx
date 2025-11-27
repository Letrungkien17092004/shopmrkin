import React from "react";
import Loading from "../Loading.tsx";

export default function LoadingCart() {
    return <>
        <div className="z-1 absolute right-0 top-[120%] w-md h-48 shadow-[0_4px_12px_rgba(0,0,0,0.3)] rounded-sm bg-white">
            <div className="w-full h-full flex justify-center items-center text-xl font-bold text-red-500">
                <Loading/>
            </div>
        </div>
    </>
}