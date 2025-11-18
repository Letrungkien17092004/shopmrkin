import React, { useCallback, useEffect, useState } from "react";
import Loading from "../../components/Loading.tsx";
import AuthService from "../../services/AuthService.ts";
const authService = new AuthService()


export default function AuthGoogleCallback() {
    const [handleState, setHandleState] = useState<"idle" | "pending" | "done" | "error">("idle")
    const fragment = window.location.hash.substring(1)
    const params = new URLSearchParams(fragment)

    useEffect(() => {
        if (handleState === "idle") {
            const state = params.get("state")
            const access_token = params.get("access_token")
            if (!state || !access_token) {
                setHandleState("error")
                return
            }

            const login = async () => {
                const success = await authService.LoginWithGooogle(state, access_token)
                setHandleState(success ? "done" : "error")
            }
            login()
            setHandleState("pending")
        }
    }, [handleState])

    const goBackHomeEvent = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        window.location.href = "/"
    }, [])

    if (handleState === "pending" || handleState === "idle") {
        return (<>
            <main className="w-screen h-screen flex justify-center items-center">
                <Loading />
            </main>
        </>)
    } else if (handleState === "error") {
        return (<>
            <main className="w-screen h-screen flex justify-center items-center">
                <div className="text-center">
                    <h1 className="text-2xl text-red-400 font-bold">Đăng nhập thất bại! Vui lòng thử lai sau</h1>
                    <p onClick={goBackHomeEvent} className="underline text-lg text-green-500 cursor-pointer">Về trang chủ</p>
                </div>
            </main>
        </>)
    }

    return (<>
        <main className="w-screen h-screen flex justify-center items-center">
            <div className="text-center">
                <h1 className="text-2xl text-black font-bold">Đăng nhập thành công!</h1>
                <p onClick={goBackHomeEvent} className="underline text-lg text-green-500 cursor-pointer">Về trang chủ</p>
            </div>
        </main>
    </>)
}