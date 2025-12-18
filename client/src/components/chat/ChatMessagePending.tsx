import React from "react";

export default function ChatMessagePending() {
    return (
        <div className="flex justify-start gap-2">
            <img
                src="/image/chatbot.png"
                alt="Assistant"
                className="w-8 h-8 rounded-full shrink-0 mt-1"
            />
            <div className="max-w-xs px-4 py-2 rounded-lg rounded-bl-none bg-gray-200">
                <div className="flex items-center gap-1.5">
                    {/* Animated typing dots */}
                    <div className="flex gap-1">
                        <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
                        <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                        <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    </div>
                    <span className="text-xs text-gray-500 ml-1">AI đang suy nghĩ...</span>
                </div>
            </div>
        </div>
    );
}