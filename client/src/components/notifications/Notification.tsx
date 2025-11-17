import React, { useState } from "react";
import type { NotificationType } from "../../hooks/useNotificationController.ts";

interface NotificationProps {
    message: string;
    type: NotificationType;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(true);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300); // đợi animation xong mới remove
    };

    const getPositionClass = () => {
        switch (type) {
            case "center":
                return "notification-center";
            case "top-center":
                return "notification-top-center";
            case "bottom-right":
                return "notification-bottom-right";
            default:
                return "";
        }
    };

    return (
        <div className={`notification ${getPositionClass()} ${visible ? "show" : "hide"}`}>
            <span>{message}</span>
            <button className="close-btn" onClick={handleClose}>
                ×
            </button>
        </div>
    );
};

export default Notification;
