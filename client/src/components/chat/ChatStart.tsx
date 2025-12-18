import React from "react"
import { ChatWindow } from "./index.tsx"

export default function ChatStart() {
    return <>
        <div className="p-2 cursor-pointer">
            <div
                className="
                    p-1 w-fit h-fit rounded-full
                    shadow-[0_8px_25px_rgba(0,0,0,0.35)]
                    transition-transform duration-300
                    hover:scale-110
                "
            >
                <img className="w-15 h-15" src="/image/chatbot.png" alt="chatbot icon" />
            </div>
        </div>
    </>
}