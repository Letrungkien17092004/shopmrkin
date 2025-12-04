import React, { useCallback, useEffect, useState } from "react";
import AuthService from "../../services/AuthService.ts";

const authService = new AuthService()


export default function LoginWithGoogle() {
    const [state, setState] = useState<"idle" | "pending">("idle")

    const onClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (state === "pending") { return } // if pending then skip
        setState("pending")
    }, [state])

    // redirect to Google Oauth
    useEffect(() => {
        if (state === "idle") { return }  // if idle then skip
        const fetchData = async () => {
            try {
                const googleOauthUrl = await authService.getGoogleOauth2Url()
                window.location.href = googleOauthUrl
            } catch (error) {
                window.alert("Có lỗi xảy ra vui lòng thử lại sau!")
            } finally {
                setState("idle")
            }
        }
        fetchData()
    }, [state])
    return (<>
        <div onClick={onClick} className="flex flex-center cursor-pointer">
            <img src="/public/image/google-48.png" alt="google-icon" />
        </div>
    </>)
}