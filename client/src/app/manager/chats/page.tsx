'use client'

import React, { useEffect, useState } from "react"
import Link from "next/link"
import ChatService from "@/services/ChatService.ts"
import { Chat } from "@/types/chat/index.ts"

const chatService = new ChatService()

export default function ChatsPage() {
    const [chats, setChats] = useState<Chat[]>([])
    const [loading, setLoading] = useState(true)
    const [extracting, setExtracting] = useState(false)

    useEffect(() => {
        loadChats()
    }, [])

    const loadChats = async () => {
        try {
            setLoading(true)
            const data = await chatService.findMany()
            setChats(data)
        } catch (error) {
            console.error("Error loading chats:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleExtract = async () => {
        try {
            setExtracting(true)
            await chatService.extractor()
            window.alert("Trích xuất xong")
            await loadChats()
        } catch (error) {
            console.error("Error extracting:", error)
            window.alert("Trích xuất không thành công")
        } finally {
            setExtracting(false)
        }
    }

    const handleExportCSV = () => {
        const filteredChats = chats.filter(chat => chat.isExtracted && !chat.isSpam)
        if (filteredChats.length === 0) {
            window.alert("Không có dữ liệu để xuất")
            return
        }
        const headers = ["Username", "Phone", "Interest", "Category"]
        const csvContent = [
            headers.join(","),
            ...filteredChats.map(chat => {
                return [
                    chat.extractedData?.username || "",
                    chat.extractedData?.phone || "",
                    chat.extractedData?.interest || "",
                    chat.extractedData?.category || "",
                ].map(field => `"${field}"`.replace(/"/g, '""')).join(",")
            })
        ].join("\n")
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `chat_data_${new Date().getTime()}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleString("vi-VN")
    }

    const getPreview = (chat: Chat) => {
        if (chat.messages && chat.messages.length > 0) {
            return chat.messages[chat.messages.length - 1].message.substring(0, 50)
        }
        return "Không có tin nhắn"
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Quản lý Chat</h1>
                <div className="flex gap-3">
                    <button
                        onClick={loadChats}
                        disabled={loading}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Đang tải..." : "Làm tươi"}
                    </button>
                    <button
                        onClick={handleExtract}
                        disabled={extracting}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {extracting ? "Đang trích xuất..." : "Trích xuất dữ liệu"}
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
                    >
                        Xuất CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-slate-500">Đang tải...</div>
                    </div>
                ) : chats.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-slate-500">Không có chat nào</div>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Tin nhắn cuối</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Số lượng tin</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Trích xuất</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Ngày tạo</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {chats.map((chat) => (
                                <tr key={chat.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 text-sm text-slate-600">{getPreview(chat)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{chat.messages?.length || 0}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            chat.isSpam ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                        }`}>
                                            {chat.isSpam ? "Spam" : "Hợp lệ"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            chat.isExtracted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}>
                                            {chat.isExtracted ? "Đã trích xuất" : "Chưa trích xuất"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(chat.createdAt)}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <Link
                                            href={`/manager/chats/${chat.id}`}
                                            className="text-emerald-600 hover:text-emerald-700 font-medium"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
