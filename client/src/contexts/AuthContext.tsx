import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import AuthService from "../services/AuthService.ts";
const authService = new AuthService()


interface Profile {
    id: string,
    email: string,
    account: string,
    username: string,
    picture: string,
    role: string
}

interface AuthContextType {
    profile?: Profile,
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<Profile | undefined>(undefined)

    const logout = useCallback(() => {
        authService.logout()
        setProfile(undefined)
    }, [])

    useEffect(() => {
        const isRefeshTokenExpired = authService.refeshIsExpired()
        const profile_ = authService.getProfile()

        if (isRefeshTokenExpired) {
            setProfile(undefined)
        } else {
            setProfile(profile_)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ profile: profile, logout: logout }}>
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