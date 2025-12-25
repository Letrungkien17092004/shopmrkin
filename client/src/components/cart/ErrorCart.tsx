import React from "react";


export default function ErrorCart() {
    return <>
        <div className="z-1 absolute right-0 top-[120%] w-md h-48 shadow-[0_4px_12px_rgba(0,0,0,0.3)] rounded-sm bg-white">
            <div className="w-full h-full flex justify-center items-center text-xl font-bold text-red-500">
                Oops có lỗi xảy ra!
            </div>
        </div>
    </>
}