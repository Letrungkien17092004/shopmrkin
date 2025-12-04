import React, { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../../contexts/AuthContext.tsx"
import { Cart } from "../cart/index.ts"
import UserProfile from "./UserProfile.tsx"

export default function Navivation() {
    const { profile } = useAuthContext()
    return (<>
        <nav className="w-full h-fit lg:w-[1000px] mx-auto shadow-md">
            <div className="grid grid-cols-12">
                {/* logo */}
                <div className="col-span-6 md:col-span-3 lg:col-span-2">
                    <div className="inline-block p-2 text-2xl capitalize bg-green-600 text-white">
                        <Link className="no-underline" to="/">Shopmrkin</Link>
                    </div>
                </div>
                {/* menu */}
                <div className="hidden md:block md:col-span-7 lg:col-span-7">
                    <div className="flex w-full h-full items-center justify-end gap-x-4">
                        <div className="text-lg cursor-pointer hover:text-green-500">
                            <span>Home</span>
                        </div>
                        <div className="text-lg cursor-pointer hover:text-green-500">
                            <span>Thời trang nam</span>
                        </div>
                        <div className="text-lg cursor-pointer hover:text-green-500">
                            <span>Thời trang nữ</span>
                        </div>
                        <div className="text-lg cursor-pointer hover:text-green-500">
                            <span>Phụ kiện nam nữ</span>
                        </div>
                    </div>
                </div>
                {/* actions */}
                <div className="col-span-6 md:col-span-2 lg:col-span-3">
                    <div className="flex h-full justify-end items-center mr-6">
                        <Cart />
                        {
                            profile
                                ?
                                <>
                                    <UserProfile profile={profile} />
                                </>
                                :
                                <>
                                    <div className="flex items-center gap-x-1">
                                        <Link className="text-black hover:text-green-500" to="/login">Đăng nhập</Link>
                                        <Link className="text-black hover:text-green-500" to="/sign-in">Đăng ký</Link>
                                    </div>
                                </>
                        }

                    </div>
                </div>
            </div>
        </nav>
    </>)
}