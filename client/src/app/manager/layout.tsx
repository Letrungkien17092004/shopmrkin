'use client'

import React from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/contexts/AuthContext.tsx"
import { ManagerLayout } from "@/components/layout/index.tsx"
import Loading from "@/components/waiter/Loading.tsx"

export default function ManagerLayoutPage({
    children,
}: {
    children: React.ReactNode
}) {
    const { profile } = useAuthContext()
    const router = useRouter()

    if (!profile) {
        router.replace("/login")
        return (
            <main className="w-screen h-screen flex justify-center items-center">
                <Loading />
            </main>
        )
    }

    if (profile.role !== "administrator") {
        window.alert("deo co quyen")
        router.replace("/")
        return (
            <main className="w-screen h-screen flex justify-center items-center">
                <Loading />
            </main>
        )
    }

    return (
        <ManagerLayout>
            {children}
        </ManagerLayout>
    )
}
