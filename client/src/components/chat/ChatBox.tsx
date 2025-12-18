import React from "react";
import ChatMessage from "./ChatMessage.tsx";
import ChatMessagePending from "./ChatMessagePending.tsx";
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "../../store/index.ts"

export default function ChatBox() {
    const { assistantMessages, send_status } = useSelector((state: RootState) => state.assistant)
    return (
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3 flex flex-col">
            {!assistantMessages || assistantMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <img src="/image/chatbot.png" alt="Chat" className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-sm font-medium">Xin chào! 👋</p>
                    <p className="text-xs">Hãy bắt đầu cuộc trò chuyện với tôi</p>
                </div>
            ) : (
                <>
                    {assistantMessages.map((message, index) => (
                        <div key={index}>
                            <ChatMessage message={message} />
                        </div>
                    ))}
                    {
                        send_status==="loading"&&(<ChatMessagePending/>)
                    }
                </>
            )}
        </div>
    );
}