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

const AuthContext = createContext<AuthContextType>({ isLogin: false })

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
            if (isLogin_) {
                console.error("Log in AuthContext: already login but have no profile")
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
    return context
}