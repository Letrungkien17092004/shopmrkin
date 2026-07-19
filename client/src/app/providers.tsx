'use client'

import React from "react"
import { Provider } from "react-redux"
import { store } from "@/store/index.ts"
import { AuthProvider } from "@/contexts/AuthContext.tsx"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </Provider>
    )
}
