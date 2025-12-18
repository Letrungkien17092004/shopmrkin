import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "../../store/index.ts"
import { sendMessage, createChat } from "../../store/assistantSlice.ts"

export default function ChatInput() {
    const [input, setInput] = useState("");
    const { assistantChat, create_status } = useSelector((state: RootState) => state.assistant)
    const dispatch: AppDispatch = useDispatch()

    const [isSend, setIsSend] = useState<boolean>(false)

    useEffect(() => {
        if (!assistantChat) {
            dispatch(createChat())
        }
    }, [dispatch])

    const sendEvent = async () => {
        const trimmedInput = input.trim();

        if (!trimmedInput || !assistantChat || isSend || create_status === "loading") {
            return;
        }

        try {
            setIsSend(true);
            await dispatch(sendMessage({
                message: trimmedInput,
                chatId: assistantChat.id
            })).unwrap();

            setInput("");
        } catch (error) {
            console.error("Gửi tin nhắn thất bại:", error);
        } finally {
            setIsSend(false);
        }
    };

    return (
        <div className="border-t border-gray-200 bg-white p-4 flex gap-2">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendEvent();
                    }
                }}
                placeholder="Nhập tin nhắn..."
                disabled={create_status === "loading" || isSend}
                rows={1}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100"
            />
            <button
                onClick={sendEvent}
                disabled={!input.trim() || create_status === "loading" || isSend}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {(create_status === "loading" || isSend) ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    <span>Gửi</span>
                )}
            </button>
        </div>
    );
}