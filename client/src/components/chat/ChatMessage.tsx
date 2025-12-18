import React from "react";
import { ChatListRecommends } from "./index.tsx"
import { AssistantMessage } from "../../types/chat/index.ts"

interface ChatMessageProps {
    message: AssistantMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (<>

        <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
            {!isUser && (
                <img
                    src="/image/chatbot.png"
                    alt="Assistant"
                    className="w-8 h-8 rounded-full shrink-0 mt-1"
                />
            )}
            <div
                className={`max-w-xs px-4 py-2 rounded-lg wrap-break-words ${isUser
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
            >
                <p className="text-sm leading-relaxed">{message.message}</p>
            </div>
        </div>

        {
            !isUser&&
            message.recommend_products &&
            message.recommend_products.length > 0
            && (<ChatListRecommends message={message}/>)

            // !isUser && (<ChatListRecommends message={message} />)
        }
    </>);
}