import { useState } from "react";

export type NotificationType = "center" | "top-center" | "bottom-right";

export interface NotificationItem {
    id: number;
    message: string;
    type: NotificationType;
}

let idCounter = 0;

export default function useNotificationController() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    const pushNotification = (options: { message: string, type: NotificationType }) => {
        const id = ++idCounter;
        setNotifications((prev) => [...prev, { id, message: options.message, type: options.type }]);

        // Auto remove nếu là bottom-right
        if (options.type === "bottom-right") {
            setTimeout(() => {
                removeNotification(id);
            }, 3000);
        }
    };

    const removeNotification = (id: number) => {
        return () => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }
    };

    return {
        notifications,
        pushNotification,
        removeNotification,
    };
}
