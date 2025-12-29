import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import Loading from "../components/waiter/Loading.tsx";
import AuthService from "../services/AuthService.ts";
const authService = new AuthService()


interface Profile {
    id: string,
    email: string,
    account: string,
    username: string,
    picture: string,
    cartId: string,
    role: string
}

interface AuthContextType {
    profile?: Profile,
    status: "idle" | "pending" | "succeed" | "failed",
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<Profile | undefined>(undefined)
    const [status, setStatus] = useState<"idle" | "pending" | "succeed" | "failed">("idle")
    const logout = useCallback(() => {
        authService.logout()
        setProfile(undefined)
    }, [])

    useEffect(() => {
        const isRefeshTokenExpired = authService.refeshIsExpired()
        const profile_ = authService.getProfile()
        if (isRefeshTokenExpired) {
            setProfile(undefined)
            setStatus("failed")
        } else {
            profile_
            setProfile(profile_)
            setStatus("succeed")
        }
    }, [])

    if (status === "idle" || status === "pending") {
        return <>
            <div className="w-screen h-screen flex justify-center items-center">
                <Loading />
            </div>
        </>
    }

    return (
        <AuthContext.Provider value={{ profile, logout, status }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuthContext must be used in AuthProvider")
    }
    return context
}