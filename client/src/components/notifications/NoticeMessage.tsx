import React from "react";

interface Props {
    message: string,
    noticeType: "normal" | "error" | "warning"
}
export default function NoticeMessage({ message, noticeType }: Props) {
    const className = {
        "normal": "w-fit max-w-md flex justify-center items-center not-first:mt-1 p-1 bg-blue-400 text-blue-50 shadow-xl text-justify line-clamp-4",
        "error": "w-fit max-w-md flex justify-center items-center p-1 not-first:mt-1 bg-red-400 text-blue-50 shadow-xl text-justify line-clamp-4",
        "warning": "w-fit max-w-md flex justify-center items-center p-1 not-first:mt-1 bg-yellow-500 text-black shadow-xl text-justify line-clamp-4"
    }

    const noticeIcon = {
        "normal": <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" /></svg>,
        "error": <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>,
        "warning": <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/></svg>,
    }
    return <>
        <div className={className[noticeType]}>
            <span className="px-1">
                {
                    noticeIcon[noticeType]
                }
            </span>
            <span>{message}</span>
        </div>
    </>
}