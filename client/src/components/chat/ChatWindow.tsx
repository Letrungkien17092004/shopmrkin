import React, { useState } from "react"
import ChatBox from "./ChatBox.tsx"
import ChatInput from "./ChatInput.tsx"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "../../store/index.ts"


interface props {
    toggleIsOpenEvent: (e: React.MouseEvent) => void
}
export default function ChatWindow({ toggleIsOpenEvent }: props) {

    return (
        <div className="w-xl h-[500px] flex flex-col bg-white rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.35)] overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <img src="/image/chatbot.png" alt="AI Assistant" className="w-8 h-8" />
                    <div>
                        <h3 className="font-semibold text-lg">AI Assistant</h3>
                        <p className="text-xs text-blue-100">Always here to help</p>
                    </div>
                </div>
                <button
                    onClick={toggleIsOpenEvent}
                    className="text-white hover:bg-blue-700 rounded-full p-1 transition-colors"
                    title="Đóng"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Messages Box */}
            <ChatBox/>

            {/* Input */}
            <ChatInput/>
        </div>
    )
}