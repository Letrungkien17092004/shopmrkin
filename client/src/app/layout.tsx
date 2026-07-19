import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import "@/main.css"
import Providers from "./providers.tsx"

const openSans = Open_Sans({
    subsets: ["latin"],
    variable: "--font-open-sans",
})

export const metadata: Metadata = {
    title: "Shopmrkin",
    icons: {
        icon: "/image/logo.png",
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="vi" className={openSans.variable}>
            <body style={{ fontFamily: "var(--font-open-sans), sans-serif" }}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
