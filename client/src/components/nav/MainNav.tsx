import React, { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useAuthContext } from "../../contexts/AuthContext.tsx"
import { Cart } from "../cart/index.tsx"
import UserProfile from "../user/UserProfile.tsx"

export default function MainNav() {
    const { profile } = useAuthContext()
    return (<>
        <nav className="w-full h-fit shadow-md">
            <div className="w-full lg:w-[80%] mx-auto">
                <div className="grid grid-cols-12">
                    {/* logo */}
                    <div className="col-span-6 md:col-span-3 lg:col-span-2">
                        <div className="inline-block p-2 text-2xl uppercase text-green-500">
                            <Link className="no-underline" href="/">Shopmrkin</Link>
                        </div>
                    </div>
                    {/* menu */}
                    <div className="hidden md:block md:col-span-7 lg:col-span-7">
                        <div className="flex w-full h-full items-center justify-center lg:justify-end gap-x-4">
                            <div className="text-lg cursor-pointer hover:text-green-500">
                                <span>Điện thoại</span>
                            </div>
                            <div className="text-lg cursor-pointer hover:text-green-500">
                                <span>PC</span>
                            </div>
                            <div className="text-lg cursor-pointer hover:text-green-500">
                                <span>Latop</span>
                            </div>
                            <div className="text-lg cursor-pointer hover:text-green-500">
                                <span>Thời trang</span>
                            </div>
                            <div className="md:hidden lg:block text-lg cursor-pointer hover:text-green-500">
                                <span>Thời trang nam</span>
                            </div>
                            <div className="md:hidden text-lg cursor-pointer hover:text-green-500">
                                <span>Thời trang nữ</span>
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
                                            <Link className="text-black hover:text-green-500" href="/login">Đăng nhập</Link>
                                            <Link className="text-black hover:text-green-500" href="/sign-in">Đăng ký</Link>
                                        </div>
                                    </>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </>)
}