import React, { useState } from "react";
import {
    NoticeMessage
} from "./index.tsx"

interface NoticeManagerProps {
    noticeList: {
        message: string,
        noticeType: "normal" | "error" | "warning"
    }[]
}
export default function NoticeManager({noticeList = []}: NoticeManagerProps) {

    return (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 p-1">
            <div className="flex flex-col items-center justify-start">
                {
                    noticeList.map( (notice, idx) => (
                        <NoticeMessage
                            key={Date.now() + idx}
                            noticeType={notice.noticeType}
                            message={notice.message}
                        />
                    ))
                }
            </div>
        </div>
    )
}
