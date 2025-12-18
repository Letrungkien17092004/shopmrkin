import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatService from "../../../services/ChatService.ts";
import { Chat } from "../../../types/chat/index.ts";

const chatService = new ChatService();

export default function ChatDetail() {
    const { chatId } = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const [chat, setChat] = useState<Chat | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadChat();
    }, [chatId]);

    const loadChat = async () => {
        if (!chatId) return;
        try {
            setLoading(true);
            const data = await chatService.findById(chatId);
            if (!data) {
                navigate("/manager/chats");
                return;
            }
            setChat(data);
        } catch (error) {
            console.error("Error loading chat:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleString("vi-VN");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-slate-500">Đang tải...</div>
            </div>
        );
    }

    if (!chat) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-slate-500">Chat không tìm thấy</div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Chi tiết Chat</h1>
                    <p className="text-sm text-slate-500 mt-1 font-mono">{chat.id}</p>
                </div>
                <button
                    onClick={() => navigate("/manager/chats")}
                    className="px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition"
                >
                    Quay lại
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Chat Info */}
                <div className="col-span-1 space-y-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Thông tin</h2>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase">
                                    Trạng thái
                                </label>
                                <div className="mt-1">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            chat.isSpam
                                                ? "bg-red-100 text-red-800"
                                                : "bg-green-100 text-green-800"
                                        }`}
                                    >
                                        {chat.isSpam ? "Spam" : "Hợp lệ"}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase">
                                    Đã trích xuất
                                </label>
                                <div className="mt-1">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            chat.isExtracted
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {chat.isExtracted ? "Có" : "Không"}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase">
                                    Ngày tạo
                                </label>
                                <p className="mt-1 text-sm text-slate-700">
                                    {formatDate(chat.createdAt)}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase">
                                    Cập nhật lần cuối
                                </label>
                                <p className="mt-1 text-sm text-slate-700">
                                    {formatDate(chat.updatedAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Extracted Data */}
                    {chat.isExtracted && !chat.isSpam && chat.extractedData && (
                        <div className="bg-white rounded-lg shadow p-4">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                Dữ liệu trích xuất
                            </h2>
                            <div className="space-y-2 text-sm">
                                {chat.extractedData.username && (
                                    <div>
                                        <label className="font-semibold text-slate-600">
                                            Tên người dùng:
                                        </label>
                                        <p className="text-slate-700">{chat.extractedData.username}</p>
                                    </div>
                                )}
                                {chat.extractedData.phone && (
                                    <div>
                                        <label className="font-semibold text-slate-600">
                                            Điện thoại:
                                        </label>
                                        <p className="text-slate-700">{chat.extractedData.phone}</p>
                                    </div>
                                )}
                                {chat.extractedData.interest && (
                                    <div>
                                        <label className="font-semibold text-slate-600">
                                            Sở thích:
                                        </label>
                                        <p className="text-slate-700">{chat.extractedData.interest}</p>
                                    </div>
                                )}
                                {chat.extractedData.category && (
                                    <div>
                                        <label className="font-semibold text-slate-600">
                                            Danh mục:
                                        </label>
                                        <p className="text-slate-700">{chat.extractedData.category}</p>
                                    </div>
                                )}
                                {!chat.extractedData.username && 
                                 !chat.extractedData.phone && 
                                 !chat.extractedData.interest && 
                                 !chat.extractedData.category && (
                                    <p className="text-slate-500 text-center py-4">Không có dữ liệu trích xuất</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Messages */}
                <div className="col-span-2 bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">
                        Tin nhắn ({chat.messages?.length || 0})
                    </h2>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {chat.messages && chat.messages.length > 0 ? (
                            chat.messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        message.role === "USER" ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-lg ${
                                            message.role === "USER"
                                                ? "bg-emerald-500 text-white"
                                                : "bg-slate-100 text-slate-800"
                                        }`}
                                    >
                                        <p className="text-sm">{message.message}</p>
                                        <p
                                            className={`text-xs mt-1 ${
                                                message.role === "USER"
                                                    ? "text-emerald-100"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {formatDate(message.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                Không có tin nhắn
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}