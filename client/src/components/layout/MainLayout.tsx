import React from "react";
import { MainNav } from "../nav/index.tsx"

interface Props {
    children: React.ReactNode
}
export default function MainLayout({ children }: Props) {
    return (<>
        <div className="w-full">
            <MainNav />
            {
                children
            }
        </div>
    </>)
}