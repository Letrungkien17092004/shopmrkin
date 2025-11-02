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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<Profile | undefined>(undefined)

    useEffect(() => {
            const profile_ = authService.getProfile()
            setProfile(profile_)
    }, [])

    return (
        <AuthContext.Provider value={{ profile: profile}}>
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