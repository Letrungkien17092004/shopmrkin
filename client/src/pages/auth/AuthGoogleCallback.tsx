import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading.tsx";
import AuthService from "../../services/AuthService.ts";
import { Link } from "react-router-dom";
const authService = new AuthService()


export default function AuthGoogleCallback() {
    const [state, setState] = useState<"pending" | "done" | "error">("pending")
    const fragment = window.location.hash.substring(1)
    const params = new URLSearchParams(fragment)
    
    useEffect(() => {
        const state = params.get("state")
        const access_token = params.get("access_token")
        if (!state || !access_token) {
            setState("error")
            return
        }

        const login = async () => {
            const success = await authService.LoginWithGooogle(state, access_token)
            setState(success ? "done" : "error")
        }
        login()
    }, [])
    if (state === "pending") {
        return (<>
            <main className="w-full h-full-vh flex flex-center">
                <Loading />
            </main>
        </>)
    } else if (state === "error") {
        return (<>
            <main className="w-full h-full-vh  flex flex-col flex-center">
                <h1>Đăng nhập thất bại! Vui lòng thử lai sau</h1>
                <Link to="/">Về trang chủ</Link>
            </main>
        </>)
    }

    return (<>
        <main className="w-full h-full-vh  flex flex-col flex-center">
            <h1>Đăng nhập thành công!</h1>
            <Link to="/">Xong</Link>
        </main>
    </>)
}