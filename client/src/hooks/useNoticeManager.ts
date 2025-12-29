import { useCallback, useEffect, useRef, useState } from "react"

interface NoticeType {
    message: string,
    noticeType: "normal" | "error" | "warning"
}

interface UseNoticeManagerReturnType {
    noticeList: NoticeType[],
    pushMessage: (newNotice: NoticeType) => void,
}

export default function useNoticeManager(): UseNoticeManagerReturnType {
    const noticeRef = useRef<NoticeType[]>([])
    const [noticeList, setNoticeList] = useState<NoticeType[]>([]) // for rendering

    const pushMessage = useCallback((newNotice: NoticeType) => {
        const noticeArrCurrent = noticeRef.current
        noticeArrCurrent.push(newNotice)
        setNoticeList([...noticeArrCurrent]) 

        // auto delete
        let timeToDelete = 3000 // default
        timeToDelete = newNotice.noticeType==="error"?5000:timeToDelete // 5s for error notice
        timeToDelete = newNotice.noticeType==="warning"?4000:timeToDelete // 4s for error notice
        setTimeout(() => {
            popFirstMessage()
        }, timeToDelete)
    }, [])

    const popFirstMessage = useCallback(() => {
        const noticeArrCurrent = noticeRef.current
        if (noticeArrCurrent.shift()) {
            setNoticeList([...noticeArrCurrent]) 
        }
    }, [])

    // auto delete oldest message after every 3 seconds
    // useEffect(() => {
    //     const myinterval = setInterval(() => {
    //         if (noticeRef.current.length > 0) {
    //             popFirstMessage()
    //         }
    //     }, 3000)

    //     // clearn up function
    //     return () => {
    //         clearInterval(myinterval)
    //     }
    // }, [])

    return {
        noticeList,
        pushMessage
    }
}