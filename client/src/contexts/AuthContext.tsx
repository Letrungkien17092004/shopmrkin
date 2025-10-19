import React, { createContext, useContext, useEffect, useState } from "react";
import AuthService from "../services/AuthService.ts";
const authService = new AuthService()


interface Profile {
    id: string,
    email: string,
    account: string,
    username: string,
    picture: string
}

interface AuthContextType {
    profile?: Profile,
    isLogin: boolean,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLogin, setIsLogin] = useState<boolean>(false)
    const [profile, setProfile] = useState<Profile | undefined>(undefined)

    useEffect(() => {
        const isLogin_ = authService.getIsLogin()
        try {
            const profile_ = authService.getProfile()
            setProfile(profile_)
            setIsLogin(true)
        } catch (error) {
            // if already login but have no profile
            if (error instanceof Error) {
                if (isLogin_ && error.message === "profile is invalid") {
                    console.error("Log in AuthContext: already login but have no profile")
                    setIsLogin(false)
                }
            }
        }
    }, [])

    return (
        <AuthContext.Provider value={{ profile: profile, isLogin: isLogin }}>
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