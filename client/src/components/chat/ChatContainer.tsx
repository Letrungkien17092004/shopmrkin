import React, { useCallback, useState } from "react";
import { ChatWindow, ChatStart } from "./index.tsx"

export default function ChatContainer() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleIsOpenEvent = useCallback((e: React.MouseEvent) => {
        setIsOpen(prev => !prev)
    }, [])
    return (
        <div className="fixed right-4 bottom-0 z-50 flex flex-col items-end gap-3">
            {/* Cửa sổ chat */}
            {isOpen && (
                <div className="mb-2">
                    <ChatWindow toggleIsOpenEvent={toggleIsOpenEvent} />
                </div>
            )}

            {/* Nút bắt đầu chat */}
            {!isOpen && (
                <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                    <ChatStart />
                </div>
            )}
        </div>
    );
}