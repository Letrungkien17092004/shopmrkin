import React from "react";
import { Link } from "react-router-dom";
import LoginWithGoogle from "../../components/auth/LoginWithGoogle.tsx";

export default function Login() {
    return (
        <main className="min-h-screen flex items-center justify-center py-6 bg-gray-50">
            <section className="w-full max-w-md bg-white rounded-lg shadow p-8">
                <h1 className="text-center text-2xl font-semibold mb-6">
                    Đăng nhập
                </h1>

                <form className="flex flex-col gap-4">
                    {/* error message */}
                    <div className="text-red-500 text-sm pl-2">
                        ** <span>Tài khoản không hợp lệ</span>
                    </div>

                    {/* inputs */}
                    <input
                        autoComplete="on"
                        name="email"
                        type="email"
                        placeholder="Tài khoản"
                        className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        autoComplete="on"
                        name="password"
                        type="password"
                        placeholder="Mật khẩu"
                        className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* terms */}
                    <label className="flex items-center text-sm mt-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="mr-2 h-4 w-4 accent-blue-600"
                            name="agree"
                        />
                        Tôi đồng ý với&nbsp;
                        <a href="/terms" target="_blank" className="text-blue-600 underline">
                            các điều khoản
                        </a>
                        &nbsp;và&nbsp;
                        <a href="/policy" target="_blank" className="text-blue-600 underline">
                            chính sách
                        </a>
                    </label>

                    {/* link register */}
                    <div className="text-sm mt-1">
                        Chưa có tài khoản? <b>đăng ký</b>&nbsp;
                        <Link to="/register" className="text-blue-600 underline">
                            tại đây
                        </Link>
                    </div>

                    {/* action button */}
                    <button
                        type="submit"
                        onClick={(e) => e.preventDefault()}
                        className="mt-4 h-12 w-full bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 transition"
                    >
                        Đăng nhập
                    </button>
                </form>

                {/* divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="px-3 text-gray-500 text-sm">Hoặc đăng nhập với</span>
                    <div className="flex-1 h-px bg-gray-300" />
                </div>

                {/* google login */}
                <div className="flex justify-center">
                    <LoginWithGoogle />
                </div>
            </section>
        </main>
    );
}
