import React, { useCallback, useEffect, useState } from "react";
import AuthService from "../services/AuthService.ts";

const authService = new AuthService()


export default function LoginWithGoogle() {
    const [state, setState] = useState<"pending" | "processing">("pending")

    const onClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (state === "processing") { return }
        setState("processing")
    }, [state])

    // redirect to Google Oauth
    useEffect(() => {
        if (state !== "processing") { return }
        const fetchData = async () => {
            const googleOauthUrl = await authService.getGoogleOauth2Url()
            window.location.href = googleOauthUrl
        }
        fetchData()
    }, [state])
    return (<>
        <div onClick={onClick} className="flex flex-center cursor-pointer">
            <img src="/public/image/google-48.png" alt="google-icon" />
        </div>
    </>)
}